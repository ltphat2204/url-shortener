import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/authService.js'
import UserService from '../services/userService.js'
import { useMultiStepForm } from './useMultiStepForm.js'
import { useFormValidation } from './useFormValidation.js'

/**
 * Decode JWT token to get payload
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null
 */
const decodeJWT = (token) => {
	try {
		const parts = token.split('.')
		if (parts.length !== 3) return null

		const payload = parts[1]
		const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
		return JSON.parse(decoded)
	} catch (error) {
		console.error('Failed to decode JWT:', error)
		return null
	}
}

export function useAuthentication() {
	const router = useRouter()
	const loading = ref(false)

	// Form data
	const signUpForm = ref({
		fullName: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	const signInForm = ref({
		username: '',
		password: '',
	})

	// Use composables
	const { currentStep, nextStep, resetStep } = useMultiStepForm()
	const { validateSignUpForm, validateSignInForm, errors, clearErrors } = useFormValidation()

	// OTP methods will be passed from component
	let otpMethods = null

	const setOTPMethods = (methods) => {
		otpMethods = methods
		// Set callback to clear OTP errors when user types
		if (methods.setOTPChangeCallback) {
			methods.setOTPChangeCallback(() => {
				if (errors.value.otp) {
					delete errors.value.otp
				}
			})
		}
	}

	// Password visibility
	const showPassword = ref(false)
	const showConfirmPassword = ref(false)

	/**
	 * Handle user sign up
	 */
	const handleSignUp = async () => {
		clearErrors()
		loading.value = true

		try {
			// Validate form
			if (!validateSignUpForm(signUpForm.value)) {
				return
			}

			// Send OTP directly (backend will validate duplicates during registration)
			const otp = await AuthService.sendOTP(signUpForm.value.email, signUpForm.value.fullName)
			otpMethods?.setGeneratedOTP(otp)

			// Move to OTP verification step
			nextStep()
			otpMethods?.startOTPCountdown()
		} catch (error) {
			console.error('Sign up error:', error)
			errors.value.general = error.message || 'Có lỗi xảy ra, vui lòng thử lại'
		} finally {
			loading.value = false
		}
	}

	/**
	 * Handle OTP verification and user registration
	 */
	const handleOTPVerification = async () => {
		clearErrors()
		loading.value = true

		try {
			if (otpMethods?.verifyOTP()) {
				await UserService.register({
					username: signUpForm.value.username,
					email: signUpForm.value.email,
					password: signUpForm.value.password,
				})
				nextStep()
				otpMethods?.stopOTPCountdown()
			} else {
				errors.value.otp = 'Mã OTP không hợp lệ'
			}
		} catch (error) {
			console.error('Registration error:', error)
			errors.value.otp = error.message || 'Có lỗi xảy ra trong quá trình đăng ký'
		} finally {
			loading.value = false
		}
	}

	/**
	 * Handle user sign in
	 */
	const handleSignIn = async () => {
		clearErrors()
		loading.value = true

		try {
			// Validate form
			if (!validateSignInForm(signInForm.value)) {
				return
			}

			// Call backend API to login
			const result = await UserService.login({
				username: signInForm.value.username,
				password: signInForm.value.password,
			})

			if (result && result.token) {
				// Decode JWT token to get actual username from backend
				const decodedToken = decodeJWT(result.token)
				const actualUsername = decodedToken?.sub || signInForm.value.username

				const userData = {
					username: actualUsername,
					email: signInForm.value.username, // Could be email if user logged in with email
				}

				// Save session
				AuthService.saveUserSession(userData, result.token)

				// Redirect to home
				router.push('/')
			} else {
				errors.value.general = 'Đăng nhập thất bại'
			}
		} catch (error) {
			console.error('Sign in error:', error)
			errors.value.general = error.message || 'Tên đăng nhập hoặc mật khẩu không đúng'
		} finally {
			loading.value = false
		}
	}

	/**
	 * Handle resend OTP
	 */
	const handleResendOTP = async () => {
		try {
			const otp = await AuthService.sendOTP(signUpForm.value.email, signUpForm.value.fullName)
			otpMethods?.setGeneratedOTP(otp)
			otpMethods?.resetOTP()
			otpMethods?.startOTPCountdown()
		} catch (error) {
			console.error('Resend OTP error:', error)
			errors.value.general = 'Không thể gửi lại mã OTP'
		}
	}

	/**
	 * Go back to form
	 */
	const goBackToForm = () => {
		resetStep()
		otpMethods?.stopOTPCountdown()
	}

	/**
	 * Reset all form data
	 */
	const resetAllForms = () => {
		signUpForm.value = {
			fullName: '',
			email: '',
			password: '',
			confirmPassword: '',
		}
		signInForm.value = {
			email: '',
			password: '',
		}
		clearErrors()
		resetStep()
		otpMethods?.resetOTP()
		otpMethods?.stopOTPCountdown()
	}

	return {
		// State
		loading,
		signUpForm,
		signInForm,
		currentStep,
		errors,
		showPassword,
		showConfirmPassword,

		// Methods
		handleSignUp,
		handleOTPVerification,
		handleSignIn,
		handleResendOTP,
		goBackToForm,
		resetAllForms,
		setOTPMethods,
	}
}
