export type TicketStatus = 'upcoming' | 'attended' | 'cancelled'

export interface Ticket {
  id: string
  eventId: string
  eventTitle: string
  eventCategory: 'volunteer' | 'community' | 'workshop' | 'fundraiser'
  organizationName: string
  date: string
  time: string
  location: string
  status: TicketStatus
}
