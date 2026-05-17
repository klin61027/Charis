import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import type { AuthProvider } from '../models/types/user.types'

async function mockOrgSignUp(orgName: string, contactEmail: string) {
  await new Promise(r => setTimeout(r, 700))
  return {
    role: 'org' as const,
    provider: 'google' as AuthProvider,
    token: 'mock-org-token',
    org: {
      id: 'o1',
      name: orgName,
      logo: null,
      description: '',
      followersCount: 0,
      eventsCount: 0,
    },
  }
}

export function useOrgSignUp() {
  const router    = useRouter()
  const authStore = useAuthStore()

  const orgName         = ref('')
  const contactEmail    = ref('')
  const website         = ref('')
  const description     = ref('')
  const password        = ref('')
  const confirmPassword = ref('')
  const showPassword    = ref(false)
  const showConfirm     = ref(false)
  const isLoading       = ref(false)
  const error           = ref<string | null>(null)

  async function submitOrgSignUp() {
    error.value = null

    if (!orgName.value || !contactEmail.value || !password.value) {
      error.value = 'Please fill in all required fields.'
      return
    }
    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters.'
      return
    }
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.'
      return
    }

    isLoading.value = true
    try {
      const session = await mockOrgSignUp(orgName.value, contactEmail.value)
      authStore.setSession(session)
      router.push('/org/dashboard')
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  async function signUpWithProvider(provider: AuthProvider) {
    isLoading.value = true
    error.value     = null
    try {
      const session = await mockOrgSignUp('', '')
      authStore.setSession(session)
      router.push('/org/dashboard')
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    orgName, contactEmail, website, description,
    password, confirmPassword,
    showPassword, showConfirm,
    isLoading, error,
    submitOrgSignUp, signUpWithProvider,
  }
}
