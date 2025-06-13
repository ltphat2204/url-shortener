import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/authService.js'
import UserService from '../services/userService.js'
import { useMultiStepForm } from './useMultiStepForm.js'
import { useOTPVerification } from './useOTPVerification.js'
import { useFormValidation } from './useFormValidation.js'

export function useAuthentication() {
	const router = useRouter()
	const loading = ref(false)

	// Form data
	const signUpForm = ref({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	const signInForm = ref({
		email: '',
		password: '',
	})

	// Use composables
	const { currentStep, nextStep, resetStep } = useMultiStepForm()
	const {
		setGeneratedOTP,
		verifyOTP,
		resetOTP,
		startOTPCountdown,
		stopOTPCountdown
	} = useOTPVerification()
	const { validateSignUpForm, validateSignInForm, errors, clearErrors } = useFormValidation()

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

			// Check if email exists
			if (UserService.emailExists(signUpForm.value.email)) {
				errors.value.email = 'Email đã tồn tại'
				return
			}

			// Send OTP
			const otp = await AuthService.sendOTP(
				signUpForm.value.email,
				signUpForm.value.fullName
			)
			setGeneratedOTP(otp)

			// Move to OTP verification step
			nextStep()
			startOTPCountdown()

		} catch (error) {
			console.error('Sign up error:', error)
			errors.value.general = error.message || 'Có lỗi xảy ra, vui lòng thử lại'
		} finally {
			loading.value = false
		}
	}

	/**
	 * Handle OTP verification
	 */
	const handleOTPVerification = async () => {
		clearErrors()
		loading.value = true

		try {
			if (verifyOTP()) {
				// Create user
				UserService.createMockUser({
					username: signUpForm.value.email.split('@')[0],
					email: signUpForm.value.email,
					password: signUpForm.value.password,
					name: signUpForm.value.fullName,
				})

				// Move to success step
				nextStep()
				stopOTPCountdown()
			} else {
				errors.value.otp = 'Mã OTP không hợp lệ'
			}
		} catch (error) {
			console.error('OTP verification error:', error)
			errors.value.otp = 'Có lỗi xảy ra, vui lòng thử lại'
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

			// Verify credentials
			const user = UserService.verifyMockCredentials(
				signInForm.value.email,
				signInForm.value.password
			)

			if (user) {
				// Save session
				AuthService.saveUserSession(user, 'mock-token')

				// Redirect to home
				router.push('/')
			} else {
				errors.value.general = 'Email hoặc mật khẩu không đúng'
			}

		} catch (error) {
			console.error('Sign in error:', error)
			errors.value.general = 'Có lỗi xảy ra, vui lòng thử lại'
		} finally {
			loading.value = false
		}
	}

	/**
	 * Handle Google authentication
	 */
	const handleGoogleAuth = async (credential, isSignUp = false) => {
		try {
			const googleData = AuthService.parseGoogleCredential(credential)

			if (isSignUp) {
				// Check if email already exists
				if (UserService.emailExists(googleData.email)) {
					errors.value.general = 'Email này đã được đăng ký. Vui lòng sử dụng tính năng đăng nhập.'
					return
				}

				// Create new user
				UserService.createUserFromGoogle(googleData)
			} else {
				// For sign in, check if user exists, if not create one
				if (!UserService.findMockUserByEmail(googleData.email)) {
					UserService.createUserFromGoogle(googleData)
				}
			}

			// Save session and redirect
			AuthService.saveUserSession(googleData, credential)
			router.push('/')

		} catch (error) {
			console.error('Google auth error:', error)
			errors.value.general = error.message || 'Lỗi xác thực Google'
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
			setGeneratedOTP(otp)
			resetOTP()
			startOTPCountdown()
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
		stopOTPCountdown()
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
		resetOTP()
		stopOTPCountdown()
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
		handleGoogleAuth,
		handleResendOTP,
		goBackToForm,
		resetAllForms,
	}
}
