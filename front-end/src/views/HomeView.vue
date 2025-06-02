<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="home-main">
    <!-- Thêm nội dung chính của trang Home ở đây -->
    <h1 class="home-title">Chào mừng đến với URL Shortener!</h1>
    <p class="home-desc">Rút gọn liên kết, quản lý và chia sẻ dễ dàng.</p>
  </main>
</template>

<style scoped>
.home-main {
  width: 100%;
  max-width: 900px;
  margin: 40px auto 0 auto;
  padding: 32px 24px;
  background: #181818;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.home-title {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 18px;
}
.home-desc {
  color: #bdbdbd;
  font-size: 1.2rem;
  margin-bottom: 0;
}
</style>
