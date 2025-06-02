<template>
  <header class="app-header">
    <div class="header-content">
      <span class="logo">URL Shortener</span>
      <div class="header-actions">
        <template v-if="user">
          <span class="user-greeting">Xin chào, {{ user.name || user.username || user.email }}</span>
          <SignOut />
        </template>
        <template v-else>
          <button @click="goToSignIn" class="btn-auth">Đăng nhập</button>
          <button @click="goToSignUp" class="btn-auth btn-signup">Đăng ký</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import SignOut from './SignOut.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

function goToSignIn() {
  router.push('/signIn')
}
function goToSignUp() {
  router.push('/signUp')
}
</script>

<style scoped>
.app-header {
  width: 100vw;
  min-width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: #181818;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.header-content {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  min-height: 70px;
  box-sizing: border-box;
}
.logo {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-greeting {
  font-weight: 500;
  font-size: 16px;
  color: white;
}
.btn-auth {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  min-width: 120px;
  text-align: center;
}
.btn-auth:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b47b6 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}
.btn-auth:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}
.btn-signup {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}
.btn-signup:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  .btn-auth {
    padding: 10px 20px;
    font-size: 14px;
    min-width: 100px;
  }
  .logo {
    font-size: 1.1rem;
  }
}
@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 0 8px;
  }
  .header-actions {
    justify-content: flex-end;
    gap: 8px;
  }
  .btn-auth {
    width: 100%;
    min-width: auto;
  }
  .logo {
    text-align: center;
    margin-bottom: 8px;
  }
}
</style>
