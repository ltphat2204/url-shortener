<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/signIn');
}
</script>

<template>
  <button @click="handleLogout" class="signout-btn">
    <span class="icon">🚪</span> Đăng xuất
  </button>
</template>

<style scoped>
.signout-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.08);
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 24px;
  right: 32px;
  z-index: 10;
}
.signout-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b47b6 100%);
  color: #fff;
  transform: translateY(-2px);
}
.icon {
  font-size: 18px;
}
@media (max-width: 480px) {
  .signout-btn {
    top: 12px;
    right: 12px;
    padding: 10px 16px;
    font-size: 15px;
  }
}
</style>
