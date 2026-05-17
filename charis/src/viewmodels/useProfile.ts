import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { mockUserProfile, mockFollowedOrgs } from '../data/profile'

export function useProfile() {
  const router    = useRouter()
  const authStore = useAuthStore()

  const profile      = mockUserProfile
  const followedOrgs = mockFollowedOrgs

  const notificationSettings = ref({
    eventReminders:      true,
    newCoupons:          true,
    applicationUpdates:  false,
  })

  function goToSettings() {
    router.push('/settings')
  }

  function goToOrgDetail(id: string) {
    router.push(`/org/${id}`)
  }

  function logout() {
    authStore.clearSession()
    router.push('/login')
  }

  return {
    profile,
    followedOrgs,
    notificationSettings,
    goToSettings,
    goToOrgDetail,
    logout,
  }
}
