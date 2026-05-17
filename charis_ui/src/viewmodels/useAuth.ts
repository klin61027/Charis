import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import type { UserRole, AuthProvider } from '../models/types/user.types'

const DEMO_ORG_ID   = '72b6f4a3-2132-4e9f-9fed-ebc201dec508'
const DEMO_ORG_NAME = 'Seattle Volunteer Hub 45'

const DEMO_USER_ID    = 'a331beb7-891a-411d-8ba3-9f5c6cedaa19'
const DEMO_USER_NAME  = 'user_001'
const DEMO_USER_EMAIL = 'user_001@example.com'

async function mockLogin(provider: AuthProvider | 'email', role: UserRole) {
  await new Promise(r => setTimeout(r, 700))
  if (role === 'user') {
    return {
      role,
      provider: (provider === 'email' ? 'google' : provider) as AuthProvider,
      token: 'mock-user-token',
      user: {
        id:       DEMO_USER_ID,
        name:     DEMO_USER_NAME,
        username: 'user001',
        email:    DEMO_USER_EMAIL,
        avatar:   null,
        bio:      'Demo volunteer user.',
      },
    }
  }
  return {
    role,
    provider: (provider === 'email' ? 'google' : provider) as AuthProvider,
    token: 'mock-org-token',
    org: {
      id:             DEMO_ORG_ID,
      name:           DEMO_ORG_NAME,
      logo:           null,
      description:    'Community volunteer events in Seattle.',
      followersCount: 0,
      eventsCount:    4,
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

  async function demoOrgLogin() {
    isLoading.value = true
    error.value     = null
    try {
      authStore.setSession({
        role:     'org',
        provider: 'google',
        token:    'demo-org-token',
        org: {
          id:             DEMO_ORG_ID,
          name:           DEMO_ORG_NAME,
          logo:           null,
          description:    'Community volunteer events in Seattle.',
          followersCount: 0,
          eventsCount:    4,
        },
      })
      router.push('/org/dashboard')
    } catch {
      error.value = 'Demo login failed.'
    } finally {
      isLoading.value = false
    }
  }

  async function demoUserLogin() {
    isLoading.value = true
    error.value     = null
    try {
      authStore.setSession({
        role:     'user',
        provider: 'google',
        token:    'demo-user-token',
        user: {
          id:       DEMO_USER_ID,
          name:     DEMO_USER_NAME,
          username: 'user001',
          email:    DEMO_USER_EMAIL,
          avatar:   null,
          bio:      'Demo volunteer user.',
        },
      })
      router.push('/')
    } catch {
      error.value = 'Demo login failed.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    role, email, password, showPassword,
    isLoading, error, isOrgRole,
    setRole, submitEmail, loginWithProvider,
    demoOrgLogin, demoUserLogin,
  }
}