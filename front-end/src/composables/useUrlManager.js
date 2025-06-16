import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import UrlService from '../services/urlService.js'
import AuthService from '../services/authService.js'

export function useUrlManager(emit) {
	const urls = ref([])
	const loading = ref(false)
	const submitLoading = ref(false)
	const apiMeta = ref({
		totalItems: 0,
		itemsPerPage: 10,
		currentPage: 1,
		totalPages: 0,
	})
	// Get current user ID from session
	const getCurrentUserId = () => {
		const currentUser = AuthService.getCurrentUser()
		const token = localStorage.getItem('token')

		if (currentUser && currentUser.id) {
			return currentUser.id
		}

		// Try to decode JWT token to get username
		if (token) {
			try {
				const parts = token.split('.')
				if (parts.length === 3) {
					const payload = parts[1]
					const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
					const tokenData = JSON.parse(decoded)

					if (tokenData.sub) {
						const userId = Math.abs(tokenData.sub.split('').reduce((hash, char) => {
							return char.charCodeAt(0) + ((hash << 5) - hash)
						}, 0)) % 100000 + 1000
						return userId
					}
				}
			} catch {
				// Failed to decode JWT token
			}
		}

		// Fallback: try to extract user ID from email or username
		let identifier = currentUser?.email || currentUser?.username
		if (identifier) {
			// Create a consistent numeric ID from identifier
			const userId = Math.abs(identifier.split('').reduce((hash, char) => {
				return char.charCodeAt(0) + ((hash << 5) - hash)
			}, 0)) % 100000 + 1000
			return userId
		}

		return 1 // Ultimate fallback
	}

	const baseUrl = 'http://localhost/r/'

	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		showSizeChanger: true,
		showQuickJumper: true,
		showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} URL`,
	})
	// Load URLs from API với pagination, sorting và search
	const loadUrlsFromAPI = async (page = null, pageSize = null, sortBy = 'create_at', sortOrder = 'desc', search = '') => {
		try {
			loading.value = true

			const currentUserId = getCurrentUserId()
			const currentPage = page || pagination.value.current
			const currentPageSize = pageSize || pagination.value.pageSize

			const response = await UrlService.getUrlsWithFallback(
				currentUserId,
				currentPage,
				currentPageSize,
				sortBy,
				sortOrder,
				search
			)

			urls.value = response.data

			if (response.meta) {
				apiMeta.value = response.meta
				pagination.value.total = response.meta.totalItems
				pagination.value.current = response.meta.currentPage
				pagination.value.pageSize = response.meta.itemsPerPage
			}
		} catch {
			message.error('Không thể tải danh sách URL')
		} finally {
			loading.value = false
		}
	}

	// Create new URL
	const createUrl = async (formData) => {
		try {
			const currentUserId = getCurrentUserId()
			const result = await UrlService.createUrlWithFallback(formData, currentUserId)

			if (result.success) {
				message.success('Thêm URL thành công!')
				emit('urlAdded', result)
				await loadUrlsFromAPI()
				return true
			}
		} catch {
			message.error('Có lỗi xảy ra khi tạo URL')
		}
		return false
	}
	// Delete single URL with fallback
	const deleteUrl = async (id) => {
		const url = urls.value.find((u) => u.id === id)
		if (!url) return

		try {
			const result = await UrlService.deleteUrlWithFallback(url)

			if (result.success) {
				// Remove from local state
				const index = urls.value.findIndex((u) => u.id === id)
				if (index !== -1) {
					const deletedUrl = urls.value.splice(index, 1)[0]

					if (result.source === 'api') {
						message.success('Xóa URL thành công!')
					} else {
						message.success('Xóa URL thành công! (Offline mode)')
					}

					emit('urlDeleted', deletedUrl)
					await loadUrlsFromAPI()
				}
			} else {
				message.error('Không thể xóa URL')
			}
		} catch {
			message.error('Có lỗi xảy ra khi xóa URL')
		}
	}

	// Batch delete URLs
	const batchDeleteUrls = async (selectedIds, selectedRowKeys) => {
		try {
			loading.value = true
			const selectedUrls = urls.value.filter((url) => selectedIds.includes(url.id))

			const results = await UrlService.batchDeleteUrls(selectedUrls)

			// Remove from local state
			urls.value = urls.value.filter((url) => !selectedIds.includes(url.id))
			selectedRowKeys.value = []

			// Show appropriate message
			if (results.failed.length === 0) {
				message.success(`Xóa thành công ${results.successful.length} URL!`)
			} else {
				message.warning(
					`Xóa thành công ${results.successful.length} URL, thất bại ${results.failed.length} URL`
				)
			}

			await loadUrlsFromAPI()
		} catch {
			message.error('Có lỗi xảy ra khi xóa URLs')
		} finally {
			loading.value = false
		}
	}

	// Watch for pagination changes
	watch([() => pagination.value.pageSize], () => {
		loadUrlsFromAPI()
	})

	return {
		// State
		urls,
		loading,
		submitLoading,
		apiMeta,
		pagination,

		// Constants
		getCurrentUserId,
		baseUrl,

		// Methods
		loadUrlsFromAPI,
		createUrl,
		deleteUrl,
		batchDeleteUrls,
	}
}
