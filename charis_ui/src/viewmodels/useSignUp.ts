import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import type { AuthProvider } from '../models/types/user.types'

async function mockSignUp(name: string, email: string, username: string) {
  await new Promise(r => setTimeout(r, 700))
  return {
    role: 'user' as const,
    provider: 'google' as AuthProvider,
    token: 'mock-user-token',
    user: {
      id: 'u1',
      name,
      username,
      email,
      avatar: null,
      bio: '',
    },
  }
}

export function useSignUp() {
  const router    = useRouter()
  const authStore = useAuthStore()

  const fullName        = ref('')
  const email           = ref('')
  const username        = ref('')
  const password        = ref('')
  const confirmPassword = ref('')
  const showPassword    = ref(false)
  const showConfirm     = ref(false)
  const isLoading       = ref(false)
  const error           = ref<string | null>(null)

  async function submitSignUp() {
    error.value = null

    if (!fullName.value || !email.value || !username.value || !password.value) {
      error.value = 'Please fill in all fields.'
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
      error.value = 'Username may only contain letters, numbers and underscores.'
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
      const session = await mockSignUp(fullName.value, email.value, username.value)
      authStore.setSession(session)
      router.push('/')
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
      const session = await mockSignUp('', '', '')
      authStore.setSession(session)
      router.push('/')
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    fullName, email, username,
    password, confirmPassword,
    showPassword, showConfirm,
    isLoading, error,
    submitSignUp, signUpWithProvider,
  }
}
