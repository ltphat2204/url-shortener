<template>
	<main class="signup-main">
		<div class="auth-container">
			<div class="auth-card">
				<div class="auth-header">
					<h2>Đăng ký</h2>
					<p>Tạo tài khoản mới để bắt đầu!</p>
				</div>

				<!-- Step 1: Registration Form -->
				<div v-if="currentStep === 1">
					<form @submit.prevent="handleSignUp" class="auth-form">
						<div class="form-group">
							<label for="fullName">Họ và tên</label>
							<input
								type="text"
								id="fullName"
								v-model="form.fullName"
								:class="{ error: errors.fullName }"
								placeholder="Nhập họ và tên"
								required
							/>
							<span v-if="errors.fullName" class="error-message">{{
								errors.fullName
							}}</span>
						</div>

						<div class="form-group">
							<label for="email">Email</label>
							<input
								type="email"
								id="email"
								v-model="form.email"
								:class="{ error: errors.email }"
								placeholder="Nhập email của bạn"
								required
							/>
							<span v-if="errors.email" class="error-message">{{
								errors.email
							}}</span>
						</div>

						<div class="form-group">
							<label for="password">Mật khẩu</label>
							<div class="password-input">
								<input
									:type="showPassword ? 'text' : 'password'"
									id="password"
									v-model="form.password"
									:class="{ error: errors.password }"
									placeholder="Nhập mật khẩu"
									required
								/>
								<button
									type="button"
									@click="showPassword = !showPassword"
									class="password-toggle"
								>
									<svg
										v-if="showPassword"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
									<svg
										v-else
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
										<path
											d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"
										/>
										<path
											d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61"
										/>
										<line x1="2" y1="2" x2="22" y2="22" />
									</svg>
								</button>
							</div>
							<span v-if="errors.password" class="error-message">{{
								errors.password
							}}</span>
						</div>

						<div class="form-group">
							<label for="confirmPassword">Xác nhận mật khẩu</label>
							<div class="password-input">
								<input
									:type="showConfirmPassword ? 'text' : 'password'"
									id="confirmPassword"
									v-model="form.confirmPassword"
									:class="{ error: errors.confirmPassword }"
									placeholder="Nhập lại mật khẩu"
									required
								/>
								<button
									type="button"
									@click="showConfirmPassword = !showConfirmPassword"
									class="password-toggle"
								>
									<svg
										v-if="showConfirmPassword"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
									<svg
										v-else
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
										<path
											d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"
										/>
										<path
											d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61"
										/>
										<line x1="2" y1="2" x2="22" y2="22" />
									</svg>
								</button>
							</div>
							<span v-if="errors.confirmPassword" class="error-message">{{
								errors.confirmPassword
							}}</span>
						</div>

						<div class="form-actions">
							<button type="submit" :disabled="loading" class="btn-primary">
								<span v-if="loading" class="loading-spinner"></span>
								{{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
							</button>
						</div>
					</form>

					<div class="divider">
						<span>hoặc</span>
					</div>

					<GoogleAuthButton @success="onGoogleSignUp" />
				</div>

				<!-- Step 2: OTP Verification -->
				<div v-else-if="currentStep === 2" class="otp-verification">
					<div class="otp-header">
						<div class="otp-icon">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
								/>
								<polyline points="22,6 12,13 2,6" />
							</svg>
						</div>
						<h3>Xác thực email</h3>
						<p>
							Chúng tôi đã gửi mã OTP đến email <strong>{{ form.email }}</strong>
						</p>
					</div>

					<form @submit.prevent="verifyOTP" class="otp-form">
						<div class="otp-inputs">
							<input
								v-for="(digit, index) in otpDigits"
								:key="index"
								:ref="(el) => (otpRefs[index] = el)"
								type="text"
								inputmode="numeric"
								pattern="[0-9]*"
								maxlength="1"
								v-model="otpDigits[index]"
								@input="handleOTPInput($event, index)"
								@keydown="handleOTPKeydown($event, index)"
								class="otp-input"
								autocomplete="one-time-code"
							/>
						</div>
						<span v-if="errors.otp" class="error-message">{{ errors.otp }}</span>
						<div class="otp-actions">
							<button
								type="submit"
								:disabled="loading || !isOTPComplete"
								class="btn-primary"
								style="display: none"
							>
								Xác thực
							</button>
						</div>
					</form>

					<div class="otp-footer">
						<p v-if="!canResendOTP">Gửi lại mã sau {{ resendCountdown }}s</p>
						<button
							v-else
							@click="resendOTP"
							:disabled="resendLoading"
							class="btn-link"
						>
							{{ resendLoading ? 'Đang gửi...' : 'Gửi lại mã OTP' }}
						</button>
						<button @click="goBackToForm" class="btn-link">Quay lại</button>
					</div>
				</div>

				<!-- Step 3: Success -->
				<div v-else-if="currentStep === 3" class="success-message">
					<div class="success-icon">
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<polyline points="22,4 12,14.01 9,11.01" />
						</svg>
					</div>
					<h3>Đăng ký thành công!</h3>
					<p>
						Tài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu sử dụng dịch vụ
						ngay bây giờ.
					</p>
					<router-link
						to="/signIn"
						class="btn-primary"
						style="display: inline-block; text-align: center"
						>Đăng nhập ngay</router-link
					>
				</div>

				<div v-if="currentStep === 1" class="auth-footer">
					<p>
						Đã có tài khoản?
						<router-link to="/signIn" class="btn-link">Đăng nhập ngay</router-link>
					</p>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import { mockUsers, addMockUser } from '../mock/mockUsers.js'
import emailjs from 'emailjs-com'
import GoogleAuthButton from './GoogleAuthButton.vue'

export default {
	name: 'SignUp',
	components: {
		GoogleAuthButton,
	},
	data() {
		return {
			currentStep: 1, // 1: Form, 2: OTP, 3: Success
			form: {
				fullName: '',
				email: '',
				password: '',
				confirmPassword: '',
			},
			errors: {},
			loading: false,
			showPassword: false,
			showConfirmPassword: false,

			// OTP related
			otpDigits: ['', '', '', '', '', ''],
			otpRefs: [],
			resendCountdown: 60,
			canResendOTP: false,
			resendLoading: false,
			otpTimer: null,

			// Thêm biến để lưu mã OTP đã sinh
			generatedOTP: '',
		}
	},
	computed: {
		isOTPComplete() {
			return this.otpDigits.every((digit) => digit !== '')
		},
		otpCode() {
			return this.otpDigits.join('')
		},
	},
	methods: {
		async handleSignUp() {
			this.errors = {}
			this.loading = true
			try {
				if (!this.validateForm()) {
					this.loading = false
					return
				}
				const existed = mockUsers.find((u) => u.email === this.form.email)
				if (existed) {
					this.errors.email = 'Email đã tồn tại'
					this.loading = false
					return
				}
				const otp = Math.floor(100000 + Math.random() * 900000).toString()
				this.generatedOTP = otp
				await emailjs.send(
					import.meta.env.VITE_EMAILJS_SERVICE_ID,
					import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
					{
						email: this.form.email,
						otp: otp,
						to_name: this.form.fullName || this.form.email,
					},
					import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
				)
				this.currentStep = 2
				this.startOTPCountdown()
			} catch {
				this.errors.general = 'Có lỗi xảy ra, vui lòng thử lại'
			} finally {
				this.loading = false
			}
		},

		async verifyOTP() {
			this.errors = {}
			this.loading = true
			try {
				if (this.otpCode === this.generatedOTP) {
					addMockUser({
						username: this.form.email.split('@')[0],
						email: this.form.email,
						password: this.form.password,
						name: this.form.fullName,
					})
					this.currentStep = 3
					this.stopOTPCountdown()
				} else {
					this.errors.otp = 'Mã OTP không hợp lệ'
				}
			} catch {
				this.errors.otp = 'Có lỗi xảy ra, vui lòng thử lại'
			} finally {
				this.loading = false
			}
		},

		async resendOTP() {
			this.resendLoading = true

			try {
				const response = await this.$api.auth.resendOTP({
					email: this.form.email,
				})

				if (response.success) {
					this.$toast.success('Mã OTP mới đã được gửi!')
					this.otpDigits = ['', '', '', '', '', '']
					this.startOTPCountdown()
				} else {
					this.$toast.error('Không thể gửi lại mã OTP')
				}
			} catch {
				this.$toast.error('Có lỗi xảy ra khi gửi lại mã OTP')
			} finally {
				this.resendLoading = false
			}
		},

		validateForm() {
			let isValid = true

			if (!this.form.fullName.trim()) {
				this.errors.fullName = 'Họ và tên là bắt buộc'
				isValid = false
			} else if (this.form.fullName.trim().length < 2) {
				this.errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự'
				isValid = false
			}

			if (!this.form.email) {
				this.errors.email = 'Email là bắt buộc'
				isValid = false
			} else if (!this.isValidEmail(this.form.email)) {
				this.errors.email = 'Email không hợp lệ'
				isValid = false
			}

			if (!this.form.password) {
				this.errors.password = 'Mật khẩu là bắt buộc'
				isValid = false
			} else if (this.form.password.length < 8) {
				this.errors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
				isValid = false
			} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.form.password)) {
				this.errors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số'
				isValid = false
			}

			if (!this.form.confirmPassword) {
				this.errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
				isValid = false
			} else if (this.form.password !== this.form.confirmPassword) {
				this.errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
				isValid = false
			}

			return isValid
		},

		isValidEmail(email) {
			const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			return re.test(email)
		},

		handleOTPInput(event, index) {
			const value = event.target.value.replace(/[^0-9]/g, '')
			this.otpDigits[index] = value
			if (value && index < 5) {
				this.$nextTick(() => {
					this.otpRefs[index + 1]?.focus()
				})
			}
			if (this.otpDigits.every((d) => d.length === 1)) {
				this.verifyOTP()
			}
		},
		handleOTPKeydown(event, index) {
			if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
				this.$nextTick(() => {
					this.otpRefs[index - 1]?.focus()
				})
			}
		},

		startOTPCountdown() {
			this.resendCountdown = 60
			this.canResendOTP = false

			this.otpTimer = setInterval(() => {
				this.resendCountdown--
				if (this.resendCountdown <= 0) {
					this.canResendOTP = true
					this.stopOTPCountdown()
				}
			}, 1000)
		},

		stopOTPCountdown() {
			if (this.otpTimer) {
				clearInterval(this.otpTimer)
				this.otpTimer = null
			}
		},

		goBackToForm() {
			this.currentStep = 1
			this.stopOTPCountdown()
		},

		goToSignIn() {
			this.$router.push('/signIn')
		},

		onGoogleSignUp(credential) {
			let payload = {}
			try {
				const base64Url = credential.split('.')[1]
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
				const jsonPayload = decodeURIComponent(
					atob(base64)
						.split('')
						.map(function (c) {
							return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
						})
						.join(''),
				)

				payload = JSON.parse(jsonPayload)
			} catch {
				this.errors.general = 'Lỗi xử lý thông tin đăng ký Google'
				return
			}

			let userName = ''
			if (payload.name) {
				userName = payload.name
			} else if (payload.given_name && payload.family_name) {
				userName = `${payload.family_name} ${payload.given_name}`.trim()
			} else if (payload.given_name) {
				userName = payload.given_name
			} else {
				userName = payload.email?.split('@')[0] || 'User'
			}

			const existed = mockUsers.find((u) => u.email === payload.email)
			if (existed) {
				alert('Email này đã được đăng ký. Vui lòng sử dụng tính năng đăng nhập.')
				this.$router.push('/signIn')
				return
			}

			const userObject = {
				id: payload.sub,
				username: payload.email?.split('@')[0] || '',
				email: payload.email,
				name: userName,
				picture: payload.picture,
				google_id: payload.sub,
				locale: payload.locale || 'vi',
				verified_email: payload.email_verified || false,
			}

			addMockUser({
				username: userObject.username,
				email: userObject.email,
				password: '',
				name: userObject.name,
				picture: userObject.picture,
				google_id: userObject.google_id,
			})

			localStorage.setItem('user', JSON.stringify(userObject))
			localStorage.setItem('token', credential)

			this.$router.push('/')
		},
	},

	beforeUnmount() {
		this.stopOTPCountdown()
	},
}
</script>

