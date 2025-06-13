export const urlTableConfig = {
	// Table columns configuration
	columns: [
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
	],

	// Sort options
	sortOptions: [
		{ value: 'createdAt', label: 'Ngày tạo' },
		{ value: 'shortUrl', label: 'URL ngắn' },
	],

	// Sort order options
	sortOrderOptions: [
		{ value: 'desc', label: 'Giảm dần' },
		{ value: 'asc', label: 'Tăng dần' },
	],

	// Default pagination settings
	defaultPagination: {
		current: 1,
		pageSize: 10,
		total: 0,
		showSizeChanger: true,
		showQuickJumper: true,
		showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} URL`,
	},

	// Constants
	BASE_URL: 'http://localhost/r/',
	CURRENT_USER_ID: 1,
}
