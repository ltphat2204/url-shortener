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

      <GoogleAuthButton @success="onGoogleSignIn" />

      <div class="auth-footer">
        <p>Chưa có tài khoản? <a href="/signIn" @click.prevent="goToSignUp">Đăng ký ngay</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mockUsers } from '../stores/mockUsers.js';
import GoogleAuthButton from './GoogleAuthButton.vue';

export default {
  name: 'SignIn',
  components: {
    GoogleAuthButton
  },
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

    onGoogleSignIn(credential) {
      // Decode JWT để lấy thông tin user (hỗ trợ Unicode)
      let payload = {};
      try {
        const base64 = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        payload = JSON.parse(jsonPayload);
      } catch { /* ignore decode error */ }
      // Lưu user vào localStorage/mockUsers nếu chưa có
      const existed = mockUsers.find(u => u.email === payload.email);
      if (!existed) {
        mockUsers.push({
          username: payload.email?.split('@')[0] || '',
          email: payload.email,
          password: '',
          name: payload.name || payload.email
        });
      }
      // Lưu user vào localStorage
      localStorage.setItem('user', JSON.stringify(payload));
      localStorage.setItem('token', credential);
      // Chuyển thẳng vào homepage
      this.$router.push('/');
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
  color: black;
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
  color: #667eea;
  border: 2px solid #667eea;
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
  border-color: #91a2eb;
  color: #91a2eb;
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

/* Removed hover effect for auth-footer link */

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }

  .auth-header h2 {
    font-size: 24px;
  }
}
</style>