<style scoped>
.signup-main {
	width: 100vw;
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	box-sizing: border-box;
	padding: 20px;
	overflow-y: auto;
}

.auth-container {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: transparent;
	padding: 20px;
	box-sizing: border-box;
	min-height: calc(100vh - 40px);
}

.auth-card {
	background: white;
	border-radius: 12px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	padding: 40px;
	width: 100%;
	max-width: 400px;
	margin: auto;
}

.auth-header {
	text-align: center;
	margin-bottom: 30px;
}

.auth-header h2 {
	color: #333;
	margin-bottom: 8px;
	font-size: 28px;
	font-weight: 600;
}

.auth-header p {
	color: #666;
	font-size: 16px;
}

.auth-form {
	margin-bottom: 30px;
}

.form-group {
	margin-bottom: 20px;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	color: #333;
	font-weight: 500;
}

.form-group input {
	width: 100%;
	padding: 12px 16px;
	border: 2px solid #e1e5e9;
	border-radius: 8px;
	font-size: 16px;
	transition: border-color 0.3s ease;
	box-sizing: border-box;
	color: black;
}

.form-group input:focus {
	outline: none;
	border-color: #667eea;
}

.form-group input.error {
	border-color: #e74c3c;
}

.password-input {
	position: relative;
}

.password-toggle {
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	color: #666;
	transition: color 0.3s ease;
}

