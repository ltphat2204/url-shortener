import { message } from 'ant-design-vue'

export const urlTableUtils = {
	// Format date for display
	formatDate(dateStr) {
		const date = new Date(dateStr)
		return date.toLocaleDateString('vi-VN')
	},

	// Format time for display
	formatTime(dateStr) {
		const date = new Date(dateStr)
		return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
	},

	// Truncate URL for display
	truncateUrl(url, maxLength) {
		return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
	},

	// Copy text to clipboard
	async copyToClipboard(text) {
		try {
			await navigator.clipboard.writeText(text)
			message.success('Đã sao chép vào clipboard!')
		} catch {
			message.error('Không thể sao chép')
		}
	},

	// Share URL using Web Share API or fallback to copy
	shareUrl(url) {
		const shareData = {
			title: 'URL rút gọn',
			text: 'Chia sẻ URL rút gọn',
			url: url,
		}

		if (navigator.share) {
			navigator.share(shareData)
		} else {
			this.copyToClipboard(url)
		}
	},

	// Generate pagination text
	getPaginationText(total, range, current, pageSize) {
		const totalPages = Math.ceil(total / pageSize)
		return `${range[0]}-${range[1]} / ${total} URL (Trang ${current}/${totalPages})`
	},
}
