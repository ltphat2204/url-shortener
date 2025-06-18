const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'

// Cấu hình chung cho fetch requests để xử lý CORS
const DEFAULT_FETCH_OPTIONS = {
	mode: 'cors',
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
}

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
			...DEFAULT_FETCH_OPTIONS,
			method: 'POST',
			body: JSON.stringify({
				username: loginData.username,
				password: loginData.password,
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
			...DEFAULT_FETCH_OPTIONS,
			method: 'POST',
			body: JSON.stringify({
				username: registerData.username,
				email: registerData.email,
				password: registerData.password,
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
				...DEFAULT_FETCH_OPTIONS,
				method: 'GET',
				headers: {
					...DEFAULT_FETCH_OPTIONS.headers,
					Authorization: `Bearer ${token}`,
				},
			})

			return response.ok
		} catch {
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
				...DEFAULT_FETCH_OPTIONS,
				method: 'GET',
			})

			if (!response.ok) {
				throw new Error(`Check availability failed: ${response.status}`)
			}

			return await response.json()
		} catch {
			return { emailExists: false, usernameExists: false }
		}
	}
}

export default UserService
