<template>
	<div class="url-manager-container">
		<!-- Header với nút thêm URL -->
		<div class="header-section">
			<div class="header-content">
				<div class="title-section">
					<h1 class="page-title">
						<LinkOutlined />
						Quản lý URL
					</h1>
					<p class="page-subtitle">
						Tạo, quản lý và theo dõi các liên kết rút gọn của bạn
					</p>
				</div>
				<a-button type="primary" size="large" @click="showModal" class="add-btn">
					<template #icon>
						<LinkOutlined />
					</template>
					Tạo URL ngắn
				</a-button>
			</div>
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
								<SearchOutlined />
							</template>
						</a-input-search>
					</a-col>
					<a-col :span="2" class="sort-label-col">
						<span class="sort-label">Sắp xếp theo:</span>
					</a-col>
					<a-col :span="4">
						<a-select
							v-model:value="sortBy"
							placeholder="Chọn trường"
							style="width: 100%"
							@change="handleSort"
						>
							<a-select-option
								v-for="option in urlTableConfig.sortOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</a-select-option>
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
					<a-col :span="4">
						<a-space>
							<a-button @click="handleRefresh" class="refresh-btn">
								<template #icon>
									<ReloadOutlined />
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
									<DeleteOutlined />
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
					:data-source="urls"
					:loading="loading"
					:pagination="{
						...paginationComputed,
						showQuickJumper: false,
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
											<CopyOutlined />
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

						<!-- Custom render cho cột Description -->
						<template v-else-if="column.key === 'description'">
							<a-tooltip :title="record.description">
								<span class="description-cell">
									{{ record.description || 'Không có mô tả' }}
								</span>
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
								<a-tooltip title="Chia sẻ">
									<a-button
										size="small"
										class="action-btn share-btn"
										@click="shareUrl(record.shortUrl)"
									>
										<template #icon>
											<ShareAltOutlined />
										</template>
									</a-button>
								</a-tooltip>
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
							</a-space>
						</template>
					</template>
				</a-table>
			</a-card>
		</div>

		<!-- Modal thêmURL -->
		<a-modal
			v-model:open="showAddModal"
			title="Thêm URL mới"
			ok-text="Thêm"
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
							<LinkOutlined />
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
import { computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
	DeleteOutlined,
	ShareAltOutlined,
	LinkOutlined,
	SearchOutlined,
	ReloadOutlined,
	CopyOutlined,
} from '@ant-design/icons-vue'
import { useUrlManager } from '../composables/useUrlManager.js'
import { useUrlFilter } from '@/composables/useUrlFilter.js'
import { useUrlForm } from '@/composables/useUrlForm.js'
import { urlTableUtils } from '@/utils/urlTableUtils.js'
import { urlTableConfig } from '@/config/urlTableConfig.js'
import { useTableEvents } from '@/composables/useTableEvents.js'

const emit = defineEmits(['urlAdded', 'urlUpdated', 'urlDeleted'])

// Use composables
const {
	urls,
	loading,
	submitLoading,
	pagination,
	loadUrlsFromAPI,
	createUrl,
	deleteUrl,
	batchDeleteUrls,
} = useUrlManager(emit)

const { searchText, sortBy, sortOrder } = useUrlFilter()

const { showAddModal, formRef, form, rules, showModal, closeModal, validateForm } = useUrlForm()

const {
	selectedRowKeys,
	onSelectChange,
	handleSearch,
	handleSort,
	handleRefresh,
	handleTableChange,
} = useTableEvents(pagination, loadUrlsFromAPI, searchText, sortBy, sortOrder)

// Configuration
const { columns } = urlTableConfig

// Computed để cập nhật pagination display
const paginationComputed = computed(() => {
	return {
		...pagination.value,
		showTotal: (total, range) =>
			urlTableUtils.getPaginationText(
				total,
				range,
				pagination.value.current,
				pagination.value.pageSize,
			),
	}
})

const handleSubmit = async () => {
	try {
		await validateForm()
		submitLoading.value = true

		await createUrl(form.value)
		closeModal()
	} catch {
		message.error('Có lỗi xảy ra, vui lòng thử lại')
	} finally {
		submitLoading.value = false
	}
}

const handleCancel = () => {
	closeModal()
}

const handleBatchDelete = async () => {
	await batchDeleteUrls(selectedRowKeys.value, selectedRowKeys)
}

const { copyToClipboard, shareUrl, formatDate, formatTime, truncateUrl } = urlTableUtils

onMounted(() => {
	loadUrlsFromAPI(1, 10, sortBy.value, sortOrder.value, searchText.value) // Load với parameters đầy đủ
})
</script>

<style scoped>
.url-manager-container {
	padding: 24px;
	padding-top: 118px;
	background: #f0f2f5;
	min-height: 100vh;
	width: 100%;
	position: relative;
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
	padding: 0 32px;
	font-size: 16px;
	font-weight: 600;
	border-radius: 12px;
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	border: none;
	box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
	transition: all 0.3s ease;
}

.add-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
	background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
}

.add-btn:active {
	transform: translateY(0);
	box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.filter-section {
	margin-bottom: 24px;
}

.sort-label-col {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: 8px;
}

.sort-label {
	font-weight: 500;
	color: #333;
	white-space: nowrap;
}

.table-section {
	margin-bottom: 24px;
}

.url-cell {
	display: flex;
	align-items: center;
	gap: 8px;
}

.description-cell {
	color: #666;
	font-size: 13px;
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

.share-btn {
	background-color: #52c41a;
	border-color: #52c41a;
	color: white;
}

.share-btn:hover,
.share-btn:focus {
	background-color: #73d13d;
	border-color: #73d13d;
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

	.sort-label-col {
		justify-content: flex-start;
		padding-right: 0;
		margin-bottom: 8px;
	}

	.sort-label {
		font-size: 14px;
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
