<template>
	<div class="url-manager-container">
		<!-- Header với nút thêm URL -->
		<div class="header-section">
			<div class="header-content">
				<div class="title-section">
					<h1 class="page-title">
						<a-icon type="link" />
						Quản lý URL
					</h1>
					<p class="page-subtitle">
						Tạo, quản lý và theo dõi các liên kết rút gọn của bạn
					</p>
				</div>
				<a-button type="primary" size="large" @click="showAddModal = true" class="add-btn">
					<template #icon>
						<a-icon type="plus" />
					</template>
					Thêm URL mới
				</a-button>
			</div>
		</div>

		<!-- Statistics Cards -->
		<div class="stats-section">
			<a-row :gutter="16">
				<a-col :span="12">
					<a-card class="stat-card">
						<a-statistic
							title="Tổng URL"
							:value="apiMeta.totalItems || urls.length"
							:value-style="{ color: '#1890ff' }"
						>
							<template #prefix>
								<a-icon type="link" />
							</template>
						</a-statistic>
					</a-card>
				</a-col>
				<a-col :span="12">
					<a-card class="stat-card">
						<a-statistic
							title="URL hoạt động"
							:value="apiMeta.totalItems || urls.length"
							:value-style="{ color: '#52c41a' }"
						>
							<template #prefix>
								<a-icon type="check-circle" />
							</template>
						</a-statistic>
					</a-card>
				</a-col>
			</a-row>
		</div>

		<!-- Search và Filter -->
		<div class="filter-section">
			<a-card>
				<a-row :gutter="16" align="middle">
					<a-col :span="8">
						<a-input-search
							v-model:value="searchText"
							placeholder="Tìm kiếm URL..."
							allow-clear
							@search="handleSearch"
						>
							<template #prefix>
								<a-icon type="search" />
							</template>
						</a-input-search>
					</a-col>
					<a-col :span="6">
						<a-select
							v-model:value="sortBy"
							placeholder="Sắp xếp theo"
							style="width: 100%"
							@change="handleSort"
						>
							<a-select-option value="createdAt">Ngày tạo</a-select-option>
							<a-select-option value="shortUrl">URL ngắn</a-select-option>
						</a-select>
					</a-col>
					<a-col :span="4">
						<a-select
							v-model:value="sortOrder"
							style="width: 100%"
							@change="handleSort"
						>
							<a-select-option value="desc">Giảm dần</a-select-option>
							<a-select-option value="asc">Tăng dần</a-select-option>
						</a-select>
					</a-col>
					<a-col :span="6">
						<a-space>
							<a-button @click="handleRefresh" class="refresh-btn">
								<template #icon>
									<a-icon type="reload" />
								</template>
								Làm mới
							</a-button>
							<a-button
								v-if="selectedRowKeys.length > 0"
								type="danger"
								@click="handleBatchDelete"
								class="delete-btn"
							>
								<template #icon>
									<a-icon type="delete" />
								</template>
								Xóa ({{ selectedRowKeys.length }})
							</a-button>
						</a-space>
					</a-col>
				</a-row>
			</a-card>
		</div>

		<!-- Bảng dữ liệu -->
		<div class="table-section">
			<a-card>
				<a-table
					:columns="columns"
					:data-source="filteredUrls"
					:loading="loading"
					:pagination="{
						...paginationComputed,
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} / ${total} URL (Trang ${paginationComputed.current}/${Math.ceil(paginationComputed.total / paginationComputed.pageSize)})`,
					}"
					:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
					row-key="id"
					size="middle"
					@change="handleTableChange"
				>
					<!-- Custom render cho cột STT -->
					<template #bodyCell="{ column, record, index }">
						<template v-if="column.key === 'index'">
							{{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
						</template>

						<!-- Custom render cho cột Short URL -->
						<template v-else-if="column.key === 'shortUrl'">
							<div class="url-cell">
								<a :href="record.shortUrl" target="_blank" class="short-url-link">
									{{ record.shortUrl }}
								</a>
								<a-tooltip title="Sao chép">
									<a-button
										type="text"
										size="small"
										@click="copyToClipboard(record.shortUrl)"
										class="copy-btn"
									>
										<template #icon>
											<a-icon type="copy" />
										</template>
									</a-button>
								</a-tooltip>
							</div>
						</template>

						<!-- Custom render cho cột Original URL -->
						<template v-else-if="column.key === 'originalUrl'">
							<a-tooltip :title="record.originalUrl">
								<a
									:href="record.originalUrl"
									target="_blank"
									class="original-url-link"
								>
									{{ truncateUrl(record.originalUrl, 50) }}
								</a>
							</a-tooltip>
						</template>

						<!-- Custom render cho cột Created Date -->
						<template v-else-if="column.key === 'createdAt'">
							<div class="date-cell">
								<div class="date-main">{{ formatDate(record.createdAt) }}</div>
								<div class="date-time">{{ formatTime(record.createdAt) }}</div>
							</div>
						</template>

						<!-- Custom render cho cột Actions -->
						<template v-else-if="column.key === 'actions'">
							<a-space size="small">
								<a-popconfirm
									title="Bạn có chắc chắn muốn xóa URL này?"
									ok-text="Có"
									cancel-text="Không"
									@confirm="deleteUrl(record.id)"
								>
									<a-tooltip title="Xóa">
										<a-button
											type="danger"
											size="small"
											class="action-btn delete-btn"
										>
											<template #icon>
												<DeleteOutlined />
											</template>
										</a-button>
									</a-tooltip>
								</a-popconfirm>
								<a-dropdown>
									<a-button size="small" class="action-btn more-btn">
										<template #icon>
											<MoreOutlined />
										</template>
									</a-button>
									<template #overlay>
										<a-menu>
											<a-menu-item @click="shareUrl(record.shortUrl)">
												<ShareAltOutlined style="margin-right: 8px" />
												Chia sẻ
											</a-menu-item>
										</a-menu>
									</template>
								</a-dropdown>
							</a-space>
						</template>
					</template>
				</a-table>
			</a-card>
		</div>

		<!-- Modal thêm/sửa URL -->
		<a-modal
			v-model:open="showAddModal"
			:title="editTarget ? 'Chỉnh sửa URL' : 'Thêm URL mới'"
			:ok-text="editTarget ? 'Cập nhật' : 'Thêm'"
			cancel-text="Hủy"
			:confirm-loading="submitLoading"
			@ok="handleSubmit"
			@cancel="handleCancel"
			width="600px"
		>
			<a-form ref="formRef" :model="form" :rules="rules" layout="vertical" class="url-form">
				<a-form-item label="URL đích" name="originalUrl">
					<a-input
						v-model:value="form.originalUrl"
						placeholder="Nhập URL đích (VD: https://example.com)"
						size="large"
					>
						<template #prefix>
							<a-icon type="link" />
						</template>
					</a-input>
				</a-form-item>

				<a-form-item label="Mô tả (tùy chọn)" name="description">
					<a-textarea
						v-model:value="form.description"
						placeholder="Mô tả ngắn về liên kết này"
						:rows="3"
						show-count
						:maxlength="200"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { DeleteOutlined, MoreOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import UrlService from '../services/urlService.js'

const emit = defineEmits(['urlAdded', 'urlUpdated', 'urlDeleted'])

const urls = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const showAddModal = ref(false)
const editTarget = ref(null)
const searchText = ref('')
const sortBy = ref('createdAt')
const sortOrder = ref('desc')
const selectedRowKeys = ref([])
const apiMeta = ref({
	totalItems: 0,
	itemsPerPage: 10,
	currentPage: 1,
	totalPages: 0,
})

const form = ref({
	originalUrl: '',
	description: '',
})

const formRef = ref()

const baseUrl = 'http://localhost/r/'
const CURRENT_USER_ID = 1

const rules = {
	originalUrl: [
		{ required: true, message: 'Vui lòng nhập URL đích' },
		{
			pattern: /^https?:\/\/.+/,
			message: 'URL phải bắt đầu bằng http:// hoặc https://',
		},
	],
}

const columns = [
	{
		title: 'STT',
		key: 'index',
		width: 70,
		align: 'center',
	},
	{
		title: 'URL ngắn',
		key: 'shortUrl',
		dataIndex: 'shortUrl',
		width: 200,
		ellipsis: true,
	},
	{
		title: 'URL đích',
		key: 'originalUrl',
		dataIndex: 'originalUrl',
		width: 300,
		ellipsis: true,
	},
	{
		title: 'Ngày tạo',
		key: 'createdAt',
		dataIndex: 'createdAt',
		width: 150,
		align: 'center',
		sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
	},
	{
		title: 'Thao tác',
		key: 'actions',
		width: 180,
		align: 'center',
		fixed: 'right',
	},
]

const pagination = ref({
	current: 1,
	pageSize: 10,
	total: 0,
	showSizeChanger: true,
	showQuickJumper: true,
	showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} URL`,
})

