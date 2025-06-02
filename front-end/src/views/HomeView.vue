<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <main>
    <AppHeader />
    <TheWelcome />
  </main>
</template>

<style scoped>
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
