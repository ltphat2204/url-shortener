import emailjs from 'emailjs-com'

export class AuthService {
	/**
	 * Send OTP email
	 * @param {string} email - Recipient email
	 * @param {string} fullName - Recipient name
	 * @returns {Promise<string>} Generated OTP
	 */
	static async sendOTP(email, fullName) {
		const otp = Math.floor(100000 + Math.random() * 900000).toString()

		try {
			await emailjs.send(
				import.meta.env.VITE_EMAILJS_SERVICE_ID,
				import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
				{
					email: email,
					otp: otp,
					to_name: fullName || email,
				},
				import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
			)

			return otp
		} catch (error) {
			console.error('Failed to send OTP:', error)
			throw new Error('Không thể gửi mã OTP. Vui lòng thử lại.')
		}
	}

	/**
	 * Generate random OTP
	 * @param {number} length - OTP length (default: 6)
	 * @returns {string} Generated OTP
	 */
	static generateOTP(length = 6) {
		let otp = ''
		for (let i = 0; i < length; i++) {
			otp += Math.floor(Math.random() * 10).toString()
		}
		return otp
	}

	/**
	 * Verify OTP
	 * @param {string} inputOTP - User input OTP
	 * @param {string} generatedOTP - Generated OTP
	 * @returns {boolean} Verification result
	 */
	static verifyOTP(inputOTP, generatedOTP) {
		return inputOTP === generatedOTP
	}

	/**
	 * Parse Google credential JWT
	 * @param {string} credential - Google JWT credential
	 * @returns {Object} Parsed user data
	 */
	static parseGoogleCredential(credential) {
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

			const payload = JSON.parse(jsonPayload)

			// Extract user name with fallback logic
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

			return {
				id: payload.sub,
				username: payload.email?.split('@')[0] || '',
				email: payload.email,
				name: userName,
				picture: payload.picture,
				google_id: payload.sub,
				locale: payload.locale || 'vi',
				verified_email: payload.email_verified || false,
			}
		} catch (error) {
			console.error('Failed to parse Google credential:', error)
			throw new Error('Lỗi xử lý thông tin đăng nhập Google')
		}
	}

	/**
	 * Save user session
	 * @param {Object} userObject - User data
	 * @param {string} token - Authentication token
	 */
	static saveUserSession(userObject, token) {
		localStorage.setItem('user', JSON.stringify(userObject))
		localStorage.setItem('token', token)
	}

	/**
	 * Clear user session
	 */
	static clearUserSession() {
		localStorage.removeItem('user')
		localStorage.removeItem('token')
	}

	/**
	 * Get current user from session
	 * @returns {Object|null} Current user or null
	 */
	static getCurrentUser() {
		try {
			const userStr = localStorage.getItem('user')
			return userStr ? JSON.parse(userStr) : null
		} catch (error) {
			console.error('Failed to get current user:', error)
			return null
		}
	}

	/**
	 * Check if user is authenticated
	 * @returns {boolean} Authentication status
	 */
	static isAuthenticated() {
		const user = this.getCurrentUser()
		const token = localStorage.getItem('token')
		return !!(user && token)
	}

	/**
	 * Validate EmailJS configuration
	 * @returns {boolean} Configuration validity
	 */
	static isEmailJSConfigured() {
		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
		const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
		const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

		return !!(serviceId && templateId && publicKey &&
			serviceId !== 'your-service-id' &&
			templateId !== 'your-template-id' &&
			publicKey !== 'your-public-key')
	}
}

export default AuthService
