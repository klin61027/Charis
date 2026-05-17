import type { IOrgEventRepository } from './org-event.repository'
import type {
  OrgEvent,
  OrgVolunteer,
  VendorDeal,
  OrgDashboardStats,
  OrgEventStatus,
  ApprovalStatus,
} from '../models/types/org-event.types'

const BASE_URL = 'http://127.0.0.1:5000'

// ─── Mappers ──────────────────────────────────────────────────────────────────

function deriveEventStatus(startTime: string, endTime: string): OrgEventStatus {
  const now   = new Date()
  const start = new Date(startTime)
  const end   = new Date(endTime)
  if (now >= start && now <= end) return 'live'
  if (now < start)               return 'upcoming'
  return 'past'
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

function mapEvent(e: any): OrgEvent {
  return {
    id:             e.id,
    title:          e.title,
    category:       'volunteer',
    date:           formatDate(e.start_time),
    time:           formatTime(e.start_time),
    location:       `${e.address}, ${e.city}`,
    status:         deriveEventStatus(e.start_time, e.end_time),
    registeredCount: e.volunteers_amount ?? 0,
    capacityMax:    e.volunteers_amount > 0 ? e.volunteers_amount : 20,
    checkedInCount: 0,
    organizationId: e.organization_id,
    rewardDealId:   null,
  }
}

function mapDoc(doc: any, events: OrgEvent[]): OrgVolunteer {
  const event = events.find(e => e.id === doc.event_id)
  const approvalStatus: ApprovalStatus =
    doc.status === 'approved' ? 'approved' :
    doc.status === 'deny'     ? 'declined' : 'pending'
  return {
    id:             String(doc.id),
    eventId:        doc.event_id,
    eventTitle:     event?.title    ?? 'Unknown event',
    eventStatus:    event?.status   ?? 'upcoming',
    eventCategory:  'volunteer',
    eventDate:      event?.date     ?? '',
    userId:         doc.users_id,
    name:           doc.users_id,
    username:       doc.users_id.slice(0, 8),
    approvalStatus,
    checkedIn:      false,
    checkedInAt:    null,
    checkInMethod:  null,
    rewardIssued:   false,
  }
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class OrgEventApiRepository implements IOrgEventRepository {

  async getEvents(organizationId: string): Promise<OrgEvent[]> {
    const res  = await fetch(`${BASE_URL}/organizations/${organizationId}/events`)
    const data = await res.json()
    return data.map(mapEvent)
  }

  async getEventById(eventId: string): Promise<OrgEvent | null> {
    const res  = await fetch(`${BASE_URL}/events/${eventId}`)
    const data = await res.json()
    return mapEvent(data)
  }

  async getEventsByStatus(organizationId: string, status: OrgEventStatus): Promise<OrgEvent[]> {
    const events = await this.getEvents(organizationId)
    return events.filter(e => e.status === status)
  }

  async getVolunteers(organizationId: string): Promise<OrgVolunteer[]> {
    const [docsRes, events] = await Promise.all([
      fetch(`${BASE_URL}/approvedocs`),
      this.getEvents(organizationId),
    ])
    const docs     = await docsRes.json()
    const eventIds = new Set(events.map(e => e.id))
    return docs
      .filter((d: any) => eventIds.has(d.event_id))
      .map((d: any)    => mapDoc(d, events))
  }

  async getVolunteersByEvent(eventId: string): Promise<OrgVolunteer[]> {
    const [docsRes, eventRes] = await Promise.all([
      fetch(`${BASE_URL}/approvedocs`),
      fetch(`${BASE_URL}/events/${eventId}`),
    ])
    const docs  = await docsRes.json()
    const event = mapEvent(await eventRes.json())
    return docs
      .filter((d: any) => d.event_id === eventId)
      .map((d: any)    => mapDoc(d, [event]))
  }

  async updateApprovalStatus(volunteerId: string, status: ApprovalStatus): Promise<OrgVolunteer> {
    const endpoint = status === 'approved'
      ? `${BASE_URL}/approvedocs/${volunteerId}/approve`
      : `${BASE_URL}/approvedocs/${volunteerId}/deny`
    await fetch(endpoint, { method: 'PUT' })
    const docRes = await fetch(`${BASE_URL}/approvedocs/${volunteerId}`)
    const doc    = await docRes.json()
    return mapDoc(doc, [])
  }

  async approveAll(eventId: string): Promise<OrgVolunteer[]> {
    const vols    = await this.getVolunteersByEvent(eventId)
    const pending = vols.filter(v => v.approvalStatus === 'pending')
    await Promise.all(
      pending.map(v =>
        fetch(`${BASE_URL}/approvedocs/${v.id}/approve`, { method: 'PUT' })
      )
    )
    return this.getVolunteersByEvent(eventId)
  }

  async checkInVolunteer(volunteerId: string, method: 'qr' | 'manual'): Promise<OrgVolunteer> {
    const docRes  = await fetch(`${BASE_URL}/approvedocs/${volunteerId}`)
    const doc     = await docRes.json()
    const tktsRes = await fetch(`${BASE_URL}/tickets`)
    const tickets = await tktsRes.json()
    const ticket  = tickets.find((t: any) =>
      t.events_id === doc.event_id && t.user_id === doc.users_id
    )
    if (ticket) {
      await fetch(`${BASE_URL}/tickets/scan/${ticket.qr_code}/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant_id:  null,
          title:          'Volunteer Reward Coupon',
          discount_price: 0,
          start_time:     new Date().toISOString(),
          end_time:       new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      })
    }
    const eventRes = await fetch(`${BASE_URL}/events/${doc.event_id}`)
    const event    = mapEvent(await eventRes.json())
    return {
      ...mapDoc(doc, [event]),
      checkedIn:     true,
      checkedInAt:   new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      checkInMethod: method,
    }
  }

  async issueReward(volunteerId: string): Promise<OrgVolunteer> {
    const docRes   = await fetch(`${BASE_URL}/approvedocs/${volunteerId}`)
    const doc      = await docRes.json()
    const eventRes = await fetch(`${BASE_URL}/events/${doc.event_id}`)
    const event    = mapEvent(await eventRes.json())
    return { ...mapDoc(doc, [event]), rewardIssued: true }
  }

  async issueAllRewards(eventId: string): Promise<OrgVolunteer[]> {
    const vols = await this.getVolunteersByEvent(eventId)
    return vols.map(v => v.checkedIn ? { ...v, rewardIssued: true } : v)
  }

  async getVendorDeals(organizationId: string): Promise<VendorDeal[]> {
    return []
  }

  async getDashboardStats(organizationId: string): Promise<OrgDashboardStats> {
    const [events, volunteers] = await Promise.all([
      this.getEvents(organizationId),
      this.getVolunteers(organizationId),
    ])
    const liveCount     = events.filter(e => e.status === 'live').length
    const upcomingCount = events.filter(e => e.status === 'upcoming').length
    const pending       = volunteers.filter(v => v.approvalStatus === 'pending').length
    const totalVols     = new Set(volunteers.map(v => v.userId)).size
    return {
      totalVolunteers:     totalVols,
      activeEvents:        liveCount + upcomingCount,
      upcomingCount,
      liveCount,
      pendingApprovals:    pending,
      vendorDeals:         0,
      vendorTotalRedeemed: 0,
    }
  }
}