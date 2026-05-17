import { ref, computed } from 'vue'
import { mockEvents } from '../data/events'
import type { EventCategory } from '../models/types/event.types'

export type ExploreFilter = 'all' | EventCategory

export function useExplore() {
  const searchQuery   = ref('')
  const activeFilter  = ref<ExploreFilter>('all')

  const filters: { label: string; value: ExploreFilter; icon: string }[] = [
    { label: 'All',        value: 'all',        icon: 'ti-list'            },
    { label: 'Volunteer',  value: 'volunteer',  icon: 'ti-heart-handshake' },
    { label: 'Community',  value: 'community',  icon: 'ti-trees'           },
    { label: 'Fundraiser', value: 'fundraiser', icon: 'ti-coin'            },
    { label: 'Workshop',   value: 'workshop',   icon: 'ti-school'          },
  ]

  const filteredEvents = computed(() => {
    let events = mockEvents

    if (activeFilter.value !== 'all') {
      events = events.filter(e => e.category === activeFilter.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.organizationName.toLowerCase().includes(q)
      )
    }

    return events
  })

  function setFilter(filter: ExploreFilter) {
    activeFilter.value = filter
  }

  return {
    searchQuery,
    activeFilter,
    filters,
    filteredEvents,
    setFilter,
  }
}
