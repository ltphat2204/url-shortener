<template>
	<main class="signup-main">
		<SignUp />
	</main>
</template>

<script>
import SignUp from '@/components/SignUp.vue'
export default {
	name: 'SignUpView',
	components: { SignUp },
}
</script>

<style scoped>
.signup-main {
	width: 100vw;
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
</style>
