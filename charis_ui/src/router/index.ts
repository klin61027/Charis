import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import LoginView from '../views/auth/LoginView.vue'
import SignUpView from '../views/auth/SignUpView.vue'
import OrgSignUpView from '../views/auth/OrgSignUpView.vue'
import HomeView from '../views/home/HomeView.vue'
import WalletView from '../views/wallet/WalletView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    // ─── Auth (no shell) ────────────────────────────────────────────────────

    {
      path: '/login',
      component: LoginView,
      meta: { layout: 'auth' },
    },
    {
      path: '/signup',
      component: SignUpView,
      meta: { layout: 'auth' },
    },
    {
      path: '/signup/org',
      component: OrgSignUpView,
      meta: { layout: 'auth' },
    },

    // ─── Volunteer / user shell ──────────────────────────────────────────────

    {
      path: '/',
      component: () => import('../components/layout/AppShell.vue'),
      meta: { requiresAuth: true, role: 'user' },
      children: [
        { path: '',       component: HomeView   },
        { path: 'wallet', component: WalletView },
      ],
    },

    // ─── Org shell ───────────────────────────────────────────────────────────

    {
      path: '/org',
      component: () => import('../components/layout/OrgShell.vue'),
      meta: { requiresAuth: true, role: 'org' },
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/org/OrgDashboardView.vue'),
        },
        {
          path: 'events',
          component: () => import('../views/org/OrgEventsView.vue'),
        },
        {
          path: 'approvals',
          component: () => import('../views/org/OrgApprovalsView.vue'),
        },
        {
          path: 'checkin/:eventId',
          component: () => import('../views/org/OrgCheckinView.vue'),
        },
        // ─── Redirect /org → /org/dashboard ─────────────────────────────────
        {
          path: '',
          redirect: '/org/dashboard',
        },
      ],
    },

    // ─── Catch-all ───────────────────────────────────────────────────────────

    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.role === 'user' && auth.isOrg)  return '/org/dashboard'
  if (to.meta.role === 'org'  && auth.isUser) return '/'
})

export default router