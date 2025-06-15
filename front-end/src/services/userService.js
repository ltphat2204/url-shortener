import { mockUsers, addMockUser } from '../mock/mockUsers.js'

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'

export class UserService {
	/**
	 * Đăng nhập user
	 * @param {Object} loginData - Dữ liệu đăng nhập
	 * @param {string} loginData.username - Username
	 * @param {string} loginData.password - Mật khẩu
	 * @returns {Promise<Object>} - Token và thông tin user
	 */
	static async login(loginData) {
		const response = await fetch(`${API_BASE_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: loginData.username,
				password: loginData.password
			}),
		})

		if (!response.ok) {
			const errorText = await response.text().catch(() => '')
			throw new Error(errorText || `Đăng nhập thất bại: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Đăng ký user mới
	 * @param {Object} registerData - Dữ liệu đăng ký
	 * @param {string} registerData.username - Username
	 * @param {string} registerData.email - Email
	 * @param {string} registerData.password - Mật khẩu
	 * @returns {Promise<Object>} - Thông tin user đã tạo
	 */
	static async register(registerData) {
		const response = await fetch(`${API_BASE_URL}/users/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: registerData.username,
				email: registerData.email,
				password: registerData.password
			}),
		})

		if (!response.ok) {
			const errorText = await response.text().catch(() => '')
			throw new Error(errorText || `Đăng ký thất bại: ${response.status}`)
		}

		const result = await response.text()
		return { message: result }
	}

	/**
	 * Validate JWT token
	 * @param {string} token - JWT token
	 * @returns {Promise<boolean>} - Token validation result
	 */
	static async validateToken(token) {
		try {
			const response = await fetch(`${API_BASE_URL}/users/token/validate`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			return response.ok
		} catch (error) {
			console.error('Token validation error:', error)
			return false
		}
	}

	/**
	 * Mock user management methods (for development/testing)
	 */

	/**
	 * Check if email already exists in mock users
	 * @param {string} email - Email to check
	 * @returns {boolean} Whether email exists
	 */
	static emailExists(email) {
		return mockUsers.some((user) => user.email === email)
	}

	/**
	 * Check if username already exists in mock users
	 * @param {string} username - Username to check
	 * @returns {boolean} Whether username exists
	 */
	static usernameExists(username) {
		return mockUsers.some((user) => user.username === username)
	}

	/**
	 * Create new mock user
	 * @param {Object} userData - User data
	 * @returns {Object} Created user
	 */
	static createMockUser(userData) {
		const newUser = {
			username: userData.username,
			email: userData.email,
			password: userData.password || '',
			name: userData.name || userData.fullName || userData.username,
			picture: userData.picture,
			google_id: userData.google_id,
		}

		addMockUser(newUser)
		return newUser
	}

	/**
	 * Find mock user by username
	 * @param {string} username - Username to search
	 * @returns {Object|null} Found user or null
	 */
	static findMockUserByUsername(username) {
		return mockUsers.find((user) => user.username === username) || null
	}

	/**
	 * Find mock user by email
	 * @param {string} email - Email to search
	 * @returns {Object|null} Found user or null
	 */
	static findMockUserByEmail(email) {
		return mockUsers.find((user) => user.email === email) || null
	}

	/**
	 * Verify mock user credentials
	 * @param {string} username - Username
	 * @param {string} password - User password
	 * @returns {Object|null} User if valid, null if invalid
	 */
	static verifyMockCredentials(username, password) {
		const user = this.findMockUserByUsername(username)
		if (user && user.password === password) {
			// Don't return password in response
			// eslint-disable-next-line no-unused-vars
			const { password: _, ...userWithoutPassword } = user
			return userWithoutPassword
		}
		return null
	}

	/**
	 * Create user from Google auth data
	 * @param {Object} googleData - Google authentication data
	 * @returns {Object} Created user
	 */
	static createUserFromGoogle(googleData) {
		return this.createMockUser({
			username: googleData.username || googleData.email?.split('@')[0],
			email: googleData.email,
			name: googleData.name,
			picture: googleData.picture,
			google_id: googleData.google_id,
			password: '', // No password for Google users
		})
	}

	/**
	 * Check if mock user is Google user
	 * @param {string} email - User email
	 * @returns {boolean} Whether user is Google user
	 */
	static isMockGoogleUser(email) {
		const user = this.findMockUserByEmail(email)
		return !!(user && user.google_id)
	}
}

export default UserService
