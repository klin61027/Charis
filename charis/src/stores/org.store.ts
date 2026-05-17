import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { OrgEvent, OrgVolunteer } from '../models/types/org-event.types'

export const useOrgStore = defineStore('org', () => {

  // ─── Active live event for check-in view ─────────────────────────────────
  const activeEventId = ref<string | null>(null)
  const activeEvent   = ref<OrgEvent | null>(null)

  // ─── Check-in session volunteers (live event only) ────────────────────────
  const checkinVolunteers = ref<OrgVolunteer[]>([])

  // ─── Approval tab filter ──────────────────────────────────────────────────
  const approvalTabFilter = ref<'all' | 'live' | 'upcoming'>('all')

  // ─── Event list filter ────────────────────────────────────────────────────
  const eventStatusFilter = ref<'all' | 'live' | 'upcoming' | 'draft' | 'past'>('all')

  // ─── Derived check-in counts ──────────────────────────────────────────────
  const checkedInCount = computed(() =>
    checkinVolunteers.value.filter(v => v.checkedIn).length
  )

  const notArrivedCount = computed(() =>
    checkinVolunteers.value.filter(v => v.approvalStatus === 'approved' && !v.checkedIn).length
  )

  const rewardsIssuedCount = computed(() =>
    checkinVolunteers.value.filter(v => v.rewardIssued).length
  )

  // ─── Actions ──────────────────────────────────────────────────────────────

  function setActiveEvent(event: OrgEvent) {
    activeEvent.value   = event
    activeEventId.value = event.id
  }

  function clearActiveEvent() {
    activeEvent.value   = null
    activeEventId.value = null
    checkinVolunteers.value = []
  }

  function setCheckinVolunteers(volunteers: OrgVolunteer[]) {
    checkinVolunteers.value = volunteers
  }

  function updateVolunteer(updated: OrgVolunteer) {
    const idx = checkinVolunteers.value.findIndex(v => v.id === updated.id)
    if (idx !== -1) checkinVolunteers.value[idx] = updated
  }

  function replaceVolunteers(volunteers: OrgVolunteer[]) {
    checkinVolunteers.value = volunteers
  }

  function setApprovalTabFilter(filter: 'all' | 'live' | 'upcoming') {
    approvalTabFilter.value = filter
  }

  function setEventStatusFilter(filter: 'all' | 'live' | 'upcoming' | 'draft' | 'past') {
    eventStatusFilter.value = filter
  }

  return {
    // State
    activeEventId,
    activeEvent,
    checkinVolunteers,
    approvalTabFilter,
    eventStatusFilter,

    // Computed
    checkedInCount,
    notArrivedCount,
    rewardsIssuedCount,

    // Actions
    setActiveEvent,
    clearActiveEvent,
    setCheckinVolunteers,
    updateVolunteer,
    replaceVolunteers,
    setApprovalTabFilter,
    setEventStatusFilter,
  }
})