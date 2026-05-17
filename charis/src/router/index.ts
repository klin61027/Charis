import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import LoginView from '../views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginView,
      meta: { layout: 'auth' },
    },
    {
      path: '/signup',
      component: LoginView,
      meta: { layout: 'auth' },
    },
    {
      path: '/',
      component: () => import('../components/layout/AppShell.vue'),
      meta: { requiresAuth: true, role: 'user' },
      children: [
        {
          path: '',
          component: {
            template: '<div style="padding:2rem;font-family:sans-serif;">Home — coming soon</div>',
          },
        },
      ],
    },
    {
      path: '/org',
      component: () => import('../components/layout/AppShell.vue'),
      meta: { requiresAuth: true, role: 'org' },
      children: [
        {
          path: 'dashboard',
          component: {
            template: '<div style="padding:2rem;font-family:sans-serif;">Org dashboard — coming soon</div>',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.role === 'user' && auth.isOrg) return '/org/dashboard'
  if (to.meta.role === 'org' && auth.isUser) return '/'
})

export default router