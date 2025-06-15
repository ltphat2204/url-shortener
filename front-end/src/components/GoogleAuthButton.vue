<template>
	<div>
		<button @click="signInWithGoogle" class="google-signin-btn" :disabled="isLoading">
			<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
				<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
				<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
				<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
				<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
			</svg>
			<span v-if="isLoading">Đang xử lý...</span>
			<span v-else>{{ buttonText || 'Đăng nhập với Google' }}</span>
		</button>
	</div>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
	buttonText: {
		type: String,
		default: 'Đăng nhập với Google'
	}
})

// State
const isLoading = ref(false)

// Get backend URL from environment or default to API Gateway
const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'

/**
 * Redirect to Google OAuth2 authorization endpoint
 */
const signInWithGoogle = () => {
	isLoading.value = true

	// Save current page to return after auth
	localStorage.setItem('oauth_return_url', window.location.pathname)

	// Set flag to indicate OAuth is pending
	sessionStorage.setItem('oauth_pending', 'true')

	// Redirect to backend OAuth2 endpoint through API Gateway
	window.location.href = `${GATEWAY_URL}/users/oauth2/authorization/google`
}
</script>

<style scoped>
.google-signin-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	width: 100%;
	padding: 12px 16px;
	background: white;
	border: 2px solid #dadce0;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 500;
	color: #3c4043;
	cursor: pointer;
	transition: all 0.3s ease;
	text-decoration: none;
}

.google-signin-btn:hover:not(:disabled) {
	border-color: #d2d2d2;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.google-signin-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.google-icon {
	flex-shrink: 0;
}
</style>
