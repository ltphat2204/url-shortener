import { ref, computed, onUnmounted } from 'vue'

export function useOTPVerification() {
	const otpDigits = ref(['', '', '', '', '', ''])
	const otpRefs = ref([])
	const resendCountdown = ref(60)
	const canResendOTP = ref(false)
	const resendLoading = ref(false)
	const otpTimer = ref(null)
	const generatedOTP = ref('')

	// Alternative simple OTP string
	const otpString = ref('')
	// Computed
	const isOTPComplete = computed(() => {
		return otpDigits.value.every((digit) => digit !== '')
	})

	const otpCode = computed(() => {
		return [...otpDigits.value].join('')
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
		otpString.value = ''
	}

	const setGeneratedOTP = (otp) => {
		generatedOTP.value = otp
	}

	const verifyOTP = () => {
		// Force update otpString from current otpDigits
		const currentOTP = otpDigits.value.join('')
		otpString.value = currentOTP

		return otpString.value === generatedOTP.value
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

	// Add callback for when OTP changes
	const onOTPChange = ref(null)

	const setOTPChangeCallback = (callback) => {
		onOTPChange.value = callback
	}

	// Enhanced handleOTPInput with callback
	const handleOTPInputWithCallback = (event, index) => {
		let value = event.target.value.replace(/[^0-9]/g, '')
		console.log(`Input at index ${index}:`, value)

		// Handle multiple digits (paste case)
		if (value.length > 1) {
			// Split the value and fill multiple inputs
			const digits = value.split('').slice(0, 6) // Max 6 digits
			digits.forEach((digit, i) => {
				if (index + i < 6) {
					otpDigits.value[index + i] = digit
				}
			})

			// Focus the next empty input or the last filled input
			const nextIndex = Math.min(index + digits.length, 5)
			setTimeout(() => {
				otpRefs.value[nextIndex]?.focus()
			}, 0)
		} else {
			// Single digit
			otpDigits.value[index] = value

			// Update simple string version
			otpString.value = otpDigits.value.join('')

			// Auto-focus next input
			if (value && index < 5) {
				setTimeout(() => {
					otpRefs.value[index + 1]?.focus()
				}, 0)
			}
		}

		// Call the callback to clear errors
		if (onOTPChange.value) {
			onOTPChange.value()
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
		setOTPChangeCallback,
		handleOTPInputWithCallback,
	}
}
