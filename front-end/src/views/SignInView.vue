<template>
  <main class="signin-main">
    <SignIn />
  </main>
</template>

<script>
import SignIn from '../components/SignIn.vue';
export default {
  name: 'SignInView',
  components: { SignIn }
}
</script>

<style scoped>
.signin-main {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>
