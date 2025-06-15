<template>
	<div class="oauth-callback">
		<div class="callback-container">
			<div v-if="isProcessing" class="processing">
				<div class="loading-spinner"></div>
				<h2>Đang xử lý đăng nhập...</h2>
				<p>Vui lòng đợi trong giây lát</p>
			</div>

			<div v-else-if="error" class="error">
				<div class="error-icon">❌</div>
				<h2>Đăng nhập thất bại</h2>
				<p>{{ error }}</p>
				<button @click="goToLogin" class="btn-primary">Thử lại</button>
			</div>

			<div v-else class="success">
				<div class="success-icon">✅</div>
				<h2>Đăng nhập thành công</h2>
				<p>Đang chuyển hướng...</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthService from '../services/authService.js'
import UserService from '../services/userService.js'

const router = useRouter()
const route = useRoute()
const isProcessing = ref(true)
const error = ref('')

onMounted(async () => {
	await handleOAuthCallback()
})

const handleOAuthCallback = async () => {
	try {
		// Get JWT token from query params
		const token = route.query.token

		if (!token) {
			throw new Error('Không tìm thấy token xác thực')
		}

		// Validate token with backend
		const isValidToken = await UserService.validateToken(token)

		if (!isValidToken) {
			throw new Error('Token không hợp lệ')
		}

		// Extract user info from token (basic decode to get username)
		const userInfo = extractUserFromToken(token)

		// Save user session
		AuthService.saveUserSession(userInfo, token)

		// Get return URL or default to home
		const returnUrl = localStorage.getItem('oauth_return_url') || '/'
		localStorage.removeItem('oauth_return_url')

		// Small delay to show success message
		setTimeout(() => {
			router.push(returnUrl)
		}, 1500)

	} catch (err) {
		console.error('OAuth callback error:', err)
		error.value = err.message || 'Có lỗi xảy ra trong quá trình đăng nhập'
	} finally {
		isProcessing.value = false
	}
}

/**
 * Extract user info from JWT token (basic decode)
 */
const extractUserFromToken = (token) => {
	try {
		// Decode JWT payload (basic decode, not for validation)
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)

		const payload = JSON.parse(jsonPayload)

		return {
			username: payload.sub || 'user', // JWT subject is usually username
			email: payload.sub || '', // Can be email
			name: payload.sub || 'User',
		}
	} catch (error) {
		console.error('Failed to decode token:', error)
		return {
			username: 'user',
			email: '',
			name: 'User'
		}
	}
}

const goToLogin = () => {
	router.push('/signIn')
}
</script>

<style scoped>
.oauth-callback {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.callback-container {
	background: white;
	border-radius: 12px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	padding: 40px;
	text-align: center;
	max-width: 400px;
	width: 90%;
}

.processing,
.error,
.success {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
}

.loading-spinner {
	width: 48px;
	height: 48px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid #667eea;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.error-icon,
.success-icon {
	font-size: 48px;
}

h2 {
	color: #333;
	margin: 0;
	font-size: 24px;
}

p {
	color: #666;
	margin: 0;
	font-size: 16px;
}

.btn-primary {
	background: #667eea;
	color: white;
	border: none;
	padding: 12px 24px;
	border-radius: 8px;
	cursor: pointer;
	font-size: 16px;
	font-weight: 500;
	transition: background 0.3s ease;
}

.btn-primary:hover {
	background: #5a67d8;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>
