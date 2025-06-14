import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/authService.js'
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

			// Check if email or username already exists
			const users = JSON.parse(localStorage.getItem('users') || '[]')
			if (users.find(u => u.email === signUpForm.value.email)) {
				errors.value.email = 'Email đã tồn tại'
				return
			}
			if (users.find(u => u.username === signUpForm.value.username)) {
				errors.value.username = 'Tên đăng nhập đã tồn tại'
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
	 * Handle OTP verification
	 */
	const handleOTPVerification = async () => {
		clearErrors()
		loading.value = true

		try {
			if (otpMethods?.verifyOTP()) {
				// Create user locally (no API call)
				const newUser = {
					username: signUpForm.value.username || signUpForm.value.email.split('@')[0],
					email: signUpForm.value.email,
					name: signUpForm.value.fullName,
					password: signUpForm.value.password, // In real app, this would be hashed
				}

				// Save to localStorage for now
				const users = JSON.parse(localStorage.getItem('users') || '[]')
				users.push(newUser)
				localStorage.setItem('users', JSON.stringify(users))

				// Move to success step
				nextStep()
				otpMethods?.stopOTPCountdown()
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

			// Check local users
			const users = JSON.parse(localStorage.getItem('users') || '[]')
			const user = users.find(u =>
				u.username === signInForm.value.username &&
				u.password === signInForm.value.password
			)

			if (user) {
				// Save session
				AuthService.saveUserSession(user, 'local-token')

				// Redirect to home
				router.push('/')
			} else {
				errors.value.general = 'Tên đăng nhập hoặc mật khẩu không đúng'
			}

		} catch (error) {
			console.error('Sign in error:', error)
			errors.value.general = error.message || 'Có lỗi xảy ra, vui lòng thử lại'
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
				// Check if email already exists locally
				const users = JSON.parse(localStorage.getItem('users') || '[]')
				if (users.find(u => u.email === googleData.email)) {
					errors.value.general = 'Email này đã được đăng ký. Vui lòng sử dụng tính năng đăng nhập.'
					return
				}

				// Add to local users
				const newUser = {
					username: googleData.username || googleData.email.split('@')[0],
					email: googleData.email,
					name: googleData.name,
					password: '', // OAuth users don't need password
					google_id: googleData.google_id,
				}
				users.push(newUser)
				localStorage.setItem('users', JSON.stringify(users))
			}

			// Save session and redirect (Google auth provides its own token)
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
		handleGoogleAuth,
		handleResendOTP,
		goBackToForm,
		resetAllForms,
		setOTPMethods,
	}
}
