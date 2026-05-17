import { ref, computed } from 'vue'
import type { EventCategory } from '../models/types/event.types'
import type { OrgCategory } from '../models/types/organization.types'
import { mockEvents, pastEvents } from '../data/events'
import { mockOrganizations } from '../data/organizations'

export type EventFilter = 'groups' | 'join' | 'saved' | 'past'

const categoryStyles: Record<EventCategory, { color: string; bg: string }> = {
  volunteer:  { color: '#a78bfa', bg: '#a78bfa18' },
  community:  { color: '#34d399', bg: '#34d39918' },
  workshop:   { color: '#2563eb', bg: '#2563eb12' },
  fundraiser: { color: '#f59e0b', bg: '#f59e0b18' },
}

const orgAccentColors: Record<OrgCategory, string> = {
  food:        '#c9920e',
  environment: '#2563eb',
  community:   '#a78bfa',
}

export function useHome() {
  const activeFilter = ref<EventFilter>('join')
  const joinedIds    = ref<Set<string>>(new Set())
  const savedIds     = ref<Set<string>>(new Set())

  const organizations = mockOrganizations

  const visibleEvents = computed(() => {
    switch (activeFilter.value) {
      case 'join':   return mockEvents
      case 'groups': return mockEvents.filter(e => joinedIds.value.has(e.id))
      case 'saved':  return mockEvents.filter(e => savedIds.value.has(e.id))
      case 'past':   return pastEvents
      default:       return mockEvents
    }
  })

  function setFilter(filter: EventFilter) {
    activeFilter.value = filter
  }

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

  function isJoined(id: string) {
    return joinedIds.value.has(id)
  }

  function isSaved(id: string) {
    return savedIds.value.has(id)
  }

  function badgeStyle(category: EventCategory) {
    return categoryStyles[category] ?? { color: '#6b6b72', bg: 'transparent' }
  }

  function orgAccent(category: OrgCategory) {
    return orgAccentColors[category] ?? '#c9920e'
  }

  return {
    activeFilter,
    organizations,
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