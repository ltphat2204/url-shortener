import { ref } from 'vue'
import UserService from '../services/userService.js'

export function useFormValidation() {
	const errors = ref({})
	const isValidating = ref({})

	// Validation rules
	const validateFullName = (fullName) => {
		if (!fullName?.trim()) {
			return 'Họ và tên là bắt buộc'
		}
		if (fullName.trim().length < 2) {
			return 'Họ và tên phải có ít nhất 2 ký tự'
		}
		return null
	}

	const validateUsername = (username) => {
		if (!username?.trim()) {
			return 'Tên đăng nhập là bắt buộc'
		}
		if (username.trim().length < 3) {
			return 'Tên đăng nhập phải có ít nhất 3 ký tự'
		}
		if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
			return 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới'
		}
		return null
	}

	const validateEmail = (email) => {
		if (!email) {
			return 'Email là bắt buộc'
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return 'Email không hợp lệ'
		}
		return null
	}

	const validatePassword = (password) => {
		if (!password) {
			return 'Mật khẩu là bắt buộc'
		}
		if (password.length < 8) {
			return 'Mật khẩu phải có ít nhất 8 ký tự'
		}
		if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
			return 'Mật khẩu phải chứa chữ hoa, chữ thường và số'
		}
		return null
	}

	const validateConfirmPassword = (password, confirmPassword) => {
		if (!confirmPassword) {
			return 'Xác nhận mật khẩu là bắt buộc'
		}
		if (password !== confirmPassword) {
			return 'Mật khẩu xác nhận không khớp'
		}
		return null
	}

	// Async validation for email and username availability
	const validateAvailability = async (email, username) => {
		const data = {}
		if (email && !validateEmail(email)) {
			data.email = email
		}
		if (username && !validateUsername(username)) {
			data.username = username
		}

		if (Object.keys(data).length === 0) {
			return { emailExists: false, usernameExists: false }
		}

		try {
			const result = await UserService.checkAvailability(data)
			return result
		} catch (error) {
			console.error('Availability validation error:', error)
			return { emailExists: false, usernameExists: false }
		}
	}

	// Form validation
	const validateSignUpForm = (form) => {
		const newErrors = {}

		const fullNameError = validateFullName(form.fullName)
		if (fullNameError) newErrors.fullName = fullNameError

		const usernameError = validateUsername(form.username)
		if (usernameError) newErrors.username = usernameError

		const emailError = validateEmail(form.email)
		if (emailError) newErrors.email = emailError

		const passwordError = validatePassword(form.password)
		if (passwordError) newErrors.password = passwordError

		const confirmPasswordError = validateConfirmPassword(form.password, form.confirmPassword)
		if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError

		errors.value = newErrors
		return Object.keys(newErrors).length === 0
	}

	const validateSignInForm = (form) => {
		const newErrors = {}

		const usernameError = validateUsername(form.username)
		if (usernameError) newErrors.username = usernameError

		if (!form.password) {
			newErrors.password = 'Mật khẩu là bắt buộc'
		}

		errors.value = newErrors
		return Object.keys(newErrors).length === 0
	}

	// Clear errors
	const clearErrors = () => {
		errors.value = {}
	}

	const clearFieldError = (field) => {
		if (errors.value[field]) {
			delete errors.value[field]
		}
	}

	return {
		// State
		errors,
		isValidating,

		// Validation methods
		validateFullName,
		validateUsername,
		validateEmail,
		validatePassword,
		validateConfirmPassword,
		validateSignUpForm,
		validateSignInForm,

		// Async validation methods
		validateAvailability,

		// Utility methods
		clearErrors,
		clearFieldError,
	}
}
