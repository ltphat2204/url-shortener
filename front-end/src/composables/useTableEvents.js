import { ref } from 'vue'
import { message } from 'ant-design-vue'

export function useTableEvents(pagination, loadUrlsFromAPI) {
	const selectedRowKeys = ref([])

	// Handle table selection change
	const onSelectChange = (selectedKeys) => {
		selectedRowKeys.value = selectedKeys
	}

	// Handle search
	const handleSearch = () => {
		pagination.value.current = 1
	}

	// Handle sort
	const handleSort = () => {
		pagination.value.current = 1
	}

	// Handle refresh
	const handleRefresh = async () => {
		await loadUrlsFromAPI(1)
		message.success('Đã làm mới dữ liệu!')
	}

	// Handle table pagination change
	const handleTableChange = async (pag) => {
		pagination.value.current = pag.current
		pagination.value.pageSize = pag.pageSize
		await loadUrlsFromAPI(pag.current, pag.pageSize)
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
