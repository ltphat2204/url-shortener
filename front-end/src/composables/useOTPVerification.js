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

	// Handle paste event for OTP
	const handleOTPPaste = (event, index) => {
		event.preventDefault()
		const pastedData = event.clipboardData.getData('text').replace(/[^0-9]/g, '')

		if (pastedData && pastedData.length > 0) {
			if (pastedData.length === 6 && index === 0) {
				otpDigits.value = ['', '', '', '', '', '']
				const digits = pastedData.split('')
				digits.forEach((digit, i) => {
					if (i < 6) {
						otpDigits.value[i] = digit
					}
				})

				setTimeout(() => {
					otpRefs.value[5]?.focus()
				}, 0)
			} else {
				const digits = pastedData.split('').slice(0, 6 - index)

				if (otpDigits.value[index] !== '') {
					otpDigits.value[index] = ''
				}

				digits.forEach((digit, i) => {
					if (index + i < 6) {
						otpDigits.value[index + i] = digit
					}
				})

				const nextIndex = Math.min(index + digits.length, 5)
				setTimeout(() => {
					otpRefs.value[nextIndex]?.focus()
				}, 0)
			}

			otpString.value = otpDigits.value.join('')

			if (onOTPChange.value) {
				onOTPChange.value()
			}
		}
	}

	// Enhanced handleOTPInput with callback
	const handleOTPInputWithCallback = (event, index) => {
		let value = event.target.value.replace(/[^0-9]/g, '')

		if (value.length > 1) {
			const digits = value.split('').slice(0, 6 - index)
			digits.forEach((digit, i) => {
				if (index + i < 6) {
					otpDigits.value[index + i] = digit
				}
			})

			const nextIndex = Math.min(index + digits.length, 5)
			setTimeout(() => {
				otpRefs.value[nextIndex]?.focus()
			}, 0)
		} else {
			otpDigits.value[index] = value

			if (value && index < 5) {
				setTimeout(() => {
					otpRefs.value[index + 1]?.focus()
				}, 0)
			}
		}

		otpString.value = otpDigits.value.join('')

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
		handleOTPPaste,
		resetOTP,
		setGeneratedOTP,
		verifyOTP,
		startOTPCountdown,
		stopOTPCountdown,
		setOTPChangeCallback,
		handleOTPInputWithCallback,
	}
}
