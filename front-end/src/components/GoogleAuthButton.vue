<template>
	<div id="google-signup-btn" style="width: 100%; display: flex; justify-content: center"></div>
</template>

<script>
export default {
	name: 'GoogleAuthButton',
	data() {
		return {
			isLoading: true,
			hasError: false,
			isConfigured: false,
		}
	},
	mounted() {
		this.checkConfiguration()
	},
	methods: {
		checkConfiguration() {
			const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
			if (!clientId || clientId === 'your-google-client-id-here') {
				this.isConfigured = false
				this.isLoading = false
				return
			}
			this.isConfigured = true
			this.loadGoogleScript()
		},

		loadGoogleScript() {
			if (!window.google || !window.google.accounts) {
				const script = document.createElement('script')
				script.src = 'https://accounts.google.com/gsi/client'
				script.async = true
				script.defer = true
				script.onload = this.renderGoogleButton
				script.onerror = this.handleScriptError
				document.head.appendChild(script)
			} else {
				this.renderGoogleButton()
			}
		},

		handleScriptError() {
			this.isLoading = false
			this.hasError = true
			console.error('Failed to load Google Identity Services script')
		},

		renderGoogleButton() {
			try {
				if (
					window.google &&
					window.google.accounts &&
					document.getElementById('google-signup-btn')
				) {
					window.google.accounts.id.initialize({
						client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
						callback: this.onGoogleSignIn,
					})
					window.google.accounts.id.renderButton(
						document.getElementById('google-signup-btn'),
						{
							theme: 'outline',
							size: 'large',
							text: 'signin_with',
							width: 340,
							locale: 'vi',
						},
					)
					this.isLoading = false
					this.hasError = false
				}
			} catch (error) {
				console.error('Error rendering Google button:', error)
				this.handleScriptError()
			}
		},

		retryLoad() {
			this.isLoading = true
			this.hasError = false
			this.loadGoogleScript()
		},

		onGoogleSignIn(response) {
			try {
				const credential = response.credential
				this.$emit('success', credential)
			} catch (error) {
				console.error('Google sign-in error:', error)
				alert('Đăng nhập Google thất bại. Vui lòng thử lại.')
			}
		},
	},
}
</script>
<style scoped>
.google-auth-container {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-bottom: 20px;
}

.google-button-container {
	width: 100%;
	display: flex;
	justify-content: center;
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
