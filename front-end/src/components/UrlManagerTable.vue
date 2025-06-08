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
							:value="urls.length"
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
							:value="urls.length"
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
							<a-button @click="handleRefresh">
								<template #icon>
									<a-icon type="reload" />
								</template>
								Làm mới
							</a-button>
							<a-button
								v-if="selectedRowKeys.length > 0"
								danger
								@click="handleBatchDelete"
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
					:pagination="pagination"
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
									>
										<template #icon>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<rect
													x="9"
													y="9"
													width="13"
													height="13"
													rx="2"
													ry="2"
												/>
												<path
													d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
												/>
											</svg>
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
							<a-space>
								<a-tooltip title="Chỉnh sửa">
									<a-button type="primary" size="small" @click="editUrl(record)">
										<template #icon>
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
											>
												<path
													d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
												/>
												<path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
											</svg>
										</template>
									</a-button>
								</a-tooltip>
								<a-popconfirm
									title="Bạn có chắc muốn xóa URL này?"
									ok-text="Xóa"
									cancel-text="Hủy"
									@confirm="deleteUrl(record.id)"
								>
									<a-tooltip title="Xóa">
										<a-button type="primary" danger size="small">
											<template #icon>
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<polyline points="3,6 5,6 21,6" />
													<path
														d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
													/>
													<line x1="10" y1="11" x2="10" y2="17" />
													<line x1="14" y1="11" x2="14" y2="17" />
												</svg>
											</template>
										</a-button>
									</a-tooltip>
								</a-popconfirm>
								<a-dropdown>
									<a-tooltip title="Thêm tùy chọn">
										<a-button size="small">
											<template #icon>
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
												>
													<circle cx="12" cy="12" r="1" />
													<circle cx="19" cy="12" r="1" />
													<circle cx="5" cy="12" r="1" />
												</svg>
											</template>
										</a-button>
									</a-tooltip>
									<template #overlay>
										<a-menu>
											<a-menu-item @click="shareUrl(record)">
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													style="margin-right: 8px; display: inline"
												>
													<path
														d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
													/>
													<path
														d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
													/>
												</svg>
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

				<a-form-item label="URL ngắn tùy chỉnh (tùy chọn)" name="customShort">
					<a-input
						v-model:value="form.customShort"
						placeholder="Tùy chỉnh phần sau (VD: my-link)"
						size="large"
						:addon-before="baseUrl"
					>
						<template #prefix>
							<a-icon type="edit" />
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

const form = ref({
	originalUrl: '',
	customShort: '',
	description: '',
})

const formRef = ref()

const baseUrl = 'https://url-shortener.vn/'

const rules = {
	originalUrl: [
		{ required: true, message: 'Vui lòng nhập URL đích' },
		{
			pattern: /^https?:\/\/.+/,
			message: 'URL phải bắt đầu bằng http:// hoặc https://',
		},
	],
	customShort: [
		{
			pattern: /^[a-zA-Z0-9\-_]+$/,
			message: 'Chỉ được sử dụng chữ cái, số, dấu gạch ngang và gạch dưới',
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

const filteredUrls = computed(() => {
	let result = [...urls.value]

	if (searchText.value) {
		const search = searchText.value.toLowerCase()
		result = result.filter(
			(url) =>
				url.shortUrl.toLowerCase().includes(search) ||
				url.originalUrl.toLowerCase().includes(search),
		)
	}

	result.sort((a, b) => {
		let aVal = a[sortBy.value]
		let bVal = b[sortBy.value]

		if (sortBy.value === 'createdAt') {
			aVal = new Date(aVal)
			bVal = new Date(bVal)
		}

		if (sortOrder.value === 'asc') {
			return aVal > bVal ? 1 : -1
		} else {
			return aVal < bVal ? 1 : -1
		}
	})

	return result
})

watch(
	filteredUrls,
	(newUrls) => {
		pagination.value.total = newUrls.length
	},
	{ immediate: true },
)

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

		await new Promise((resolve) => setTimeout(resolve, 1000))

		if (editTarget.value) {
			const index = urls.value.findIndex((u) => u.id === editTarget.value.id)
			if (index !== -1) {
				urls.value[index] = {
					...urls.value[index],
					originalUrl: form.value.originalUrl,
					description: form.value.description,
				}

				if (form.value.customShort) {
					urls.value[index].shortUrl = baseUrl + form.value.customShort
				}

				message.success('Cập nhật URL thành công!')
				emit('urlUpdated', urls.value[index])
			}
		} else {
			const shortCode = form.value.customShort || generateShortCode()
			const newUrl = {
				id: Date.now(),
				shortUrl: baseUrl + shortCode,
				originalUrl: form.value.originalUrl,
				description: form.value.description || '',
				createdAt: new Date().toISOString(),
			}

			urls.value.unshift(newUrl)
			message.success('Thêm URL thành công!')
			emit('urlAdded', newUrl)
		}

		saveToStorage()
		handleCancel()
	} catch (error) {
		console.error('Form validation failed:', error)
	} finally {
		submitLoading.value = false
	}
}

const handleCancel = () => {
	showAddModal.value = false
	editTarget.value = null
	form.value = {
		originalUrl: '',
		customShort: '',
		description: '',
	}
	formRef.value?.resetFields()
}

const editUrl = (url) => {
	editTarget.value = { ...url }
	form.value = {
		originalUrl: url.originalUrl,
		customShort: url.shortUrl.replace(baseUrl, ''),
		description: url.description || '',
	}
	showAddModal.value = true
}

const deleteUrl = (id) => {
	const index = urls.value.findIndex((u) => u.id === id)
	if (index !== -1) {
		const deletedUrl = urls.value.splice(index, 1)[0]
		saveToStorage()
		message.success('Xóa URL thành công!')
		emit('urlDeleted', deletedUrl)
	}
}

const handleBatchDelete = () => {
	urls.value = urls.value.filter((url) => !selectedRowKeys.value.includes(url.id))
	selectedRowKeys.value = []
	saveToStorage()
	message.success('Xóa các URL đã chọn thành công!')
}

const onSelectChange = (selectedKeys) => {
	selectedRowKeys.value = selectedKeys
}

const handleSearch = () => {
	pagination.value.current = 1
}

const handleSort = () => {
	pagination.value.current = 1
}

const handleRefresh = () => {
	loading.value = true
	setTimeout(() => {
		loadMockData()
		loading.value = false
		message.success('Đã làm mới dữ liệu!')
	}, 500)
}

const handleTableChange = (pag) => {
	pagination.value = { ...pagination.value, ...pag }
}

const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text)
		message.success('Đã sao chép vào clipboard!')
	} catch {
		message.error('Không thể sao chép!')
	}
}

const shareUrl = (url) => {
	const shareData = {
		title: 'Chia sẻ liên kết',
		text: url.description || 'Liên kết rút gọn',
		url: url.shortUrl,
	}

	if (navigator.share) {
		navigator.share(shareData)
	} else {
		copyToClipboard(url.shortUrl)
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
	loadMockData()
})

watch(searchText, () => {
	pagination.value.current = 1
})
</script>

<style scoped>
.url-manager-container {
	padding: 24px;
	padding-top: 118px; /* Thêm padding-top để tránh header fixed */
	background: #f0f2f5;
	min-height: calc(100vh - 94px); /* Updated to match new header height */
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