const displayUrls = computed(() => {
	return urls.value
})

const filteredUrls = computed(() => {
	let result = [...displayUrls.value]

	// Apply search filter
	if (searchText.value) {
		const search = searchText.value.toLowerCase()
		result = result.filter(
			(url) =>
				url.shortUrl.toLowerCase().includes(search) ||
				url.originalUrl.toLowerCase().includes(search) ||
				(url.description && url.description.toLowerCase().includes(search)),
		)
	}

	// Apply sorting
	if (sortBy.value && sortOrder.value) {
		result.sort((a, b) => {
			let aVal, bVal

			if (sortBy.value === 'createdAt') {
				aVal = new Date(a.createdAt).getTime()
				bVal = new Date(b.createdAt).getTime()
			} else if (sortBy.value === 'shortUrl') {
				aVal = a.shortUrl.toLowerCase()
				bVal = b.shortUrl.toLowerCase()
			} else {
				return 0
			}

			if (sortOrder.value === 'asc') {
				return aVal > bVal ? 1 : -1
			} else {
				return aVal < bVal ? 1 : -1
			}
		})
	}

	return result
})

// Computed để cập nhật pagination dựa trên filtered data
const paginationComputed = computed(() => {
	return {
		...pagination.value,
		total: filteredUrls.value.length,
	}
})

