const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'
const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE || 'http://localhost/r/'

export class UrlService {
	/**
	 * Lấy danh sách URLs của user
	 * @param {number} userId - ID của user
	 * @returns {Promise<Object>} - API Response với data và meta
	 */
	static async getUrlsByUserId(userId) {
		const userIdNum = parseInt(userId) || 1

		const response = await fetch(`${API_BASE_URL}/url/user/${userIdNum}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Tạo URL mới
	 * @param {Object} urlData - Dữ liệu URL cần tạo
	 * @param {string} urlData.destination_url - URL đích (bắt buộc)
	 * @param {string} urlData.description - Mô tả (optional)
	 * @param {number} urlData.user_id - ID của user (bắt buộc)
	 * @returns {Promise<Object>} - Object chứa id, shortCode, shortUrl, originalUrl, description, userId và success status
	 */
	static async createUrl(urlData) {
		// Chỉ gửi destination_url và user_id, bỏ short_code tùy chỉnh
		const requestData = {
			destination_url: urlData.destination_url,
			user_id: urlData.user_id,
		}

		// Thêm description nếu có
		if (urlData.description) {
			requestData.description = urlData.description
		}

		const response = await fetch(`${API_BASE_URL}/url`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestData),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
		}

		// Backend trả về JSON object với thông tin URL record mới
		const responseData = await response.json()
		const newShortRecord = responseData.new_short_record

		// Trả về object với thông tin đầy đủ để dễ sử dụng
		return {
			id: newShortRecord.id,
			shortCode: newShortRecord.short_url,
			shortUrl: `${SHORT_URL_BASE}${newShortRecord.short_url}`,
			originalUrl: newShortRecord.destination_url,
			description: newShortRecord.description,
			userId: newShortRecord.user_id,
			success: true,
		}
	}

	/**
	 * Cập nhật URL theo short code
	 * @param {string} shortCode - Short code của URL cần cập nhật
	 * @param {Object} urlData - Dữ liệu URL cần cập nhật
	 * @returns {Promise<Object>} - Thông tin URL đã cập nhật
	 */
	static async updateUrl(shortCode, urlData) {
		const response = await fetch(`${API_BASE_URL}/url/${shortCode}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(urlData),
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Xóa URL theo short code
	 * @param {string} shortCode - Short code của URL cần xóa
	 * @returns {Promise<void>}
	 */ static async deleteUrl(shortCode) {
		const response = await fetch(`${API_BASE_URL}/url/${shortCode}`, {
			method: 'DELETE',
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
	}

	/**
	 * Lấy thông tin URL theo short code
	 * @param {string} shortCode - Short code của URL
	 * @returns {Promise<Object>} - Thông tin URL
	 */ static async getUrlByShortCode(shortCode) {
		const response = await fetch(`${API_BASE_URL}/url/${shortCode}`)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		return await response.json()
	}

	/**
	 * Map dữ liệu từ backend format sang frontend format
	 * @param {Object} backendUrl - URL object từ backend
	 * @returns {Object} - URL object theo format frontend
	 */ static mapBackendUrlToFrontend(backendUrl) {
		return {
			id: backendUrl.id,
			shortUrl: `${SHORT_URL_BASE}${backendUrl.short_code}`,
			originalUrl: backendUrl.destination_url,
			description: backendUrl.description || '',
			createdAt: backendUrl.create_at, // Sửa từ created_at thành create_at
			shortCode: backendUrl.short_code,
			userId: backendUrl.user_id,
		}
	}

	/**
	 * Map dữ liệu từ frontend form sang backend format
	 * @param {Object} formData - Dữ liệu từ form
	 * @param {number} userId - ID của user
	 * @returns {Object} - URL object theo format backend
	 */
	static mapFrontendFormToBackend(formData, userId) {
		const result = {
			destination_url: formData.originalUrl,
			user_id: userId,
		}

		// Chỉ thêm description nếu có giá trị
		if (formData.description) {
			result.description = formData.description
		}

		return result
	}

	/**
	 * Quản lý Local Storage cho offline mode
	 */
	static LOCAL_STORAGE_KEY = 'userUrls'

	/**
	 * Lấy mock data mặc định
	 * @returns {Array} - Danh sách URL mock
	 */
	static getDefaultMockData() {
		return [
			{
				id: 1,
				shortUrl: 'https://go.vn/abc123',
				originalUrl: 'https://www.google.com/',
				description: 'Trang chủ Google',
				createdAt: '2024-06-01T10:00:00Z',
				shortCode: 'abc123',
				userId: 1,
			},
			{
				id: 2,
				shortUrl: 'https://go.vn/xyz789',
				originalUrl: 'https://www.facebook.com/',
				description: 'Trang Facebook',
				createdAt: '2024-06-02T12:30:00Z',
				shortCode: 'xyz789',
				userId: 1,
			},
			{
				id: 3,
				shortUrl: 'https://go.vn/hello',
				originalUrl: 'https://chat.openai.com/',
				description: 'ChatGPT',
				createdAt: '2024-06-03T08:15:00Z',
				shortCode: 'hello',
				userId: 1,
			},
		]
	}

	/**
	 * Load URLs từ localStorage
	 * @returns {Array} - Danh sách URLs từ storage
	 */
	static loadFromLocalStorage() {
		try {
			const savedUrls = localStorage.getItem(this.LOCAL_STORAGE_KEY)
			if (savedUrls) {
				return JSON.parse(savedUrls)
			}
		} catch (error) {
			console.error('Error loading from localStorage:', error)
		}
		return this.getDefaultMockData()
	}

	/**
	 * Save URLs vào localStorage
	 * @param {Array} urls - Danh sách URLs cần save
	 */
	static saveToLocalStorage(urls) {
		try {
			localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(urls))
		} catch (error) {
			console.error('Error saving to localStorage:', error)
		}
	}

	/**
	 * Generate random short code
	 * @param {number} length - Độ dài của short code (default: 6)
	 * @returns {string} - Short code được generate
	 */
	static generateShortCode(length = 6) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let result = ''
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length))
		}
		return result
	}

	/**
	 * Tạo URL offline khi API fail
	 * @param {Object} formData - Dữ liệu form
	 * @param {number} userId - User ID
	 * @returns {Object} - URL object mới
	 */
	static createOfflineUrl(formData, userId) {
		const shortCode = this.generateShortCode()
		return {
			id: Date.now(),
			shortUrl: `${SHORT_URL_BASE}${shortCode}`,
			originalUrl: formData.originalUrl,
			description: formData.description || '',
			createdAt: new Date().toISOString(),
			shortCode: shortCode,
			userId: userId,
		}
	}

	/**
	 * Batch delete URLs (API + fallback)
	 * @param {Array} urlsToDelete - Danh sách URLs cần xóa
	 * @returns {Promise<Object>} - Kết quả batch delete
	 */
	static async batchDeleteUrls(urlsToDelete) {
		const results = {
			successful: [],
			failed: [],
			errors: []
		}

		const deletePromises = urlsToDelete.map(async (url) => {
			try {
				if (url.shortCode) {
					await this.deleteUrl(url.shortCode)
				}
				results.successful.push(url)
				return { success: true, url }
			} catch (error) {
				console.error(`Failed to delete ${url.shortCode}:`, error)
				results.failed.push(url)
				results.errors.push(error)
				return { success: false, url, error }
			}
		})

		await Promise.all(deletePromises)
		return results
	}

	/**
	 * Tích hợp API call với fallback handling
	 * @param {number} userId - User ID
	 * @param {Object} options - Options cho API call
	 * @returns {Promise<Object>} - API response hoặc offline data
	 */
	static async getUrlsWithFallback(userId) {
		try {
			// Thử gọi API trước
			const apiResponse = await this.getUrlsByUserId(userId)

			if (apiResponse.data) {
				// Map data từ backend format
				const mappedUrls = apiResponse.data.map(url => this.mapBackendUrlToFrontend(url))

				// Save vào localStorage để backup
				this.saveToLocalStorage(mappedUrls)

				return {
					data: mappedUrls,
					meta: apiResponse.meta,
					source: 'api'
				}
			}
		} catch (error) {
			console.error('API Error, falling back to localStorage:', error)
		}

		// Fallback to localStorage
		const offlineUrls = this.loadFromLocalStorage()
		return {
			data: offlineUrls,
			meta: {
				totalItems: offlineUrls.length,
				itemsPerPage: 10,
				currentPage: 1,
				totalPages: Math.ceil(offlineUrls.length / 10)
			},
			source: 'offline'
		}
	}

	/**
	 * Create URL với fallback handling
	 * @param {Object} formData - Form data
	 * @param {number} userId - User ID
	 * @returns {Promise<Object>} - Created URL object
	 */
	static async createUrlWithFallback(formData, userId) {
		try {
			// Thử tạo qua API trước
			const urlData = this.mapFrontendFormToBackend(formData, userId)
			const result = await this.createUrl(urlData)
			return {
				...result,
				source: 'api'
			}
		} catch (apiError) {
			console.error('API Error, creating offline URL:', apiError)

			// Fallback: tạo URL offline
			const offlineUrl = this.createOfflineUrl(formData, userId)

			// Update localStorage
			const existingUrls = this.loadFromLocalStorage()
			existingUrls.unshift(offlineUrl)
			this.saveToLocalStorage(existingUrls)

			return {
				...offlineUrl,
				source: 'offline',
				success: true
			}
		}
	}

	/**
	 * Xóa URL với fallback handling
	 * @param {Object} url - URL object cần xóa
	 * @returns {Promise<Object>} - Kết quả xóa
	 */
	static async deleteUrlWithFallback(url) {
		const result = {
			success: false,
			source: 'unknown',
			url: url
		}

		try {
			// Thử xóa qua API
			if (url.shortCode) {
				await this.deleteUrl(url.shortCode)
				result.success = true
				result.source = 'api'
			}
		} catch (error) {
			console.error('API delete failed, removing from localStorage:', error)
			result.error = error
		}

		// Luôn luôn xóa khỏi localStorage
		try {
			const existingUrls = this.loadFromLocalStorage()
			const updatedUrls = existingUrls.filter(u => u.id !== url.id)
			this.saveToLocalStorage(updatedUrls)

			if (!result.success) {
				result.success = true
				result.source = 'offline'
			}
		} catch (storageError) {
			console.error('localStorage delete failed:', storageError)
			if (!result.success) {
				result.error = storageError
			}
		}

		return result
	}
}

export default UrlService
