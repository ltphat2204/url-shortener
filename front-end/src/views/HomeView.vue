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
	margin: 118px auto 0 auto;
	padding: 32px 24px;
	background: #181818;
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
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

@media (max-width: 768px) {
	.home-main {
		margin: 110px auto 0 auto; /* Slightly less top margin on mobile */
		padding: 24px 16px; /* Reduce padding on mobile */
		max-width: calc(100% - 32px); /* Ensure some margin on sides */
	}

	.home-title {
		font-size: 1.8rem; /* Smaller title on mobile */
	}

	.home-desc {
		font-size: 1rem; /* Smaller description on mobile */
	}
}

@media (max-width: 480px) {
	.home-main {
		margin: 106px auto 0 auto; /* Even less top margin on small screens */
		padding: 20px 12px;
		max-width: calc(100% - 24px);
	}

	.home-title {
		font-size: 1.6rem;
	}

	.home-desc {
		font-size: 0.9rem;
	}
}
</style>