.password-toggle:hover {
	color: #667eea;
}

.password-toggle svg {
	display: block;
}

.divider {
	margin: 20px 0;
	text-align: center;
	position: relative;
}

.divider::before {
	content: '';
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	height: 1px;
	background: #e1e5e9;
}

.divider span {
	background: white;
	padding: 0 16px;
	color: #666;
	font-size: 14px;
}

.error-message {
	color: #e74c3c;
	font-size: 14px;
	margin-top: 4px;
	display: block;
}

.form-actions {
	margin-top: 30px;
}

.btn-primary {
	width: 100%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	padding: 14px 24px;
	border-radius: 8px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
	transform: translateY(-2px);
}

.btn-primary:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.loading-spinner {
	display: inline-block;
	width: 16px;
	height: 16px;
	border: 2px solid transparent;
	border-top: 2px solid currentColor;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-right: 8px;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.otp-verification {
	text-align: center;
}

.otp-header {
	margin-bottom: 30px;
}

.otp-icon {
	margin-bottom: 20px;
	color: #667eea;
}

.otp-icon svg {
	display: block;
	margin: 0 auto;
}

.otp-header h3 {
	color: #333;
	margin-bottom: 12px;
	font-size: 24px;
	font-weight: 600;
}

.otp-header p {
	color: #666;
	line-height: 1.5;
}

.otp-form {
	margin-bottom: 30px;
}

.otp-inputs {
	display: flex;
	justify-content: center;
	gap: 12px;
	margin-bottom: 20px;
}

.otp-input {
	width: 50px;
	height: 50px;
	border: 2px solid #e1e5e9;
	border-radius: 8px;
	text-align: center;
	font-size: 20px;
	font-weight: 600;
	transition: border-color 0.3s ease;
	color: black;
}

.otp-input:focus {
	outline: none;
	border-color: #667eea;
}

.otp-actions {
	margin-top: 20px;
}

.otp-footer {
	text-align: center;
}

.otp-footer p {
	color: #666;
	margin-bottom: 16px;
	font-size: 14px;
}

.btn-link {
	background: none;
	border: none;
	color: #667eea;
	text-decoration: none;
	cursor: pointer;
	font-size: 14px;
	margin: 0 8px;
	font-weight: 500;
	padding: 0;
}
.btn-link:hover {
	text-decoration: underline;
}

/* Success Message Styles */
.success-message {
	text-align: center;
}

.success-icon {
	font-size: 64px;
	margin-bottom: 20px;
}

.success-message h3 {
	color: #333;
	margin-bottom: 16px;
	font-size: 24px;
	font-weight: 600;
}

.success-message p {
	color: #666;
	line-height: 1.6;
	margin-bottom: 30px;
}

.auth-footer {
	text-align: center;
}

.auth-footer p {
	color: #666;
	margin-bottom: 12px;
}

.auth-footer a {
	color: #667eea;
	text-decoration: none;
	font-weight: 500;
}

.auth-footer a:hover {
	text-decoration: underline;
}

@media (max-width: 480px) {
	.auth-card {
		padding: 30px 20px;
	}

	.auth-header h2 {
		font-size: 24px;
	}

	.otp-inputs {
		gap: 8px;
	}

	.otp-input {
		width: 40px;
		height: 40px;
		font-size: 18px;
	}
}
</style>
