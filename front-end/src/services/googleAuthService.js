export class GoogleAuthService {
	/**
	 * Sign in with Google OAuth2
	 * @param {string} returnUrl - URL to return to after authentication
	 * @returns {void}
	 */
	static signInWithOAuth2(returnUrl = null) {
		try {
			// Get backend URL from environment or default to API Gateway
			const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL

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
	 * Clear OAuth pending flag
	 */
	static clearOAuthPending() {
		sessionStorage.removeItem('oauth_pending')
	}
}

export default GoogleAuthService
