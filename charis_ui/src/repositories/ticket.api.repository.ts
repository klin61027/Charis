import type { Ticket, TicketStatus } from '../models/types/ticket.types'
import type { Coupon, CouponStatus } from '../models/types/coupon.types'

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

function mapCoupon(c: any): Coupon {
  const now     = new Date()
  const endDate = c.end_time ? new Date(c.end_time) : null
  const daysLeft = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86_400_000))
    : 0

  let status: CouponStatus
  if (c.status === 'used' || c.status === 'redeemed') {
    status = 'redeemed'
  } else if (c.status === 'expired' || (endDate && endDate < now)) {
    status = 'expired'
  } else if (daysLeft <= 3) {
    status = 'expiring_soon'
  } else {
    status = 'active'
  }

  const value = c.discount_price > 0 ? `$${c.discount_price} off` : 'Free reward'

  return {
    id:                 String(c.id),
    businessId:         c.restaurant_id,
    businessName:       c.restaurant_name ?? 'Partner Restaurant',
    businessCategory:   'restaurant',
    neighborhood:       c.restaurant_city ?? '',
    value,
    status,
    daysLeft,
    earnedFromEventId:  String(c.event_id ?? ''),
    barcode:            c.barcode ?? undefined,
  }
}

export async function getCouponsByUser(userId: string): Promise<Coupon[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/coupons`)
  if (!res.ok) return []
  const data = await res.json()
  return data.map(mapCoupon)
}
