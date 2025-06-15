import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/authService.js'
import UserService from '../services/userService.js'
import { useMultiStepForm } from './useMultiStepForm.js'
import { useFormValidation } from './useFormValidation.js'

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

			// Check if username or email already exists (using mock for now since backend doesn't have check endpoint)
			if (UserService.usernameExists(signUpForm.value.username)) {
				errors.value.username = 'Tên đăng nhập đã tồn tại'
				return
			}
			if (UserService.emailExists(signUpForm.value.email)) {
				errors.value.email = 'Email đã tồn tại'
				return
			}

			// Send OTP
			const otp = await AuthService.sendOTP(
				signUpForm.value.email,
				signUpForm.value.fullName
			)
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
				// Call backend API to register user
				await UserService.register({
					username: signUpForm.value.username,
					email: signUpForm.value.email,
					password: signUpForm.value.password
				})

				// Move to success step
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
				password: signInForm.value.password
			})

			if (result && result.token) {
				// Extract username from token or use form username
				const userData = {
					username: signInForm.value.username,
					// Add other user info if available from backend
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
			const otp = await AuthService.sendOTP(
				signUpForm.value.email,
				signUpForm.value.fullName
			)
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
