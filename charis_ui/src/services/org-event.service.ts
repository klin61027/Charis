import type { IOrgEventRepository } from '../repositories/org-event.repository'
import type {
  OrgEvent,
  OrgVolunteer,
  VendorDeal,
  OrgDashboardStats,
  OrgEventStatus,
  ApprovalStatus,
} from '../models/types/org-event.types'
import { OrgEventMockRepository } from '../repositories/org-event.mock.repository'

// ─── Factory ──────────────────────────────────────────────────────────────────
// Swap this one line when the real API repository is ready:
//   import { OrgEventApiRepository } from '../repositories/org-event.api.repository'
//   return new OrgEventApiRepository()

function getRepository(): IOrgEventRepository {
  return new OrgEventMockRepository()
}

const repo = getRepository()

// ─── Service ──────────────────────────────────────────────────────────────────

export const orgEventService = {

  // Events
  getEvents(organizationId: string): Promise<OrgEvent[]> {
    return repo.getEvents(organizationId)
  },

  getEventById(eventId: string): Promise<OrgEvent | null> {
    return repo.getEventById(eventId)
  },

  getEventsByStatus(organizationId: string, status: OrgEventStatus): Promise<OrgEvent[]> {
    return repo.getEventsByStatus(organizationId, status)
  },

  // Volunteers / Approvals
  getVolunteers(organizationId: string): Promise<OrgVolunteer[]> {
    return repo.getVolunteers(organizationId)
  },

  getVolunteersByEvent(eventId: string): Promise<OrgVolunteer[]> {
    return repo.getVolunteersByEvent(eventId)
  },

  updateApprovalStatus(volunteerId: string, status: ApprovalStatus): Promise<OrgVolunteer> {
    return repo.updateApprovalStatus(volunteerId, status)
  },

  approveAll(eventId: string): Promise<OrgVolunteer[]> {
    return repo.approveAll(eventId)
  },

  // Check-in
  checkInVolunteer(volunteerId: string, method: 'qr' | 'manual'): Promise<OrgVolunteer> {
    return repo.checkInVolunteer(volunteerId, method)
  },

  // Rewards
  issueReward(volunteerId: string): Promise<OrgVolunteer> {
    return repo.issueReward(volunteerId)
  },

  issueAllRewards(eventId: string): Promise<OrgVolunteer[]> {
    return repo.issueAllRewards(eventId)
  },

  // Vendor deals
  getVendorDeals(organizationId: string): Promise<VendorDeal[]> {
    return repo.getVendorDeals(organizationId)
  },

  // Dashboard
  getDashboardStats(organizationId: string): Promise<OrgDashboardStats> {
    return repo.getDashboardStats(organizationId)
  },
}