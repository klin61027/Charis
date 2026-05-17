import type { IOrgEventRepository } from './org-event.repository'
import type {
  OrgEvent,
  OrgVolunteer,
  VendorDeal,
  OrgDashboardStats,
  OrgEventStatus,
  ApprovalStatus,
} from '../models/types/org-event.types'
import { mockOrgEvents } from '../data/org-events'
import { mockOrgVolunteers } from '../data/org-volunteers'
import { mockVendorDeals } from '../data/vendor-deals'

// Local mutable copies so mutations (approve, check-in, etc.)
// are reflected reactively during the session without touching
// the original arrays.
let events: OrgEvent[]       = mockOrgEvents.map(e => ({ ...e }))
let volunteers: OrgVolunteer[] = mockOrgVolunteers.map(v => ({ ...v }))
let deals: VendorDeal[]      = mockVendorDeals.map(d => ({ ...d }))

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

export class OrgEventMockRepository implements IOrgEventRepository {

  // ─── Events ───────────────────────────────────────────────────────────────

  getEvents(organizationId: string): Promise<OrgEvent[]> {
    return delay(events.filter(e => e.organizationId === organizationId))
  }

  getEventById(eventId: string): Promise<OrgEvent | null> {
    return delay(events.find(e => e.id === eventId) ?? null)
  }

  getEventsByStatus(organizationId: string, status: OrgEventStatus): Promise<OrgEvent[]> {
    return delay(
      events.filter(e => e.organizationId === organizationId && e.status === status)
    )
  }

  // ─── Volunteers / Approvals ───────────────────────────────────────────────

  getVolunteers(organizationId: string): Promise<OrgVolunteer[]> {
    const orgEventIds = new Set(
      events
        .filter(e => e.organizationId === organizationId)
        .map(e => e.id)
    )
    return delay(volunteers.filter(v => orgEventIds.has(v.eventId)))
  }

  getVolunteersByEvent(eventId: string): Promise<OrgVolunteer[]> {
    return delay(volunteers.filter(v => v.eventId === eventId))
  }

  updateApprovalStatus(volunteerId: string, status: ApprovalStatus): Promise<OrgVolunteer> {
    const vol = volunteers.find(v => v.id === volunteerId)
    if (!vol) return Promise.reject(new Error(`Volunteer ${volunteerId} not found`))
    vol.approvalStatus = status
    return delay({ ...vol })
  }

  approveAll(eventId: string): Promise<OrgVolunteer[]> {
    volunteers
      .filter(v => v.eventId === eventId && v.approvalStatus === 'pending')
      .forEach(v => { v.approvalStatus = 'approved' })
    return delay(volunteers.filter(v => v.eventId === eventId).map(v => ({ ...v })))
  }

  // ─── Check-in ─────────────────────────────────────────────────────────────

  checkInVolunteer(volunteerId: string, method: 'qr' | 'manual'): Promise<OrgVolunteer> {
    const vol = volunteers.find(v => v.id === volunteerId)
    if (!vol) return Promise.reject(new Error(`Volunteer ${volunteerId} not found`))

    vol.checkedIn      = true
    vol.checkInMethod  = method
    vol.checkedInAt    = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })

    // Update the parent event's checkedInCount
    const evt = events.find(e => e.id === vol.eventId)
    if (evt) evt.checkedInCount += 1

    return delay({ ...vol })
  }

  // ─── Rewards ──────────────────────────────────────────────────────────────

  issueReward(volunteerId: string): Promise<OrgVolunteer> {
    const vol = volunteers.find(v => v.id === volunteerId)
    if (!vol) return Promise.reject(new Error(`Volunteer ${volunteerId} not found`))

    vol.rewardIssued = true

    // Increment redeemedCount on the event's attached deal
    const evt = events.find(e => e.id === vol.eventId)
    if (evt?.rewardDealId) {
      const deal = deals.find(d => d.id === evt.rewardDealId)
      if (deal) deal.redeemedCount += 1
    }

    return delay({ ...vol })
  }

  issueAllRewards(eventId: string): Promise<OrgVolunteer[]> {
    const evt = events.find(e => e.id === eventId)

    volunteers
      .filter(v => v.eventId === eventId && v.checkedIn && !v.rewardIssued)
      .forEach(v => {
        v.rewardIssued = true
        if (evt?.rewardDealId) {
          const deal = deals.find(d => d.id === evt.rewardDealId)
          if (deal) deal.redeemedCount += 1
        }
      })

    return delay(volunteers.filter(v => v.eventId === eventId).map(v => ({ ...v })))
  }

  // ─── Vendor deals ─────────────────────────────────────────────────────────

  getVendorDeals(organizationId: string): Promise<VendorDeal[]> {
    // In production this would filter by org. Mock returns all deals.
    return delay([...deals])
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  getDashboardStats(organizationId: string): Promise<OrgDashboardStats> {
    const orgEvents = events.filter(e => e.organizationId === organizationId)

    const activeEvents   = orgEvents.filter(e => e.status === 'live' || e.status === 'upcoming')
    const liveCount      = orgEvents.filter(e => e.status === 'live').length
    const upcomingCount  = orgEvents.filter(e => e.status === 'upcoming').length

    const orgEventIds    = new Set(orgEvents.map(e => e.id))
    const orgVolunteers  = volunteers.filter(v => orgEventIds.has(v.eventId))

    const totalVolunteers   = new Set(orgVolunteers.map(v => v.userId)).size
    const pendingApprovals  = orgVolunteers.filter(v => v.approvalStatus === 'pending').length
    const vendorTotalRedeemed = deals.reduce((sum, d) => sum + d.redeemedCount, 0)

    return delay({
      totalVolunteers,
      activeEvents:        activeEvents.length,
      upcomingCount,
      liveCount,
      pendingApprovals,
      vendorDeals:         deals.length,
      vendorTotalRedeemed,
    })
  }
}