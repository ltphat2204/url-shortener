import { ref, watch } from 'vue'
import { useFormValidation } from './useFormValidation.js'

export function useRealTimeValidation() {
	const { validateAvailability, validateEmail, validateUsername } = useFormValidation()

	// State for real-time validation
	const emailValidation = ref({
		error: '',
		isValidating: false,
		isAvailable: null,
	})

	const usernameValidation = ref({
		error: '',
		isValidating: false,
		isAvailable: null,
	})
	// Combined validation function - only check when BOTH fields have values
	const validateBothOnBlur = async (email, username) => {
		// Only proceed if both fields have values
		if (!email || !email.trim() || !username || !username.trim()) {
			return
		}

		// Reset states
		emailValidation.value.isValidating = true
		usernameValidation.value.isValidating = true

		// Basic validation first
		let hasBasicErrors = false

		const emailError = validateEmail(email.trim())
		if (emailError) {
			emailValidation.value.error = emailError
			emailValidation.value.isAvailable = null
			hasBasicErrors = true
		} else {
			emailValidation.value.error = ''
		}

		const usernameError = validateUsername(username.trim())
		if (usernameError) {
			usernameValidation.value.error = usernameError
			usernameValidation.value.isAvailable = null
			hasBasicErrors = true
		} else {
			usernameValidation.value.error = ''
		}

		// If basic validation fails, stop here
		if (hasBasicErrors) {
			emailValidation.value.isValidating = false
			usernameValidation.value.isValidating = false
			return
		}

		// Check availability via API (both fields required)
		try {
			const result = await validateAvailability(email.trim(), username.trim())

			if (result.emailExists) {
				emailValidation.value.error = 'Email này đã được sử dụng'
				emailValidation.value.isAvailable = false
			} else {
				emailValidation.value.isAvailable = true
			}

			if (result.usernameExists) {
				usernameValidation.value.error = 'Tên đăng nhập này đã được sử dụng'
				usernameValidation.value.isAvailable = false
			} else {
				usernameValidation.value.isAvailable = true
			}
		} catch (error) {
			console.error('Availability validation error:', error)
			emailValidation.value.error = 'Không thể kiểm tra email'
			usernameValidation.value.error = 'Không thể kiểm tra tên đăng nhập'
		} finally {
			emailValidation.value.isValidating = false
			usernameValidation.value.isValidating = false
		}
	}
	// Individual validation functions - do basic validation on blur
	const validateEmailOnBlur = async (email) => {
		if (!email || !email.trim()) {
			emailValidation.value.error = ''
			emailValidation.value.isAvailable = null
			return
		}

		const basicError = validateEmail(email.trim())
		if (basicError) {
			emailValidation.value.error = basicError
			emailValidation.value.isAvailable = null
		} else {
			emailValidation.value.error = ''
			// Note: No API call here since we need both email and username
		}
	}

	const validateUsernameOnBlur = async (username) => {
		if (!username || !username.trim()) {
			usernameValidation.value.error = ''
			usernameValidation.value.isAvailable = null
			return
		}

		const basicError = validateUsername(username.trim())
		if (basicError) {
			usernameValidation.value.error = basicError
			usernameValidation.value.isAvailable = null
		} else {
			usernameValidation.value.error = ''
		}
	}

	// Watch functions - only clear errors when typing, don't validate immediately
	const watchEmailValidation = (emailRef) => {
		watch(emailRef, (newEmail) => {
			if (emailValidation.value.isAvailable !== null) {
				emailValidation.value.isAvailable = null
			}
			if (!newEmail || !newEmail.trim()) {
				emailValidation.value.error = ''
			}
		})
	}

	const watchUsernameValidation = (usernameRef) => {
		watch(usernameRef, (newUsername) => {
			// Clear availability status when user types
			if (usernameValidation.value.isAvailable !== null) {
				usernameValidation.value.isAvailable = null
			}

			// Only clear error if field becomes empty, don't validate while typing
			if (!newUsername || !newUsername.trim()) {
				usernameValidation.value.error = ''
			}
			// Don't validate while user is typing - wait for blur event
		})
	}

	// Clear validations
	const clearEmailValidation = () => {
		emailValidation.value = {
			error: '',
			isValidating: false,
			isAvailable: null,
		}
	}

	const clearUsernameValidation = () => {
		usernameValidation.value = {
			error: '',
			isValidating: false,
			isAvailable: null,
		}
	}

	return {
		// State
		emailValidation,
		usernameValidation,

		// Methods
		validateBothOnBlur,
		validateEmailOnBlur,
		validateUsernameOnBlur,
		watchEmailValidation,
		watchUsernameValidation,
		clearEmailValidation,
		clearUsernameValidation,
	}
}
