import emailjs from '@emailjs/browser'

export class AuthService {
	/**
	 * Initialize EmailJS with User ID
	 */
	static initEmailJS() {
		if (!this._emailjsInitialized) {
			const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
		if (!publicKey) {
			throw new Error('EmailJS configuration is missing')
		}

		emailjs.init(publicKey)
		this._emailjsInitialized = true
		}
	}

	/**
	 * Send OTP email
	 * @param {string} email - Recipient email
	 * @param {string} fullName - Recipient name
	 * @returns {Promise<string>} Generated OTP
	 */
	static async sendOTP(email, fullName) {
		// Validate environment variables first
		const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
		const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
		this.initEmailJS()

		const otp = Math.floor(100000 + Math.random() * 900000).toString()

		try {
			await emailjs.send(serviceId, templateId, {
				email: email,
				otp: otp,
				to_name: fullName || email,
			})

			return otp
		} catch {
			throw new Error('Không thể gửi mã OTP. Vui lòng thử lại.')
		}
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
	 * Save user session
	 * @param {Object} userObject - User data
	 * @param {string} token - Authentication token
	 */
	static saveUserSession(userObject, token) {
		// Ensure user object has an ID using consistent logic
		if (!userObject.id) {
			const identifier = userObject.email || userObject.username
			if (identifier) {
				// Use same hash logic as getCurrentUserId for consistency
				userObject.id =
					(Math.abs(
						identifier.split('').reduce((hash, char) => {
							return char.charCodeAt(0) + ((hash << 5) - hash)
						}, 0),
					) %
						100000) +
					1000
			}
		}

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
		} catch {
			return null
		}
	}
}

// Static property to track EmailJS initialization
AuthService._emailjsInitialized = false

export default AuthService
