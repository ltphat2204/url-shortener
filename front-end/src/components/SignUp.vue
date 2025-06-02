<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Đăng ký</h2>
        <p>Tạo tài khoản mới để bắt đầu!</p>
      </div>

      <!-- Step 1: Registration Form -->
      <div v-if="currentStep === 1">
        <form @submit.prevent="handleSignUp" class="auth-form">
          <div class="form-group">
            <label for="fullName">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              v-model="form.fullName"
              :class="{ 'error': errors.fullName }"
              placeholder="Nhập họ và tên"
              required
            />
            <span v-if="errors.fullName" class="error-message">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              :class="{ 'error': errors.email }"
              placeholder="Nhập email của bạn"
              required
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <div class="password-input">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                :class="{ 'error': errors.password }"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Xác nhận mật khẩu</label>
            <div class="password-input">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="form.confirmPassword"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="Nhập lại mật khẩu"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="form.agreeTerms"
                :class="{ 'error': errors.agreeTerms }"
              />
              <span class="checkmark"></span>
              Tôi đồng ý với <a href="#" @click.prevent>Điều khoản sử dụng</a> và
              <a href="#" @click.prevent>Chính sách bảo mật</a>
            </label>
            <span v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</span>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary"
            >
              {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
            </button>
          </div>
        </form>

        <div class="divider">
          <span>hoặc</span>
        </div>

        <button @click="signUpWithGoogle" class="btn-google">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng ký với Google
        </button>
      </div>

      <!-- Step 2: OTP Verification -->
      <div v-else-if="currentStep === 2" class="otp-verification">
        <div class="otp-header">
          <div class="otp-icon">📧</div>
          <h3>Xác thực email</h3>
          <p>Chúng tôi đã gửi mã OTP đến email <strong>{{ form.email }}</strong></p>
        </div>

        <form @submit.prevent="verifyOTP" class="otp-form">
          <div class="otp-inputs">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpRefs[index] = el"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="1"
              v-model="otpDigits[index]"
              @input="handleOTPInput($event, index)"
              @keydown="handleOTPKeydown($event, index)"
              class="otp-input"
              autocomplete="one-time-code"
            />
          </div>
          <span v-if="errors.otp" class="error-message">{{ errors.otp }}</span>
          <div class="otp-actions">
            <button
              type="submit"
              :disabled="loading || !isOTPComplete"
              class="btn-primary"
              style="display:none;"
            >
              Xác thực
            </button>
          </div>
        </form>

        <div class="otp-footer">
          <p v-if="!canResendOTP">
            Gửi lại mã sau {{ resendCountdown }}s
          </p>
          <button
            v-else
            @click="resendOTP"
            :disabled="resendLoading"
            class="btn-link"
          >
            {{ resendLoading ? 'Đang gửi...' : 'Gửi lại mã OTP' }}
          </button>
          <button @click="goBackToForm" class="btn-link">Quay lại</button>
        </div>
      </div>

      <!-- Step 3: Success -->
      <div v-else-if="currentStep === 3" class="success-message">
        <div class="success-icon">✅</div>
        <h3>Đăng ký thành công!</h3>
        <p>Tài khoản của bạn đã được tạo thành công. Bạn có thể bắt đầu sử dụng dịch vụ ngay bây giờ.</p>
        <button @click="goToSignIn" class="btn-primary">Đăng nhập ngay</button>
      </div>

      <div v-if="currentStep === 1" class="auth-footer">
        <p>Đã có tài khoản? <router-link to="/signIn">Đăng nhập ngay</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mockUsers, addMockUser } from '../stores/mockUsers.js';
import emailjs from 'emailjs-com';

