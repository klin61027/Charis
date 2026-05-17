import { ref, computed, onMounted } from 'vue'
import type { Event, EventCategory } from '../models/types/event.types'
import type { OrgCategory } from '../models/types/organization.types'
import { mockOrganizations } from '../data/organizations'
import { mockCoupons } from '../data/coupons'

export type EventFilter = 'groups' | 'join' | 'saved' | 'past'

const BASE_URL = 'http://127.0.0.1:5000'

const categoryStyles: Record<EventCategory, { color: string; bg: string }> = {
  volunteer:  { color: '#a78bfa', bg: '#a78bfa22' },
  community:  { color: '#34d399', bg: '#34d39922' },
  workshop:   { color: '#2563eb', bg: '#2563eb18' },
  fundraiser: { color: '#f59e0b', bg: '#f59e0b22' },
}

const orgAccentColors: Record<OrgCategory, string> = {
  food:        '#c9920e',
  environment: '#2563eb',
  community:   '#a78bfa',
}

function deriveCategory(title: string): EventCategory {
  const t = title.toLowerCase()
  if (t.includes('food') || t.includes('kitchen') || t.includes('harvest') || t.includes('meal')) return 'volunteer'
  if (t.includes('park') || t.includes('clean') || t.includes('garden') || t.includes('tree') || t.includes('restoration')) return 'community'
  if (t.includes('workshop') || t.includes('tutoring') || t.includes('training') || t.includes('session')) return 'workshop'
  if (t.includes('fundrais') || t.includes('charity') || t.includes('run') || t.includes('donation')) return 'fundraiser'
  return 'volunteer'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
  })
}

function mapApiEvent(e: any): Event {
  const isPast = new Date(e.end_time) < new Date()
  return {
    id:               e.id,
    title:            e.title,
    category:         deriveCategory(e.title),
    date:             formatDate(e.start_time),
    time:             formatTime(e.start_time),
    location:         `${e.address}, ${e.city}`,
    attendeeCount:    e.volunteers_amount ?? 0,
    attendeeMax:      e.volunteers_amount > 0 ? e.volunteers_amount : 20,
    attendees:        [],
    organizationId:   e.organization_id,
    organizationName: e.organization_id.slice(0, 8),
    past:             isPast,
  }
}

export function useHome() {
  const activeFilter = ref<EventFilter>('join')
  const joinedIds    = ref<Set<string>>(new Set())
  const savedIds     = ref<Set<string>>(new Set())
  const allEvents    = ref<Event[]>([])
  const isLoading    = ref(false)
  const error        = ref<string | null>(null)

  const organizations = mockOrganizations
  const earnedCoupons = mockCoupons.filter(c => c.status === 'active' || c.status === 'expiring_soon')

  async function loadEvents() {
    isLoading.value = true
    error.value     = null
    try {
      const res  = await fetch(`${BASE_URL}/events`)
      const data = await res.json()
      allEvents.value = data.map(mapApiEvent)
    } catch {
      error.value = 'Failed to load events.'
    } finally {
      isLoading.value = false
    }
  }

  const upcomingEvents = computed(() => allEvents.value.filter(e => !e.past))
  const pastEvents     = computed(() => allEvents.value.filter(e => e.past))

  const visibleEvents = computed(() => {
    switch (activeFilter.value) {
      case 'join':   return upcomingEvents.value
      case 'groups': return upcomingEvents.value.filter(e => joinedIds.value.has(e.id))
      case 'saved':  return upcomingEvents.value.filter(e => savedIds.value.has(e.id))
      case 'past':   return pastEvents.value
      default:       return upcomingEvents.value
    }
  })

  function setFilter(filter: EventFilter) { activeFilter.value = filter }

  function toggleJoin(id: string) {
    const next = new Set(joinedIds.value)
    next.has(id) ? next.delete(id) : next.add(id)
    joinedIds.value = next
  }

  function toggleSave(id: string) {
    const next = new Set(savedIds.value)
    next.has(id) ? next.delete(id) : next.add(id)
    savedIds.value = next
  }

  function isJoined(id: string) { return joinedIds.value.has(id) }
  function isSaved(id: string)  { return savedIds.value.has(id) }

  function badgeStyle(category: EventCategory) {
    return categoryStyles[category] ?? { color: '#6b6b72', bg: 'transparent' }
  }

  function orgAccent(category: OrgCategory) {
    return orgAccentColors[category] ?? '#c9920e'
  }

  onMounted(loadEvents)

  return {
    activeFilter,
    isLoading,
    error,
    organizations,
    earnedCoupons,
    visibleEvents,
    setFilter,
    toggleJoin,
    toggleSave,
    isJoined,
    isSaved,
    badgeStyle,
    orgAccent,
  }
}