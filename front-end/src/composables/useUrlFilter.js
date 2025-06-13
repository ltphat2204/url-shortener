import { ref } from 'vue'

export function useUrlFilter() {
	const searchText = ref('')
	const sortBy = ref('createdAt')
	const sortOrder = ref('desc')

	// Filter and sort URLs
	const getFilteredUrls = (urls) => {
		let result = [...urls]

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
	}

	// Reset search
	const resetSearch = () => {
		searchText.value = ''
	}

	// Reset sort
	const resetSort = () => {
		sortBy.value = 'createdAt'
		sortOrder.value = 'desc'
	}

	// Reset all filters
	const resetFilters = () => {
		resetSearch()
		resetSort()
	}

	return {
		// State
		searchText,
		sortBy,
		sortOrder,

		// Methods
		getFilteredUrls,
		resetSearch,
		resetSort,
		resetFilters,
	}
}
