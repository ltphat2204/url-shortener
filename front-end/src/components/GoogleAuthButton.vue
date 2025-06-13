<template>
	<div>
		<div v-if="!isConfigured" class="google-auth-warning">
			<p>Google authentication is not configured.</p>
			<small>Please set VITE_GOOGLE_CLIENT_ID in your environment variables.</small>
		</div>
		<div v-else-if="hasError" class="google-auth-error">
			<p>Failed to load Google authentication.</p>
			<button @click="retryLoad" class="retry-button">Try Again</button>
		</div>
		<div v-else>
			<div id="google-signup-btn" style="width: 100%; display: flex; justify-content: center"></div>
			<div v-if="isLoading" class="google-auth-loading">Loading Google Sign-In...</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import GoogleAuthService from '../services/googleAuthService.js'

// Props
const props = defineProps({
	buttonText: {
		type: String,
		default: 'signin_with'
	},
	theme: {
		type: String,
		default: 'outline'
	},
	size: {
		type: String,
		default: 'large'
	},
	width: {
		type: Number,
		default: 340
	}
})

// Emits
const emit = defineEmits(['success', 'error'])

// State
const isLoading = ref(true)
const hasError = ref(false)
const isConfigured = ref(false)

onMounted(async () => {
	await setupGoogleAuth()
})

onUnmounted(() => {
	GoogleAuthService.cleanup()
})

const setupGoogleAuth = async () => {
	try {
		isLoading.value = true
		hasError.value = false

		// Check configuration
		if (!GoogleAuthService.isConfigured()) {
			isConfigured.value = false
			isLoading.value = false
			return
		}

		isConfigured.value = true

		// Setup Google Auth
		const success = await GoogleAuthService.setupGoogleAuth(
			'google-signup-btn',
			onGoogleAuth,
			{
				theme: props.theme,
				size: props.size,
				text: props.buttonText,
				width: props.width,
				locale: 'vi',
			}
		)

		if (success) {
			isLoading.value = false
			hasError.value = false
		} else {
			throw new Error('Failed to setup Google authentication')
		}
	} catch (error) {
		console.error('Google Auth setup error:', error)
		isLoading.value = false
		hasError.value = true
		emit('error', error)
	}
}

const onGoogleAuth = (credential) => {
	try {
		emit('success', credential.credential)
	} catch (error) {
		console.error('Google Auth callback error:', error)
		emit('error', error)
	}
}

const retryLoad = async () => {
	await setupGoogleAuth()
}
</script>

<style scoped>
.google-auth-warning,
.google-auth-error {
	text-align: center;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 20px;
}

.google-auth-warning {
	background-color: #fff3cd;
	border: 1px solid #ffeaa7;
	color: #856404;
}

.google-auth-error {
	background-color: #f8d7da;
	border: 1px solid #f5c6cb;
	color: #721c24;
}

.google-auth-loading {
	text-align: center;
	color: #666;
	font-size: 14px;
	margin-top: 8px;
}

.retry-button {
	background: #667eea;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
	margin-top: 8px;
}

.retry-button:hover {
	background: #5a67d8;
}

.google-config-error,
.google-loading,
.google-error {
	text-align: center;
	padding: 16px;
	border-radius: 8px;
	width: 100%;
}

.google-config-error {
	background: #fff3cd;
	border: 1px solid #ffeaa7;
	color: #856404;
}

.google-loading {
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	color: #6c757d;
}

.google-error {
	background: #f8d7da;
	border: 1px solid #f5c6cb;
	color: #721c24;
}

.loading-spinner {
	display: inline-block;
	width: 20px;
	height: 20px;
	border: 2px solid transparent;
	border-top: 2px solid #667eea;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 8px;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.btn-retry {
	background: #667eea;
	color: white;
	border: none;
	padding: 8px 16px;
	border-radius: 4px;
	cursor: pointer;
	margin-top: 8px;
	font-size: 14px;
}

.btn-retry:hover {
	background: #5a67d8;
}
</style>
