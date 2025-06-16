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
	 * Sign in with Google OAuth2 (redirect-based)
	 * @param {string} returnUrl - URL to return to after authentication
	 * @returns {void}
	 */
	static signInWithOAuth2(returnUrl = null) {
		try {
			// Get backend URL from environment or default to API Gateway
			const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'

			// Save current page to return after auth (if provided)
			if (returnUrl) {
				localStorage.setItem('oauth_return_url', returnUrl)
			} else {
				localStorage.setItem('oauth_return_url', window.location.pathname)
			}

			// Set flag to indicate OAuth is pending
			sessionStorage.setItem('oauth_pending', 'true')

			// Redirect to backend OAuth2 endpoint through API Gateway
			window.location.href = `${GATEWAY_URL}/users/oauth2/authorization/google`
		} catch (error) {
			console.error('Error initiating Google OAuth2 sign-in:', error)
			throw error
		}
	}

	/**
	 * Get OAuth return URL and clear it from storage
	 * @returns {string} Return URL
	 */
	static getAndClearReturnUrl() {
		const returnUrl = localStorage.getItem('oauth_return_url') || '/'
		localStorage.removeItem('oauth_return_url')
		return returnUrl
	}

	/**
	 * Check if OAuth is pending
	 * @returns {boolean} OAuth pending status
	 */
	static isOAuthPending() {
		return sessionStorage.getItem('oauth_pending') === 'true'
	}

	/**
	 * Clear OAuth pending flag
	 */
	static clearOAuthPending() {
		sessionStorage.removeItem('oauth_pending')
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
