import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useOrgStore } from '../stores/org.store'
import { orgEventService } from '../services/org-event.service'
import type { OrgEvent, OrgEventStatus } from '../models/types/org-event.types'

export function useOrgEvents() {
  const router    = useRouter()
  const authStore = useAuthStore()
  const orgStore  = useOrgStore()

  // ─── State ────────────────────────────────────────────────────────────────

  const isLoading = ref(true)
  const error     = ref<string | null>(null)
  const events    = ref<OrgEvent[]>([])
  const search    = ref('')

  // ─── Filter — synced with store so navigating back preserves selection ────

  const activeFilter = computed({
    get: () => orgStore.eventStatusFilter,
    set: (val) => orgStore.setEventStatusFilter(val),
  })

  // ─── Derived ──────────────────────────────────────────────────────────────

  const orgId = computed(() => authStore.org?.id ?? 'o1')

  const liveEvent = computed(() =>
    events.value.find(e => e.status === 'live') ?? null
  )

  const filteredEvents = computed(() => {
    let result = events.value

    if (activeFilter.value !== 'all') {
      result = result.filter(e => e.status === activeFilter.value)
    }

    if (search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      )
    }

    // Live always pinned first, then sort by status order
    const order: OrgEventStatus[] = ['live', 'upcoming', 'draft', 'past']
    return [...result].sort(
      (a, b) => order.indexOf(a.status) - order.indexOf(b.status)
    )
  })

  const counts = computed(() => ({
    all:      events.value.length,
    live:     events.value.filter(e => e.status === 'live').length,
    upcoming: events.value.filter(e => e.status === 'upcoming').length,
    draft:    events.value.filter(e => e.status === 'draft').length,
    past:     events.value.filter(e => e.status === 'past').length,
  }))

  // ─── Fetch ────────────────────────────────────────────────────────────────

  async function load() {
    isLoading.value = true
    error.value     = null
    try {
      events.value = await orgEventService.getEvents(orgId.value)
    } catch {
      error.value = 'Failed to load events. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  function setFilter(filter: 'all' | 'live' | 'upcoming' | 'draft' | 'past') {
    orgStore.setEventStatusFilter(filter)
  }

  function navigateToCheckin(event: OrgEvent) {
    orgStore.setActiveEvent(event)
    router.push(`/org/checkin/${event.id}`)
  }

  function navigateToNewEvent() {
    router.push('/org/events/new')
  }

  onMounted(load)

  return {
    // State
    isLoading,
    error,
    search,

    // Derived
    activeFilter,
    filteredEvents,
    liveEvent,
    counts,

    // Actions
    setFilter,
    navigateToCheckin,
    navigateToNewEvent,
  }
}