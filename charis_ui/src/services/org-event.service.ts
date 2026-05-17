import type { IOrgEventRepository } from '../repositories/org-event.repository'
import type {
  OrgEvent,
  OrgVolunteer,
  VendorDeal,
  OrgDashboardStats,
  OrgEventStatus,
  ApprovalStatus,
} from '../models/types/org-event.types'
import { OrgEventApiRepository } from '../repositories/org-event.api.repository'

// ─── Factory ──────────────────────────────────────────────────────────────────
// To switch back to mock:
//   import { OrgEventMockRepository } from '../repositories/org-event.mock.repository'
//   return new OrgEventMockRepository()

function getRepository(): IOrgEventRepository {
  return new OrgEventApiRepository()
}

const repo = getRepository()

// ─── Service ──────────────────────────────────────────────────────────────────

export const orgEventService = {

  getEvents(organizationId: string): Promise<OrgEvent[]> {
    return repo.getEvents(organizationId)
  },

  getEventById(eventId: string): Promise<OrgEvent | null> {
    return repo.getEventById(eventId)
  },

  getEventsByStatus(organizationId: string, status: OrgEventStatus): Promise<OrgEvent[]> {
    return repo.getEventsByStatus(organizationId, status)
  },

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

  checkInVolunteer(volunteerId: string, method: 'qr' | 'manual'): Promise<OrgVolunteer> {
    return repo.checkInVolunteer(volunteerId, method)
  },

  issueReward(volunteerId: string): Promise<OrgVolunteer> {
    return repo.issueReward(volunteerId)
  },

  issueAllRewards(eventId: string): Promise<OrgVolunteer[]> {
    return repo.issueAllRewards(eventId)
  },

  getVendorDeals(organizationId: string): Promise<VendorDeal[]> {
    return repo.getVendorDeals(organizationId)
  },

  getDashboardStats(organizationId: string): Promise<OrgDashboardStats> {
    return repo.getDashboardStats(organizationId)
  },
}