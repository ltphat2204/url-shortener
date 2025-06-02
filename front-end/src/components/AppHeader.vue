<template>
  <header class="app-header">
    <div class="header-actions">
      <template v-if="user">
        <span class="user-greeting">Xin chào, {{ user.name || user.username || user.email }}</span>
        <SignOut />
      </template>
      <template v-else>
        <button @click="goToSignIn" class="btn-auth">Đăng nhập</button>
        <button @click="goToSignUp" class="btn-auth">Đăng ký</button>
      </template>
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
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 24px 32px 0 32px;
  box-sizing: border-box;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-greeting {
  font-weight: 500;
  margin-right: 8px;
}
.btn-auth {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  margin-left: 4px;
}
.btn-auth:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b47b6 100%);
  transform: translateY(-2px);
}
</style>
