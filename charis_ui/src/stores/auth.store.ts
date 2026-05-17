import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Organization, UserRole, AuthProvider } from '../models/types/user.types'

export const useAuthStore = defineStore('auth', () => {
  const token          = ref<string | null>(null)
  const role           = ref<UserRole | null>(null)
  const user           = ref<User | null>(null)
  const org            = ref<Organization | null>(null)
  const authProvider   = ref<AuthProvider | null>(null)
  const walletUnlocked = ref<boolean>(false)

  const isAuthenticated = computed(() => !!token.value)
  const isUser = computed(() => role.value === 'user')
  const isOrg  = computed(() => role.value === 'org')

  function setSession(data: {
    token: string
    role: UserRole
    provider: AuthProvider
    user?: User
    org?: Organization
  }) {
    token.value        = data.token
    role.value         = data.role
    authProvider.value = data.provider
    user.value         = data.user ?? null
    org.value          = data.org  ?? null
    walletUnlocked.value = false
  }

  function clearSession() {
    token.value          = null
    role.value           = null
    user.value           = null
    org.value            = null
    authProvider.value   = null
    walletUnlocked.value = false
  }

  function unlockWallet() { walletUnlocked.value = true  }
  function lockWallet()   { walletUnlocked.value = false }

  return {
    token, role, user, org, authProvider, walletUnlocked,
    isAuthenticated, isUser, isOrg,
    setSession, clearSession, unlockWallet, lockWallet,
  }
})