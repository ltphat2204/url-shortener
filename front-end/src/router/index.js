import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/signIn',
			name: 'signIn',
			component: () => import('../views/SignInView.vue'),
		},
		{
			path: '/signUp',
			name: 'signUp',
			component: () => import('../views/SignUpView.vue'),
		},
		{
			path: '/url-manager',
			name: 'UrlManager',
			component: () => import('../views/UrlManagerView.vue'),
			meta: { requiresAuth: true },
		},
	],
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token')
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

	if (requiresAuth && !token) {
		next('/signIn')
	} else if ((to.path === '/signIn' || to.path === '/signUp') && token) {
		next('/')
	} else {
		next()
	}
})

export default router
