import { ref, computed, onUnmounted } from 'vue'

export function useOTPVerification() {
	const otpDigits = ref(['', '', '', '', '', ''])
	const otpRefs = ref([])
	const resendCountdown = ref(60)
	const canResendOTP = ref(false)
	const resendLoading = ref(false)
	const otpTimer = ref(null)
	const generatedOTP = ref('')

	// Computed
	const isOTPComplete = computed(() => {
		return otpDigits.value.every((digit) => digit !== '')
	})

	const otpCode = computed(() => {
		return otpDigits.value.join('')
	})

	// Methods
	const handleOTPInput = (event, index) => {
		const value = event.target.value.replace(/[^0-9]/g, '')
		otpDigits.value[index] = value

		// Auto-focus next input
		if (value && index < 5) {
			setTimeout(() => {
				otpRefs.value[index + 1]?.focus()
			}, 0)
		}
	}

	const handleOTPKeydown = (event, index) => {
		if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
			setTimeout(() => {
				otpRefs.value[index - 1]?.focus()
			}, 0)
		}
	}

	const resetOTP = () => {
		otpDigits.value = ['', '', '', '', '', '']
		generatedOTP.value = ''
	}

	const setGeneratedOTP = (otp) => {
		generatedOTP.value = otp
	}

	const verifyOTP = () => {
		return otpCode.value === generatedOTP.value
	}

	// Timer methods
	const startOTPCountdown = () => {
		resendCountdown.value = 60
		canResendOTP.value = false

		otpTimer.value = setInterval(() => {
			resendCountdown.value--
			if (resendCountdown.value <= 0) {
				canResendOTP.value = true
				stopOTPCountdown()
			}
		}, 1000)
	}

	const stopOTPCountdown = () => {
		if (otpTimer.value) {
			clearInterval(otpTimer.value)
			otpTimer.value = null
		}
	}

	// Cleanup on unmount
	onUnmounted(() => {
		stopOTPCountdown()
	})

	return {
		// State
		otpDigits,
		otpRefs,
		resendCountdown,
		canResendOTP,
		resendLoading,
		generatedOTP,

		// Computed
		isOTPComplete,
		otpCode,

		// Methods
		handleOTPInput,
		handleOTPKeydown,
		resetOTP,
		setGeneratedOTP,
		verifyOTP,
		startOTPCountdown,
		stopOTPCountdown,
	}
}
