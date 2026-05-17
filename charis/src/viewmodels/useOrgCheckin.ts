import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrgStore } from '../stores/org.store'
import { orgEventService } from '../services/org-event.service'
import type { OrgVolunteer, VendorDeal } from '../models/types/org-event.types'

export function useOrgCheckin(eventId: string) {
  const router   = useRouter()
  const orgStore = useOrgStore()

  // ─── State ────────────────────────────────────────────────────────────────

  const isLoading         = ref(true)
  const error             = ref<string | null>(null)
  const search            = ref('')
  const activeTab         = ref<'checkin' | 'rewards' | 'details'>('checkin')
  const showCheckinModal  = ref(false)
  const selectedVolunteer = ref<OrgVolunteer | null>(null)
  const deal              = ref<VendorDeal | null>(null)

  // ─── Event from store ─────────────────────────────────────────────────────

  const event = computed(() => orgStore.activeEvent)

  // ─── Volunteers from store ────────────────────────────────────────────────

  const volunteers = computed(() => orgStore.checkinVolunteers)

  // ─── Derived ──────────────────────────────────────────────────────────────

  const filteredVolunteers = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return volunteers.value
    return volunteers.value.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.username.toLowerCase().includes(q)
    )
  })

  const checkedInCount    = computed(() => orgStore.checkedInCount)
  const notArrivedCount   = computed(() => orgStore.notArrivedCount)
  const rewardsIssuedCount = computed(() => orgStore.rewardsIssuedCount)

  // ─── Fetch ────────────────────────────────────────────────────────────────

  async function load() {
    isLoading.value = true
    error.value     = null
    try {
      const [fetchedVolunteers, fetchedDeals] = await Promise.all([
        orgEventService.getVolunteersByEvent(eventId),
        orgEventService.getVendorDeals(event.value?.organizationId ?? 'o1'),
      ])

      orgStore.setCheckinVolunteers(fetchedVolunteers)

      // Attach the deal linked to this event if one exists
      if (event.value?.rewardDealId) {
        deal.value = fetchedDeals.find(d => d.id === event.value!.rewardDealId) ?? null
      }
    } catch {
      error.value = 'Failed to load check-in data. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  // ─── Check-in actions ────────────────────────────────────────────────────

  function openCheckinModal(volunteer: OrgVolunteer) {
    selectedVolunteer.value = volunteer
    showCheckinModal.value  = true
  }

  function closeCheckinModal() {
    showCheckinModal.value  = false
    selectedVolunteer.value = null
  }

  async function confirmCheckin(method: 'qr' | 'manual') {
    if (!selectedVolunteer.value) return
    try {
      const updated = await orgEventService.checkInVolunteer(
        selectedVolunteer.value.id,
        method
      )
      orgStore.updateVolunteer(updated)
    } catch {
      error.value = 'Failed to check in volunteer.'
    } finally {
      closeCheckinModal()
    }
  }

  // ─── Reward actions ───────────────────────────────────────────────────────

  async function issueReward(volunteerId: string) {
    try {
      const updated = await orgEventService.issueReward(volunteerId)
      orgStore.updateVolunteer(updated)
      // Keep deal count in sync
      if (deal.value) deal.value.redeemedCount += 1
    } catch {
      error.value = 'Failed to issue reward.'
    }
  }

  async function issueAllRewards() {
    try {
      const updated = await orgEventService.issueAllRewards(eventId)
      orgStore.replaceVolunteers(updated)
      // Recount redeemed from updated list
      if (deal.value) {
        deal.value.redeemedCount = updated.filter(v => v.rewardIssued).length
      }
    } catch {
      error.value = 'Failed to issue all rewards.'
    }
  }

  // ─── Navigation ──────────────────────────────────────────────────────────

  function goBack() {
    orgStore.clearActiveEvent()
    router.push('/org/events')
  }

  function setTab(tab: 'checkin' | 'rewards' | 'details') {
    activeTab.value = tab
  }

  onMounted(load)

  return {
    // State
    isLoading,
    error,
    search,
    activeTab,
    showCheckinModal,
    selectedVolunteer,
    deal,

    // Derived
    event,
    filteredVolunteers,
    checkedInCount,
    notArrivedCount,
    rewardsIssuedCount,

    // Actions
    setTab,
    openCheckinModal,
    closeCheckinModal,
    confirmCheckin,
    issueReward,
    issueAllRewards,
    goBack,
  }
}