watch([() => pagination.value.pageSize], () => {
	// Chỉ reload khi thay đổi page size, không reload khi thay đổi current page
	loadUrlsFromAPI()
})

const loadUrlsFromAPI = async () => {
	try {
		loading.value = true

		const apiResponse = await UrlService.getUrlsByUserId(CURRENT_USER_ID)

		// Xử lý response theo cấu trúc APIResponse mới
		if (apiResponse.data) {
			// Map dữ liệu từ backend format sang frontend format
			urls.value = apiResponse.data.map((url) => UrlService.mapBackendUrlToFrontend(url))

			// Cập nhật metadata cho pagination từ API response
			if (apiResponse.meta) {
				apiMeta.value = apiResponse.meta
				pagination.value.total = apiResponse.meta.totalItems
				pagination.value.current = apiResponse.meta.currentPage
				pagination.value.pageSize = apiResponse.meta.itemsPerPage
			}
		} else {
			urls.value = []
			pagination.value.total = 0
		}
	} catch (error) {
		console.error('Error loading URLs:', error)
		message.error('Không thể tải danh sách URL. Đang sử dụng dữ liệu offline.')
		loadMockData()
	} finally {
		loading.value = false
	}
}

const loadMockData = () => {
	const savedUrls = localStorage.getItem('userUrls')
	if (savedUrls) {
		urls.value = JSON.parse(savedUrls)
	} else {
		urls.value = [
			{
				id: 1,
				shortUrl: 'https://go.vn/abc123',
				originalUrl: 'https://www.google.com/',
				description: 'Trang chủ Google',
				createdAt: '2024-06-01T10:00:00Z',
			},
			{
				id: 2,
				shortUrl: 'https://go.vn/xyz789',
				originalUrl: 'https://www.facebook.com/',
				description: 'Trang Facebook',
				createdAt: '2024-06-02T12:30:00Z',
			},
			{
				id: 3,
				shortUrl: 'https://go.vn/hello',
				originalUrl: 'https://chat.openai.com/',
				description: 'ChatGPT',
				createdAt: '2024-06-03T08:15:00Z',
			},
		]
		saveToStorage()
	}
	// Cập nhật pagination cho mock data
	pagination.value.total = urls.value.length
}

const saveToStorage = () => {
	localStorage.setItem('userUrls', JSON.stringify(urls.value))
}

const generateShortCode = () => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

