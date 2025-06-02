<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Đăng nhập</h2>
        <p>Chào mừng bạn quay trở lại!</p>
      </div>

      <form @submit.prevent="handleSignIn" class="auth-form">
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

        <div class="form-actions">
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary"
          >
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </div>
      </form>

      <div class="divider">
        <span>hoặc</span>
      </div>

      <button @click="signInWithGoogle" class="btn-google">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Đăng nhập với Google
      </button>

      <div class="auth-footer">
        <p>Chưa có tài khoản? <a href="#" @click.prevent="goToSignUp">Đăng ký ngay</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mockUsers } from '../stores/mockUsers.js';

export default {
  name: 'SignIn',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      loading: false,
      showPassword: false
    }
  },
  methods: {
    async handleSignIn() {
      this.errors = {};
      this.loading = true;

      try {
        // Validate form
        if (!this.validateForm()) {
          this.loading = false;
          return;
        }

        // Mock login: kiểm tra với mockUsers
        const user = mockUsers.find(
          u => (u.email === this.form.email || u.username === this.form.email)
        );
        if (!user) {
          this.errors.email = 'Email không tồn tại';
          this.loading = false;
          return;
        }
        if (user.password !== this.form.password) {
          this.errors.password = 'Mật khẩu không đúng';
          this.loading = false;
          return;
        }
        // Đúng tài khoản
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(user));
        this.$router.push('/');
        this.$toast && this.$toast.success ? this.$toast.success('Đăng nhập thành công!') : alert('Đăng nhập thành công!');
      } catch (error) {
        console.error('Sign in error:', error);
        this.errors.general = 'Có lỗi xảy ra, vui lòng thử lại';
      } finally {
        this.loading = false;
      }
    },

    async signInWithGoogle() {
      try {
        // Initialize Google Sign-In
        // This would be implemented with Google OAuth library
        console.log('Google Sign-In clicked');
        this.$toast.info('Tính năng đăng nhập Google sẽ được triển khai sau');
      } catch (error) {
        console.error('Google sign in error:', error);
        this.$toast.error('Đăng nhập Google thất bại');
      }
    },

    validateForm() {
      let isValid = true;

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
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        isValid = false;
      }

      return isValid;
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    goToSignUp() {
      this.$router.push('/signUp');
    }
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
  background: #fff6f6;
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

.forgot-link {
  color: #666;
  font-size: 14px;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }

  .auth-header h2 {
    font-size: 24px;
  }
}
</style>
