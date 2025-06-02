<template>
  <header class="app-header">
    <div class="header-actions-wrapper">
      <div class="header-actions">
        <template v-if="user">
          <span class="user-greeting">Xin chào, {{ displayName }}</span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
user.value = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

const displayName = computed(() => {
  if (!user.value) return ''
  if (user.value.name) return user.value.name
  if (user.value.given_name && user.value.family_name)
    return user.value.given_name + ' ' + user.value.family_name
  if (user.value.given_name) return user.value.given_name
  if (user.value.username) return user.value.username
  return user.value.email || ''
})

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
  padding: 20px 32px;
  box-sizing: border-box;
  min-height: 80px;
}

.header-actions-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-greeting {
  font-family: 'Noto Sans', 'Tahoma', 'Arial', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: white;
  padding: 0;
  background: none;
  border-radius: 0;
  backdrop-filter: none;
  border: none;
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

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    padding: 16px 20px;
    min-height: 70px;
  }

  .header-actions {
    gap: 12px;
  }

  .btn-auth {
    padding: 10px 20px;
    font-size: 14px;
    min-width: 100px;
  }

  .user-greeting {
    font-size: 14px;
    padding: 10px 12px;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .btn-auth {
    width: 100%;
    min-width: auto;
  }

  .user-greeting {
    text-align: center;
    margin-bottom: 8px;
  }
}
</style>