const handleSubmit = async () => {
	try {
		await formRef.value.validate()
		submitLoading.value = true

		if (editTarget.value) {
			// Update existing URL - chưa implement vì backend chưa có API update
			message.warning('Chức năng cập nhật đang được phát triển')
		} else {
			// Create new URL
			try {
				const urlData = UrlService.mapFrontendFormToBackend(form.value, CURRENT_USER_ID)
				// console.log('Sending URL data:', urlData)

				await UrlService.createUrl(urlData)
				// console.log('API Response:', response)

				message.success('Thêm URL thành công!')
				emit('urlAdded')

				// Reload data from API
				await loadUrlsFromAPI()
			} catch (apiError) {
				console.error('API Error:', apiError)
				message.error(`Lỗi API: ${apiError.message}`)

				// Fallback to local creation
				const shortCode = generateShortCode()
				const newUrl = {
					id: Date.now(),
					shortUrl: baseUrl + shortCode,
					originalUrl: form.value.originalUrl,
					description: form.value.description || '',
					createdAt: new Date().toISOString(),
					shortCode: shortCode,
				}

				urls.value.unshift(newUrl)
				message.success('Thêm URL thành công! (Offline mode)')
				emit('urlAdded', newUrl)
			}
		}

		saveToStorage()
		handleCancel()
	} catch (error) {
		console.error('Form validation failed:', error)
		message.error('Có lỗi xảy ra, vui lòng thử lại')
	} finally {
		submitLoading.value = false
	}
}

const handleCancel = () => {
	showAddModal.value = false
	editTarget.value = null
	form.value = {
		originalUrl: '',
		description: '',
	}
	formRef.value?.resetFields()
}

const deleteUrl = async (id) => {
	const url = urls.value.find((u) => u.id === id)
	if (!url) return

	try {
		// Thử xóa qua API trước
		if (url.shortCode) {
			await UrlService.deleteUrl(url.shortCode)
		}

		// Xóa khỏi local state
		const index = urls.value.findIndex((u) => u.id === id)
		if (index !== -1) {
			const deletedUrl = urls.value.splice(index, 1)[0]
			saveToStorage()
			message.success('Xóa URL thành công!')
			emit('urlDeleted', deletedUrl)

			// Reload data to sync with backend
			await loadUrlsFromAPI()
		}
	} catch (error) {
		console.error('Error deleting URL:', error)

		// Fallback to local delete nếu API fail
		const index = urls.value.findIndex((u) => u.id === id)
		if (index !== -1) {
			const deletedUrl = urls.value.splice(index, 1)[0]
			saveToStorage()
			message.success('Xóa URL thành công! (Offline mode)')
			emit('urlDeleted', deletedUrl)
		}
	}
}

const handleBatchDelete = async () => {
	try {
		loading.value = true
		const selectedUrls = urls.value.filter((url) => selectedRowKeys.value.includes(url.id))

		// Try to delete through API first
		const deletePromises = selectedUrls.map(async (url) => {
			try {
				if (url.shortCode) {
					await UrlService.deleteUrl(url.shortCode)
				}
				return { success: true, url }
			} catch (error) {
				console.error(`Failed to delete ${url.shortCode}:`, error)
				return { success: false, url }
			}
		})

		const results = await Promise.all(deletePromises)
		const successful = results.filter((r) => r.success).length
		const failed = results.filter((r) => !r.success).length

		// Remove from local state
		urls.value = urls.value.filter((url) => !selectedRowKeys.value.includes(url.id))
		selectedRowKeys.value = []
		saveToStorage()

		if (failed === 0) {
			message.success(`Xóa thành công ${successful} URL!`)
		} else {
			message.warning(`Xóa thành công ${successful} URL, thất bại ${failed} URL`)
		}

		// Reload data to sync with backend
		await loadUrlsFromAPI()
	} catch (error) {
		console.error('Batch delete error:', error)

		// Fallback to local delete
		urls.value = urls.value.filter((url) => !selectedRowKeys.value.includes(url.id))
		selectedRowKeys.value = []
		saveToStorage()
		message.success('Xóa các URL đã chọn thành công! (Offline mode)')
	} finally {
		loading.value = false
	}
}

const onSelectChange = (selectedKeys) => {
	selectedRowKeys.value = selectedKeys
}

const handleSearch = () => {
	// Reset về trang 1 khi search
	pagination.value.current = 1
}

const handleSort = () => {
	// Reset về trang 1 khi sort
	pagination.value.current = 1
}

const handleRefresh = async () => {
	await loadUrlsFromAPI()
	message.success('Đã làm mới dữ liệu!')
}

const handleTableChange = (pag) => {
	pagination.value.current = pag.current
	pagination.value.pageSize = pag.pageSize
}

const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text)
		message.success('Đã sao chép vào clipboard!')
	} catch (error) {
		console.error('Failed to copy:', error)
		message.error('Không thể sao chép')
	}
}

const shareUrl = (url) => {
	const shareData = {
		title: 'URL rút gọn',
		text: 'Chia sẻ URL rút gọn',
		url: url,
	}

	if (navigator.share) {
		navigator.share(shareData)
	} else {
		copyToClipboard(url)
	}
}

