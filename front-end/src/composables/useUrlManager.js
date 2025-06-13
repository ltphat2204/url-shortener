import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import UrlService from '../services/urlService.js'

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

	const CURRENT_USER_ID = 1
	const baseUrl = 'http://localhost/r/'

	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		showSizeChanger: true,
		showQuickJumper: true,
		showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} URL`,
	})
	// Load URLs from API with fallback
	const loadUrlsFromAPI = async () => {
		try {
			loading.value = true

			const response = await UrlService.getUrlsWithFallback(CURRENT_USER_ID)

			urls.value = response.data

			if (response.meta) {
				apiMeta.value = response.meta
				pagination.value.total = response.meta.totalItems
				pagination.value.current = response.meta.currentPage
				pagination.value.pageSize = response.meta.itemsPerPage
			}

			// Show message based on data source
			if (response.source === 'offline') {
				message.warning('Đang sử dụng dữ liệu offline')
			}
		} catch (error) {
			console.error('Error loading URLs:', error)
			message.error('Không thể tải danh sách URL')
			// Load default mock data as last resort
			loadMockData()
		} finally {
			loading.value = false
		}
	}
	// Load mock data as fallback
	const loadMockData = () => {
		urls.value = UrlService.loadFromLocalStorage()
		pagination.value.total = urls.value.length
	}
	// Save to localStorage
	const saveToStorage = () => {
		UrlService.saveToLocalStorage(urls.value)
	}
	// Create new URL with fallback
	const createUrl = async (formData) => {
		try {
			const result = await UrlService.createUrlWithFallback(formData, CURRENT_USER_ID)

			if (result.success) {
				if (result.source === 'api') {
					message.success('Thêm URL thành công!')
				} else {
					message.success('Thêm URL thành công! (Offline mode)')
				}
				emit('urlAdded', result)
				await loadUrlsFromAPI()
				return true
			}
		} catch (error) {
			console.error('Create URL error:', error)
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
		} catch (error) {
			console.error('Delete URL error:', error)
			message.error('Có lỗi xảy ra khi xóa URL')		}
	}

	// Batch delete URLs with fallback
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
		} catch (error) {
			console.error('Batch delete error:', error)
			message.error('Có lỗi xảy ra khi xóa URLs')
		} finally {
			loading.value = false
		}	}

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
		CURRENT_USER_ID,
		baseUrl,

		// Methods
		loadUrlsFromAPI,
		loadMockData,
		saveToStorage,
		createUrl,
		deleteUrl,
		batchDeleteUrls,
	}
}
