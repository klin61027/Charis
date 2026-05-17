import type { Ticket, TicketStatus } from '../models/types/ticket.types'

const BASE_URL = 'http://127.0.0.1:5000'

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

function mapTicket(t: any): Ticket {
  const status: TicketStatus = t.get_rewards
    ? 'attended'
    : t.status === 'approved'
    ? 'upcoming'
    : 'cancelled'

  const location = [t.event_address, t.event_city].filter(Boolean).join(', ')

  return {
    id:               String(t.id),
    eventId:          String(t.events_id),
    eventTitle:       t.event_title       ?? 'Unknown Event',
    eventCategory:    'volunteer',
    organizationName: t.organization_name ?? 'Unknown Organization',
    date:             t.event_start_time  ? formatDate(t.event_start_time) : '',
    time:             t.event_start_time  ? formatTime(t.event_start_time) : '',
    location,
    status,
    qrCode:           t.qr_code,
  }
}

export async function getTicketsByUser(userId: string): Promise<Ticket[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/tickets`)
  if (!res.ok) return []
  const data = await res.json()
  return data.map(mapTicket)
}
