import type { EventCategory } from './event.types'

// ─── Event status as seen by the org admin ───────────────────────────────────

export type OrgEventStatus = 'live' | 'upcoming' | 'draft' | 'past'

export type ApprovalStatus = 'pending' | 'approved' | 'declined'

export type CheckInMethod = 'qr' | 'manual'

// ─── Org-facing event (richer than the volunteer Event type) ─────────────────

export interface OrgEvent {
  id: string
  title: string
  category: EventCategory
  date: string
  time: string
  location: string
  status: OrgEventStatus
  registeredCount: number
  capacityMax: number
  checkedInCount: number
  organizationId: string
  rewardDealId: string | null
}

// ─── A volunteer registration for an org event ───────────────────────────────

export interface OrgVolunteer {
  id: string
  eventId: string
  eventTitle: string
  eventStatus: OrgEventStatus
  eventCategory: EventCategory
  eventDate: string
  userId: string
  name: string
  username: string
  approvalStatus: ApprovalStatus
  checkedIn: boolean
  checkedInAt: string | null
  checkInMethod: CheckInMethod | null
  rewardIssued: boolean
}

// ─── A vendor deal attached to the org ───────────────────────────────────────

export interface VendorDeal {
  id: string
  businessId: string
  businessName: string
  businessCategory: 'cafe' | 'restaurant' | 'bakery' | 'retail'
  dealDescription: string
  totalCount: number
  redeemedCount: number
  expiryDate: string
}

// ─── Dashboard summary stats ──────────────────────────────────────────────────

export interface OrgDashboardStats {
  totalVolunteers: number
  activeEvents: number
  upcomingCount: number
  liveCount: number
  pendingApprovals: number
  vendorDeals: number
  vendorTotalRedeemed: number
}