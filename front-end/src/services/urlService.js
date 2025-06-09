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

    const response = await fetch(
      `${API_BASE_URL}/url/user/${userIdNum}`
    )

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
   * @returns {Promise<string>} - Short code của URL được tạo
   */
  static async createUrl(urlData) {
    // Chỉ gửi destination_url và user_id, bỏ short_code tùy chỉnh
    const requestData = {
      destination_url: urlData.destination_url,
      user_id: urlData.user_id
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

    // Backend trả về string thuần túy (short URL), không phải JSON
    return await response.text()
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
   */  static async deleteUrl(shortCode) {
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
   */  static async getUrlByShortCode(shortCode) {
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
   */  static mapBackendUrlToFrontend(backendUrl) {
    return {
      id: backendUrl.id,
      shortUrl: `${SHORT_URL_BASE}${backendUrl.short_code}`,
      originalUrl: backendUrl.destination_url,
      description: backendUrl.description || '',
      createdAt: backendUrl.create_at, // Sửa từ created_at thành create_at
      shortCode: backendUrl.short_code,
      userId: backendUrl.user_id
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
      user_id: userId
    }

    // Chỉ thêm description nếu có giá trị
    if (formData.description) {
      result.description = formData.description
    }

    return result
  }
}

export default UrlService
