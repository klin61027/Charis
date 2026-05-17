import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useOrgStore } from '../stores/org.store'
import { orgEventService } from '../services/org-event.service'
import type { OrgVolunteer } from '../models/types/org-event.types'

export function useOrgApprovals() {
  const authStore = useAuthStore()
  const orgStore  = useOrgStore()

  // ─── State ────────────────────────────────────────────────────────────────

  const isLoading  = ref(true)
  const error      = ref<string | null>(null)
  const volunteers = ref<OrgVolunteer[]>([])

  // ─── Tab filter — synced with store ───────────────────────────────────────

  const activeTab = computed({
    get: () => orgStore.approvalTabFilter,
    set: (val) => orgStore.setApprovalTabFilter(val),
  })

  // ─── Derived ──────────────────────────────────────────────────────────────

  const orgId = computed(() => authStore.org?.id ?? 'o1')

  const filteredVolunteers = computed(() => {
    let result = volunteers.value

    if (activeTab.value === 'live') {
      result = result.filter(v => v.eventStatus === 'live')
    } else if (activeTab.value === 'upcoming') {
      result = result.filter(v => v.eventStatus === 'upcoming')
    }

    // Pending always floats to top, resolved rows below dimmed
    return [...result].sort((a, b) => {
      const order = { pending: 0, approved: 1, declined: 2 }
      return order[a.approvalStatus] - order[b.approvalStatus]
    })
  })

  const counts = computed(() => ({
    all:      volunteers.value.filter(v => v.approvalStatus === 'pending').length,
    live:     volunteers.value.filter(v => v.eventStatus === 'live'     && v.approvalStatus === 'pending').length,
    upcoming: volunteers.value.filter(v => v.eventStatus === 'upcoming' && v.approvalStatus === 'pending').length,
  }))

  const totalPending = computed(() =>
    volunteers.value.filter(v => v.approvalStatus === 'pending').length
  )

  // ─── Fetch ────────────────────────────────────────────────────────────────

  async function load() {
    isLoading.value = true
    error.value     = null
    try {
      volunteers.value = await orgEventService.getVolunteers(orgId.value)
    } catch {
      error.value = 'Failed to load volunteers. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  function setTab(tab: 'all' | 'live' | 'upcoming') {
    orgStore.setApprovalTabFilter(tab)
  }

  async function approve(volunteerId: string) {
    try {
      const updated = await orgEventService.updateApprovalStatus(volunteerId, 'approved')
      const idx = volunteers.value.findIndex(v => v.id === volunteerId)
      if (idx !== -1) volunteers.value[idx] = updated
    } catch {
      error.value = 'Failed to approve volunteer.'
    }
  }

  async function decline(volunteerId: string) {
    try {
      const updated = await orgEventService.updateApprovalStatus(volunteerId, 'declined')
      const idx = volunteers.value.findIndex(v => v.id === volunteerId)
      if (idx !== -1) volunteers.value[idx] = updated
    } catch {
      error.value = 'Failed to decline volunteer.'
    }
  }

  async function approveAll() {
    try {
      // Approve all pending across the current tab's scope
      const pending = filteredVolunteers.value.filter(v => v.approvalStatus === 'pending')
      await Promise.all(pending.map(v => orgEventService.updateApprovalStatus(v.id, 'approved')))
      // Refresh the full list
      volunteers.value = await orgEventService.getVolunteers(orgId.value)
    } catch {
      error.value = 'Failed to approve all volunteers.'
    }
  }

  onMounted(load)

  return {
    // State
    isLoading,
    error,

    // Derived
    activeTab,
    filteredVolunteers,
    counts,
    totalPending,

    // Actions
    setTab,
    approve,
    decline,
    approveAll,
  }
}