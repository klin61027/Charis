import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useOrgStore } from '../stores/org.store'
import { orgEventService } from '../services/org-event.service'
import type { OrgEvent, OrgVolunteer, VendorDeal, OrgDashboardStats } from '../models/types/org-event.types'

export function useOrgDashboard() {
  const router    = useRouter()
  const authStore = useAuthStore()
  const orgStore  = useOrgStore()

  // ─── State ────────────────────────────────────────────────────────────────

  const isLoading   = ref(true)
  const error       = ref<string | null>(null)

  const stats       = ref<OrgDashboardStats | null>(null)
  const events      = ref<OrgEvent[]>([])
  const volunteers  = ref<OrgVolunteer[]>([])
  const deals       = ref<VendorDeal[]>([])

  // ─── Derived ──────────────────────────────────────────────────────────────

  const orgId = computed(() => authStore.org?.id ?? 'o1')
  const orgName = computed(() => authStore.org?.name ?? 'Organization')

  const pendingVolunteers = computed(() =>
    volunteers.value.filter(v => v.approvalStatus === 'pending')
  )

  const liveEvent = computed(() =>
    events.value.find(e => e.status === 'live') ?? null
  )

  // ─── Fetch ────────────────────────────────────────────────────────────────

  async function load() {
    isLoading.value = true
    error.value     = null
    try {
      const [fetchedStats, fetchedEvents, fetchedVolunteers, fetchedDeals] = await Promise.all([
        orgEventService.getDashboardStats(orgId.value),
        orgEventService.getEvents(orgId.value),
        orgEventService.getVolunteers(orgId.value),
        orgEventService.getVendorDeals(orgId.value),
      ])
      stats.value      = fetchedStats
      events.value     = fetchedEvents
      volunteers.value = fetchedVolunteers
      deals.value      = fetchedDeals
    } catch (e) {
      error.value = 'Failed to load dashboard. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async function approveVolunteer(volunteerId: string) {
    try {
      const updated = await orgEventService.updateApprovalStatus(volunteerId, 'approved')
      const idx = volunteers.value.findIndex(v => v.id === volunteerId)
      if (idx !== -1) volunteers.value[idx] = updated
      if (stats.value) stats.value.pendingApprovals -= 1
    } catch {
      error.value = 'Failed to approve volunteer.'
    }
  }

  async function declineVolunteer(volunteerId: string) {
    try {
      const updated = await orgEventService.updateApprovalStatus(volunteerId, 'declined')
      const idx = volunteers.value.findIndex(v => v.id === volunteerId)
      if (idx !== -1) volunteers.value[idx] = updated
      if (stats.value) stats.value.pendingApprovals -= 1
    } catch {
      error.value = 'Failed to decline volunteer.'
    }
  }

  function navigateToEvents() {
    router.push('/org/events')
  }

  function navigateToApprovals() {
    router.push('/org/approvals')
  }

  function navigateToCheckin(eventId: string) {
    const event = events.value.find(e => e.id === eventId)
    if (event) {
      orgStore.setActiveEvent(event)
      router.push(`/org/checkin/${eventId}`)
    }
  }

  function navigateToNewEvent() {
    router.push('/org/events/new')
  }

  onMounted(load)

  return {
    // State
    isLoading,
    error,
    stats,
    events,
    deals,

    // Derived
    orgName,
    pendingVolunteers,
    liveEvent,

    // Actions
    approveVolunteer,
    declineVolunteer,
    navigateToEvents,
    navigateToApprovals,
    navigateToCheckin,
    navigateToNewEvent,
  }
}