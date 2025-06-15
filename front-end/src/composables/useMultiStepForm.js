import { ref, computed } from 'vue'

export function useMultiStepForm() {
	const currentStep = ref(1)
	const maxSteps = ref(3)

	// Navigation methods
	const goToStep = (step) => {
		if (step >= 1 && step <= maxSteps.value) {
			currentStep.value = step
		}
	}

	const nextStep = () => {
		if (currentStep.value < maxSteps.value) {
			currentStep.value++
		}
	}

	const prevStep = () => {
		if (currentStep.value > 1) {
			currentStep.value--
		}
	}

	const resetStep = () => {
		currentStep.value = 1
	}

	// Computed properties
	const isFirstStep = computed(() => currentStep.value === 1)
	const isLastStep = computed(() => currentStep.value === maxSteps.value)
	const stepProgress = computed(() => (currentStep.value / maxSteps.value) * 100)

	return {
		// State
		currentStep,
		maxSteps,

		// Computed
		isFirstStep,
		isLastStep,
		stepProgress,

		// Methods
		goToStep,
		nextStep,
		prevStep,
		resetStep,
	}
}
