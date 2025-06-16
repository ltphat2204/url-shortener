import { ref } from 'vue'
import { message } from 'ant-design-vue'

export function useTableEvents(pagination, loadUrlsFromAPI, searchText, sortBy, sortOrder) {
	const selectedRowKeys = ref([])

	// Handle table selection change
	const onSelectChange = (selectedKeys) => {
		selectedRowKeys.value = selectedKeys
	}

	// Handle search
	const handleSearch = async () => {
		pagination.value.current = 1
		await loadUrlsFromAPI(1, pagination.value.pageSize, sortBy.value, sortOrder.value, searchText.value)
	}

	// Handle sort
	const handleSort = async () => {
		pagination.value.current = 1
		await loadUrlsFromAPI(1, pagination.value.pageSize, sortBy.value, sortOrder.value, searchText.value)
	}

	// Handle refresh
	const handleRefresh = async () => {
		await loadUrlsFromAPI(1, pagination.value.pageSize, sortBy.value, sortOrder.value, searchText.value)
		message.success('Đã làm mới dữ liệu!')
	}

	// Handle table pagination change
	const handleTableChange = async (pag) => {
		pagination.value.current = pag.current
		pagination.value.pageSize = pag.pageSize
		await loadUrlsFromAPI(pag.current, pag.pageSize, sortBy.value, sortOrder.value, searchText.value)
	}

	return {
		// State
		selectedRowKeys,

		// Methods
		onSelectChange,
		handleSearch,
		handleSort,
		handleRefresh,
		handleTableChange,
	}
}
