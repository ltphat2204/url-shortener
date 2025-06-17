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
				method: 'GET',
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
	 * Check if email and username already exist
	 * @param {Object} data - Data to check
	 * @param {string} data.email - Email to check (optional)
	 * @param {string} data.username - Username to check (optional)
	 * @returns {Promise<Object>} - { emailExists: boolean, usernameExists: boolean }
	 */
	static async checkAvailability(data) {
		try {
			const params = new URLSearchParams()
			if (data.email) {
				params.append('email', data.email)
			}
			if (data.username) {
				params.append('username', data.username)
			}

			const response = await fetch(`${API_BASE_URL}/users/exist?${params.toString()}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Check availability failed: ${response.status}`)
			}

			return await response.json()
		} catch (error) {
			console.error('Check availability error:', error)
			return { emailExists: false, usernameExists: false }
		}
	}
}

export default UserService
