import type { EventReward } from './coupon.types'

export type EventCategory = 'volunteer' | 'community' | 'workshop' | 'fundraiser'

export interface EventAttendee {
  initial: string
}

export interface Event {
  id: string
  title: string
  category: EventCategory
  date: string
  time: string
  location: string
  attendeeCount: number
  attendeeMax: number
  attendees: EventAttendee[]
  organizationId: string
  organizationName: string
  past?: boolean
  reward?: EventReward
}
