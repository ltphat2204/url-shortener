<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/" class="logo-container">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <span class="logo-text">Url Shortener</span>
      </router-link>

      <nav class="nav-menu" v-if="user">
        <router-link to="/" class="nav-link">Trang chủ</router-link>
        <router-link to="/url-manager" class="nav-link">Quản lý URL</router-link>
      </nav>

      <div class="header-actions">
        <template v-if="user">
          <div class="user-profile">
            <div class="user-avatar">{{ getUserInitials() }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.name || user.username || user.email }}</span>
              <span class="user-role">Thành viên</span>
            </div>
            <div class="user-dropdown">
              <button @click="toggleDropdown" class="dropdown-toggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div v-if="showDropdown" class="dropdown-menu">
                <a href="#" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Hồ sơ cá nhân
                </a>
                <a href="#" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Cài đặt
                </a>
                <div class="dropdown-divider"></div>
                <button @click="handleLogout" class="dropdown-item logout-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <button @click="goToSignIn" class="btn-auth btn-login">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="10,17 15,12 10,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Đăng nhập
          </button>
          <button @click="goToSignUp" class="btn-auth btn-signup">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Đăng ký
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const showDropdown = ref(false)

// Reactive user state
onMounted(() => {
  updateUserState()
  window.addEventListener('storage', updateUserState)
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('storage', updateUserState)
  document.removeEventListener('click', closeDropdown)
})

function updateUserState() {
  const userData = localStorage.getItem('user')
  user.value = userData ? JSON.parse(userData) : null
}

function goToSignIn() {
  router.push('/signIn')
}

function goToSignUp() {
  router.push('/signUp')
}

function getUserInitials() {
  if (!user.value) return 'U'
  const name = user.value.name || user.value.username || user.value.email
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function closeDropdown(event) {
  if (!event.target.closest('.user-dropdown')) {
    showDropdown.value = false
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
  showDropdown.value = false
  router.push('/signIn')
}
</script>

<style scoped>
.app-header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  min-height: 70px;
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo-icon {
  color: #3b82f6;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  display: block;
}

.logo-text {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-link {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(59, 130, 246, 0.1);
}

.nav-link.router-link-active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.15);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #3b82f6;
  border-radius: 50%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 400;
}

.user-dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-toggle:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  padding: 8px;
  min-width: 180px;
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #e2e8f0;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #ffffff;
}

.logout-item {
  color: #ef4444;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

.btn-auth {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-auth::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-auth:hover::before {
  left: 100%;
}

.btn-login {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

.btn-signup {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: #ffffff;
  border: 1px solid transparent;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-signup:hover {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

@media (max-width: 1024px) {
  .nav-menu {
    display: none;
  }

  .header-content {
    padding: 0 24px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .btn-auth {
    padding: 10px 16px;
    font-size: 13px;
  }

  .logo-text {
    font-size: 20px;
  }

  .user-name {
    max-width: 80px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
  }

  .btn-auth span {
    display: none;
  }

  .btn-auth {
    padding: 10px;
    min-width: 44px;
    justify-content: center;
  }

  .user-info {
    display: none;
  }

  .logo-text {
    display: none;
  }
}
</style>
