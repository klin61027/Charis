import { ref, computed } from 'vue'
import { mockEvents } from '../data/events'
import { mockOrganizations } from '../data/organizations'
import type { OrgCategory } from '../models/types/organization.types'

export type OrgTab = 'home' | 'about' | 'events' | 'volunteers'

const mockVolunteers = [
  { id: 'v1', name: 'Kevin Lin',    username: 'kevinlin', events: 7,  hours: 18, initials: 'KL', category: 'food'        as OrgCategory },
  { id: 'v2', name: 'Sara Rivera',  username: 'srivera',  events: 6,  hours: 15, initials: 'SR', category: 'environment' as OrgCategory },
  { id: 'v3', name: 'Marcus Kim',   username: 'marcusk',  events: 5,  hours: 12, initials: 'MK', category: 'community'   as OrgCategory },
  { id: 'v4', name: 'Jamie Park',   username: 'jamiepark', events: 4, hours: 10, initials: 'JP', category: 'food'        as OrgCategory },
  { id: 'v5', name: 'Alex Lee',     username: 'alexlee', events: 3,  hours: 8,  initials: 'AL', category: 'environment' as OrgCategory },
]

const recentActivity = [
  { id: 'r1', name: 'Tina Nguyen',  initials: 'TN', eventTitle: 'Food Bank Sorting',   daysAgo: 2 },
  { id: 'r2', name: 'David Moore',  initials: 'DM', eventTitle: 'Community Kitchen',   daysAgo: 3 },
]

export function useOrgDetail(orgId: string) {
  const activeTab = ref<OrgTab>('home')
  const isFollowing = ref(true)

  const org = computed(() =>
    mockOrganizations.find(o => o.id === orgId) ?? mockOrganizations[0]
  )

  const orgEvents = computed(() =>
    mockEvents.filter(e => e.organizationId === orgId)
  )

  const pastOrgEvents = computed(() => [
    {
      id: 'evt-past-1',
      title: 'Rainier Valley Food Drive',
      category: 'volunteer' as const,
      date: 'Sat, May 3',
      time: '9:00am',
      location: 'Rainier Valley, Seattle',
      attendeeCount: 24,
      attendeeMax: 30,
      attendees: [],
      organizationId: orgId,
      organizationName: org.value?.name ?? '',
      past: true,
    }
  ])

  const stats = computed(() => ({
    events:     orgEvents.value.length + pastOrgEvents.value.length,
    followers:  1200,
    hours:      340,
    volunteers: 248,
  }))

  function setTab(tab: OrgTab) {
    activeTab.value = tab
  }

  function toggleFollow() {
    isFollowing.value = !isFollowing.value
  }

  return {
    activeTab,
    isFollowing,
    org,
    orgEvents,
    pastOrgEvents,
    stats,
    volunteers: mockVolunteers,
    recentActivity,
    setTab,
    toggleFollow,
  }
}
