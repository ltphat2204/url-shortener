import { mockUsers, addMockUser } from '../mock/mockUsers.js'

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'

export class UserService {
	/**
	 * Đăng nhập user
	 * @param {Object} loginData - Dữ liệu đăng nhập
	 * @param {string} loginData.username - Username (email)
	 * @param {string} loginData.password - Mật khẩu
	 * @returns {Promise<Object>} - Token và thông tin user
	 */
	static async login(loginData) {
		const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginData),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
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
		const response = await fetch(`${API_BASE_URL}/users/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(registerData),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Xác thực Google OAuth
	 * @param {string} googleToken - Token từ Google
	 * @returns {Promise<Object>} - Token và thông tin user
	 */
	static async googleAuth(googleToken) {
		const response = await fetch(`${API_BASE_URL}/users/auth/google`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token: googleToken }),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Lấy thông tin user hiện tại
	 * @param {string} token - JWT token
	 * @returns {Promise<Object>} - Thông tin user
	 */
	static async getCurrentUser(token) {
		const response = await fetch(`${API_BASE_URL}/users/me`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Làm mới token
	 * @param {string} refreshToken - Refresh token
	 * @returns {Promise<Object>} - Token mới
	 */
	static async refreshToken(refreshToken) {
		const response = await fetch(`${API_BASE_URL}/users/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refreshToken }),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Validate JWT token
	 * @param {string} token - JWT token
	 * @returns {Promise<boolean>} - Token validation result
	 */
	static async validateToken(token) {
		try {
			const response = await fetch(`${API_BASE_URL}/users/auth/token/validate`, {
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
	 * Mock user management methods
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
	 * Create new mock user
	 * @param {Object} userData - User data
	 * @returns {Object} Created user
	 */
	static createMockUser(userData) {
		const newUser = {
			username: userData.username || userData.email?.split('@')[0] || '',
			email: userData.email,
			password: userData.password || '',
			name: userData.name || userData.fullName,
			picture: userData.picture,
			google_id: userData.google_id,
		}

		addMockUser(newUser)
		return newUser
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
	 * @param {string} email - User email
	 * @param {string} password - User password
	 * @returns {Object|null} User if valid, null if invalid
	 */
	static verifyMockCredentials(email, password) {
		const user = this.findMockUserByEmail(email)
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
			username: googleData.username,
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
