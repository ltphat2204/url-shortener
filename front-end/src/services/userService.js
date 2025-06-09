const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'

export class UserService {
	/**
	 * Đăng nhập user
	 * @param {Object} loginData - Dữ liệu đăng nhập
	 * @param {string} loginData.email - Email
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
	 * @param {string} registerData.email - Email
	 * @param {string} registerData.password - Mật khẩu
	 * @param {string} registerData.name - Tên user
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
}

export default UserService
