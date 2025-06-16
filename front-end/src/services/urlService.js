const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_BASE_URL || 'http://localhost'
const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE || 'http://localhost/r/'

export class UrlService {
	/**
	 * Lấy danh sách URLs của user với pagination, sorting và search
	 * @param {number} userId - ID của user
	 * @param {number} page - Trang hiện tại (default: 1)
	 * @param {number} limit - Số items per page (default: 10)
	 * @param {string} sortBy - Trường để sort
	 * @param {string} sortOrder - Thứ tự sort
	 * @param {string} search - Từ khóa tìm kiếm (optional)
	 * @returns {Promise<Object>} - API Response với data và meta
	 */
	static async getUrlsByUserId(userId, page = 1, limit = 10, sortBy = 'create_at', sortOrder = 'desc', search = '') {
		const userIdNum = parseInt(userId) || 1

		let url = `${API_BASE_URL}/url/user/${userIdNum}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`

		// Thêm search parameter nếu có
		if (search && search.trim()) {
			url += `&search=${encodeURIComponent(search.trim())}`
		}

		const response = await fetch(url)

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
	 * Get URLs by user ID với pagination, sorting và search
	 * @param {number} userId - User ID
	 * @param {number} page - Trang hiện tại
	 * @param {number} limit - Số items per page
	 * @param {string} sortBy - Backend field name để sort
	 * @param {string} sortOrder - Thứ tự sort
	 * @param {string} search - Từ khóa tìm kiếm
	 * @returns {Promise<Object>} - API response
	 */
	static async getUrlsWithFallback(userId, page = 1, limit = 10, sortBy = 'create_at', sortOrder = 'desc', search = '') {
		const apiResponse = await this.getUrlsByUserId(userId, page, limit, sortBy, sortOrder, search)

		if (apiResponse.data) {
			// Map data từ backend format
			const mappedUrls = apiResponse.data.map(url => this.mapBackendUrlToFrontend(url))

			return {
				data: mappedUrls,
				meta: apiResponse.meta,
				source: 'api'
			}
		}

		throw new Error('No data received from API')
	}

	/**
	 * Create URL
	 * @param {Object} formData - Form data
	 * @param {number} userId - User ID
	 * @returns {Promise<Object>} - Created URL object
	 */
	static async createUrlWithFallback(formData, userId) {
		const urlData = this.mapFrontendFormToBackend(formData, userId)
		const result = await this.createUrl(urlData)
		return {
			...result,
			source: 'api',
			success: true
		}
	}

	/**
	 * Delete URL
	 * @param {Object} url - URL object cần xóa
	 * @returns {Promise<Object>} - Kết quả xóa
	 */
	static async deleteUrlWithFallback(url) {
		await this.deleteUrl(url.shortCode || url.short_code)
		return {
			success: true,
			source: 'api',
			url: url
		}
	}

	/**
	 * Batch delete URLs
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
				results.failed.push(url)
				results.errors.push(error)
				return { success: false, url, error }
			}
		})

		await Promise.all(deletePromises)
		return results
	}
}

export default UrlService
