import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import type { UserRole, AuthProvider } from '../models/types/user.types'

async function mockLogin(provider: AuthProvider | 'email', role: UserRole) {
  await new Promise(r => setTimeout(r, 700))

  if (role === 'user') {
    return {
      role,
      provider: (provider === 'email' ? 'google' : provider) as AuthProvider,
      token: 'mock-user-token',
      user: {
        id: 'u1',
        name: 'Kevin Lin',
        username: 'kevinlin',
        email: 'kevin@example.com',
        avatar: null,
        bio: 'Applied Math + Data Science. Building for good.',
      },
    }
  }

  return {
    role,
    provider: (provider === 'email' ? 'google' : provider) as AuthProvider,
    token: 'mock-org-token',
    org: {
      id: 'o1',
      name: 'Seattle Green Collective',
      logo: null,
      description: 'Community environmental action in Seattle.',
      followersCount: 1200,
      eventsCount: 8,
    },
  }
}

export function useAuth() {
  const router    = useRouter()
  const authStore = useAuthStore()

  const role         = ref<UserRole>('user')
  const email        = ref('')
  const password     = ref('')
  const showPassword = ref(false)
  const isLoading    = ref(false)
  const error        = ref<string | null>(null)

  const isOrgRole = computed(() => role.value === 'org')

  function setRole(r: UserRole) {
    role.value  = r
    error.value = null
  }

  async function submitEmail() {
    if (!email.value || !password.value) {
      error.value = 'Please fill in all fields.'
      return
    }
    isLoading.value = true
    error.value     = null
    try {
      const session = await mockLogin('email', role.value)
      authStore.setSession(session)
      router.push(role.value === 'org' ? '/org/dashboard' : '/')
    } catch {
      error.value = 'Invalid email or password.'
    } finally {
      isLoading.value = false
    }
  }

  async function loginWithProvider(provider: AuthProvider) {
    isLoading.value = true
    error.value     = null
    try {
      const session = await mockLogin(provider, role.value)
      authStore.setSession(session)
      router.push(role.value === 'org' ? '/org/dashboard' : '/')
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    role, email, password, showPassword,
    isLoading, error, isOrgRole,
    setRole, submitEmail, loginWithProvider,
  }
}