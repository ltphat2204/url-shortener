import { ref } from 'vue'
import { urlTableConfig } from '../config/urlTableConfig.js'

export function useUrlFilter() {
	const searchText = ref('')
	const sortBy = ref('create_at') // Backend field name
	const sortOrder = ref('desc')

	// Reset search
	const resetSearch = () => {
		searchText.value = ''
	}

	// Reset sort
	const resetSort = () => {
		sortBy.value = urlTableConfig.defaultSort.sortBy
		sortOrder.value = urlTableConfig.defaultSort.sortOrder
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
		resetSearch,
		resetSort,
		resetFilters,
	}
}