export default {
  name: 'SignUp',
  data() {
    return {
      currentStep: 1, // 1: Form, 2: OTP, 3: Success
      form: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      },
      errors: {},
      loading: false,
      showPassword: false,
      showConfirmPassword: false,

      // OTP related
      otpDigits: ['', '', '', '', '', ''],
      otpRefs: [],
      resendCountdown: 60,
      canResendOTP: false,
      resendLoading: false,
      otpTimer: null,

      // Thêm biến để lưu mã OTP đã sinh
      generatedOTP: ''
    }
  },
  computed: {
    isOTPComplete() {
      return this.otpDigits.every(digit => digit !== '');
    },
    otpCode() {
      return this.otpDigits.join('');
    }
  },
  methods: {
    async handleSignUp() {
      this.errors = {};
      this.loading = true;
      try {
        // Validate form
        if (!this.validateForm()) {
          this.loading = false;
          return;
        }
        // Kiểm tra email đã tồn tại chưa
        const existed = mockUsers.find(u => u.email === this.form.email);
        if (existed) {
          this.errors.email = 'Email đã tồn tại';
          this.loading = false;
          return;
        }
        // Sinh mã OTP ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.generatedOTP = otp;
        // Gửi mail thật bằng EmailJS
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            email: this.form.email, // đúng tên biến template
            otp: otp,               // đúng tên biến template
            to_name: this.form.fullName || this.form.email
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        this.$toast && this.$toast.info ? this.$toast.info('Đã gửi mã xác thực OTP về email!') : alert('Đã gửi mã xác thực OTP về email!');
        this.currentStep = 2;
        this.startOTPCountdown();
      } catch {
        this.errors.general = 'Có lỗi xảy ra, vui lòng thử lại';
      } finally {
        this.loading = false;
      }
    },

    async verifyOTP() {
      this.errors = {};
      this.loading = true;
      try {
        // So sánh mã OTP nhập vào với mã đã gửi
        if (this.otpCode === this.generatedOTP) {
          // Thêm user vào localStorage và mockUsers qua addMockUser
          addMockUser({
            username: this.form.email.split('@')[0],
            email: this.form.email,
            password: this.form.password,
            name: this.form.fullName
          });
          this.currentStep = 3;
          this.stopOTPCountdown();
          this.$toast && this.$toast.success ? this.$toast.success('Xác thực thành công!') : alert('Xác thực thành công!');
        } else {
          this.errors.otp = 'Mã OTP không hợp lệ';
        }
      } catch {
        this.errors.otp = 'Có lỗi xảy ra, vui lòng thử lại';
      } finally {
        this.loading = false;
      }
    },

    async resendOTP() {
      this.resendLoading = true;

      try {
        const response = await this.$api.auth.resendOTP({
          email: this.form.email
        });

        if (response.success) {
          this.$toast.success('Mã OTP mới đã được gửi!');
          this.otpDigits = ['', '', '', '', '', ''];
          this.startOTPCountdown();
        } else {
          this.$toast.error('Không thể gửi lại mã OTP');
        }
      } catch {
        this.$toast.error('Có lỗi xảy ra khi gửi lại mã OTP');
      } finally {
        this.resendLoading = false;
      }
    },

    async signUpWithGoogle() {
      try {
        console.log('Google Sign-Up clicked');
        this.$toast.info('Tính năng đăng ký Google sẽ được triển khai sau');
      } catch (error) {
        console.error('Google sign up error:', error);
        this.$toast.error('Đăng ký Google thất bại');
      }
    },

    validateForm() {
      let isValid = true;

      // Full name validation
      if (!this.form.fullName.trim()) {
        this.errors.fullName = 'Họ và tên là bắt buộc';
        isValid = false;
      } else if (this.form.fullName.trim().length < 2) {
        this.errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
        isValid = false;
      }

      // Email validation
      if (!this.form.email) {
        this.errors.email = 'Email là bắt buộc';
        isValid = false;
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Email không hợp lệ';
        isValid = false;
      }

      // Password validation
      if (!this.form.password) {
        this.errors.password = 'Mật khẩu là bắt buộc';
        isValid = false;
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        isValid = false;
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.form.password)) {
        this.errors.password = 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
        isValid = false;
      }

      // Confirm password validation
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        isValid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        isValid = false;
      }

      // Terms agreement validation
      if (!this.form.agreeTerms) {
        this.errors.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
        isValid = false;
      }

      return isValid;
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    handleOTPInput(event, index) {
      const value = event.target.value.replace(/[^0-9]/g, '');
      this.otpDigits[index] = value;
      if (value && index < 5) {
        this.$nextTick(() => {
          this.otpRefs[index + 1]?.focus();
        });
      }
      // Nếu nhập đủ 6 số thì tự xác thực
      if (this.otpDigits.every(d => d.length === 1)) {
        this.verifyOTP();
      }
    },
    handleOTPKeydown(event, index) {
      if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
        this.$nextTick(() => {
          this.otpRefs[index - 1]?.focus();
        });
      }
    },

    startOTPCountdown() {
      this.resendCountdown = 60;
      this.canResendOTP = false;

      this.otpTimer = setInterval(() => {
        this.resendCountdown--;
        if (this.resendCountdown <= 0) {
          this.canResendOTP = true;
          this.stopOTPCountdown();
        }
      }, 1000);
    },

    stopOTPCountdown() {
      if (this.otpTimer) {
        clearInterval(this.otpTimer);
        this.otpTimer = null;
      }
    },

    goBackToForm() {
      this.currentStep = 1;
      this.stopOTPCountdown();
    },

    goToSignIn() {
      this.$router.push('/signIn');
    }
  },

  beforeUnmount() {
    this.stopOTPCountdown();
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.auth-header p {
  color: #666;
  font-size: 16px;
}

.auth-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error {
  border-color: #e74c3c;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.checkbox-group {
  margin-top: 20px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.checkmark {
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
  border: 2px solid #e1e5e9;
  transition: all 0.3s ease;
}

.checkbox-label input:checked ~ .checkmark {
  background-color: #667eea;
  border-color: #667eea;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: none;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 4px;
  display: block;
}

.form-actions {
  margin-top: 30px;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 30px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
}

.divider span {
  background: white;
  padding: 0 20px;
  color: #666;
  font-size: 14px;
}

.btn-google {
  width: 100%;
  background: white;
  border: 2px solid #e1e5e9;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: border-color 0.3s ease;
  margin-bottom: 30px;
}

.btn-google:hover {
  border-color: #ccc;
}

/* OTP Verification Styles */
.otp-verification {
  text-align: center;
}

.otp-header {
  margin-bottom: 30px;
}

.otp-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.otp-header h3 {
  color: #333;
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: 600;
}

.otp-header p {
  color: #666;
  line-height: 1.5;
}

.otp-form {
  margin-bottom: 30px;
}

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.otp-input {
  width: 50px;
  height: 50px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  transition: border-color 0.3s ease;
}

.otp-input:focus {
  outline: none;
  border-color: #667eea;
}

.otp-actions {
  margin-top: 20px;
}

.otp-footer {
  text-align: center;
}

.otp-footer p {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  margin: 0 8px;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Success Message Styles */
.success-message {
  text-align: center;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.success-message h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 600;
}

.success-message p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: #666;
  margin-bottom: 12px;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }

  .auth-header h2 {
    font-size: 24px;
  }

  .otp-inputs {
    gap: 8px;
  }

  .otp-input {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
