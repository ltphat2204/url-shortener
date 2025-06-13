import { ref } from 'vue'

export function useUrlForm() {
	const showAddModal = ref(false)
	const editTarget = ref(null)
	const formRef = ref()

	const form = ref({
		originalUrl: '',
		description: '',
	})

	const rules = {
		originalUrl: [
			{ required: true, message: 'Vui lòng nhập URL đích' },
			{
				pattern: /^https?:\/\/.+/,
				message: 'URL phải bắt đầu bằng http:// hoặc https://',
			},
		],
	}

	// Show add modal
	const showModal = () => {
		showAddModal.value = true
	}

	// Show edit modal
	const showEditModal = (url) => {
		editTarget.value = url
		form.value = {
			originalUrl: url.originalUrl,
			description: url.description || '',
		}
		showAddModal.value = true
	}

	// Close modal and reset form
	const closeModal = () => {
		showAddModal.value = false
		editTarget.value = null
		form.value = {
			originalUrl: '',
			description: '',
		}
		formRef.value?.resetFields()
	}

	// Validate form
	const validateForm = async () => {
		return await formRef.value.validate()
	}

	// Reset form
	const resetForm = () => {
		form.value = {
			originalUrl: '',
			description: '',
		}
		formRef.value?.resetFields()
	}

	return {
		// State
		showAddModal,
		editTarget,
		formRef,
		form,
		rules,

		// Methods
		showModal,
		showEditModal,
		closeModal,
		validateForm,
		resetForm,
	}
}