const formatDate = (dateStr) => {
	const date = new Date(dateStr)
	return date.toLocaleDateString('vi-VN')
}

const formatTime = (dateStr) => {
	const date = new Date(dateStr)
	return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const truncateUrl = (url, maxLength) => {
	return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
}

onMounted(() => {
	loadUrlsFromAPI()
})

// Watch for search text changes to reset pagination
watch(searchText, () => {
	pagination.value.current = 1
})
</script>

<style scoped>
.url-manager-container {
	padding: 24px;
	padding-top: 118px;
	background: #f0f2f5;
	min-height: calc(100vh - 94px);
}

.header-section {
	margin-bottom: 24px;
}

.header-content {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	background: white;
	padding: 24px;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title-section {
	flex: 1;
}

.page-title {
	margin: 0;
	font-size: 28px;
	font-weight: 600;
	color: #1890ff;
	display: flex;
	align-items: center;
	gap: 12px;
}

.page-subtitle {
	margin: 8px 0 0 0;
	color: #666;
	font-size: 16px;
}

.add-btn {
	height: 48px;
	padding: 0 24px;
	font-size: 16px;
	font-weight: 500;
}

.stats-section {
	margin-bottom: 24px;
}

.stat-card {
	text-align: center;
	transition: transform 0.2s;
}

.stat-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filter-section {
	margin-bottom: 24px;
}

.table-section {
	margin-bottom: 24px;
}

.url-cell {
	display: flex;
	align-items: center;
	gap: 8px;
}

.short-url-link {
	color: #1890ff;
	font-weight: 500;
	text-decoration: none;
}

.short-url-link:hover {
	text-decoration: underline;
}

.original-url-link {
	color: #666;
	text-decoration: none;
}

.original-url-link:hover {
	color: #1890ff;
	text-decoration: underline;
}

.date-cell {
	text-align: center;
}

.date-main {
	font-weight: 500;
	color: #333;
}

.date-time {
	font-size: 12px;
	color: #999;
}

.url-form {
	margin-top: 16px;
}

/* Fix for action buttons */
.action-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.edit-btn {
	background-color: #1890ff;
	border-color: #1890ff;
	color: white;
}

.edit-btn:hover,
.edit-btn:focus {
	background-color: #40a9ff;
	border-color: #40a9ff;
	color: white;
}

.delete-btn {
	background-color: #ff4d4f;
	border-color: #ff4d4f;
	color: white;
}

.delete-btn:hover,
.delete-btn:focus {
	background-color: #ff7875;
	border-color: #ff7875;
	color: white;
}

.more-btn {
	border-color: #d9d9d9;
	color: #666;
}

.more-btn:hover,
.more-btn:focus {
	border-color: #1890ff;
	color: #1890ff;
}

.copy-btn {
	color: #666;
	padding: 4px;
}

.copy-btn:hover {
	color: #1890ff;
	background-color: #f0f8ff;
}

.refresh-btn {
	color: #666;
}

.refresh-btn:hover {
	color: #1890ff;
	border-color: #1890ff;
}

/* Ensure icons are properly colored */
:deep(.anticon) {
	color: inherit !important;
}

/* Action button spacing */
:deep(.ant-space-item) {
	display: flex;
	align-items: center;
}

@media (max-width: 768px) {
	.url-manager-container {
		padding: 16px;
	}

	.header-content {
		flex-direction: column;
		gap: 16px;
		align-items: stretch;
	}

	.page-title {
		font-size: 24px;
	}

	:deep(.ant-table) {
		font-size: 12px;
	}

	:deep(.ant-col) {
		margin-bottom: 16px;
	}
}

@media (max-width: 576px) {
	.stats-section :deep(.ant-col) {
		width: 100% !important;
		margin-bottom: 16px;
	}

	.filter-section :deep(.ant-col) {
		width: 100% !important;
		margin-bottom: 8px;
	}
}

:deep(.ant-table-tbody) {
	scrollbar-width: thin;
	scrollbar-color: #c1c1c1 #f1f1f1;
}

:deep(.ant-table-tbody::-webkit-scrollbar) {
	width: 6px;
}

:deep(.ant-table-tbody::-webkit-scrollbar-track) {
	background: #f1f1f1;
}

:deep(.ant-table-tbody::-webkit-scrollbar-thumb) {
	background: #c1c1c1;
	border-radius: 3px;
}

:deep(.ant-table-tbody::-webkit-scrollbar-thumb:hover) {
	background: #a8a8a8;
}
</style>
