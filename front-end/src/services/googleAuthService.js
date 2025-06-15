export class GoogleAuthService {
	/**
	 * Check if Google Client ID is configured
	 * @returns {boolean} Configuration status
	 */
	static isConfigured() {
		const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
		return !!(clientId && clientId !== 'your-google-client-id-here')
	}

	/**
	 * Get Google Client ID from environment
	 * @returns {string} Google Client ID
	 */
	static getClientId() {
		return import.meta.env.VITE_GOOGLE_CLIENT_ID
	}

	/**
	 * Check if Google Identity Services is loaded
	 * @returns {boolean} Load status
	 */
	static isGoogleScriptLoaded() {
		return !!(window.google && window.google.accounts)
	}

	/**
	 * Load Google Identity Services script
	 * @returns {Promise<void>} Promise that resolves when script is loaded
	 */
	static loadGoogleScript() {
		return new Promise((resolve, reject) => {
			if (this.isGoogleScriptLoaded()) {
				resolve()
				return
			}

			const script = document.createElement('script')
			script.src = 'https://accounts.google.com/gsi/client'
			script.async = true
			script.defer = true
			script.onload = () => resolve()
			script.onerror = () => reject(new Error('Failed to load Google Identity Services script'))
			document.head.appendChild(script)
		})
	}

	/**
	 * Initialize Google Identity Services
	 * @param {Function} callback - Callback function for authentication
	 * @returns {Promise<void>} Promise that resolves when initialized
	 */
	static async initializeGoogle(callback) {
		try {
			await this.loadGoogleScript()

			if (!this.isGoogleScriptLoaded()) {
				throw new Error('Google Identity Services not available')
			}

			window.google.accounts.id.initialize({
				client_id: this.getClientId(),
				callback: callback,
			})
		} catch (error) {
			console.error('Error initializing Google Identity Services:', error)
			throw error
		}
	}

	/**
	 * Render Google Sign-In button
	 * @param {string} elementId - ID of the element to render button in
	 * @param {Object} options - Button rendering options
	 * @returns {boolean} Success status
	 */
	static renderButton(elementId, options = {}) {
		try {
			const element = document.getElementById(elementId)
			if (!element) {
				console.error(`Element with ID '${elementId}' not found`)
				return false
			}

			if (!this.isGoogleScriptLoaded()) {
				console.error('Google Identity Services not loaded')
				return false
			}

			const defaultOptions = {
				theme: 'outline',
				size: 'large',
				text: 'signin_with',
				width: 340,
				locale: 'vi',
			}

			const renderOptions = { ...defaultOptions, ...options }

			window.google.accounts.id.renderButton(element, renderOptions)
			return true
		} catch (error) {
			console.error('Error rendering Google button:', error)
			return false
		}
	}

	/**
	 * Setup Google Authentication for a component
	 * @param {string} elementId - ID of the element to render button in
	 * @param {Function} callback - Authentication callback
	 * @param {Object} buttonOptions - Button rendering options
	 * @returns {Promise<boolean>} Success status
	 */
	static async setupGoogleAuth(elementId, callback, buttonOptions = {}) {
		try {
			if (!this.isConfigured()) {
				return false
			}

			await this.initializeGoogle(callback)
			return this.renderButton(elementId, buttonOptions)
		} catch (error) {
			console.error('Error setting up Google authentication:', error)
			return false
		}
	}

	/**
	 * Clean up Google authentication
	 */
	static cleanup() {
		// Google Identity Services doesn't require explicit cleanup
		// but we can provide this method for consistency
	}
}

export default GoogleAuthService
