import type {
  OrgEvent,
  OrgVolunteer,
  VendorDeal,
  OrgDashboardStats,
  OrgEventStatus,
  ApprovalStatus,
} from '../../models/types/org-event.types'

export interface IOrgEventRepository {

  // ─── Events ───────────────────────────────────────────────────────────────

  getEvents(organizationId: string): Promise<OrgEvent[]>

  getEventById(eventId: string): Promise<OrgEvent | null>

  getEventsByStatus(
    organizationId: string,
    status: OrgEventStatus
  ): Promise<OrgEvent[]>

  // ─── Volunteers / Approvals ───────────────────────────────────────────────

  getVolunteers(organizationId: string): Promise<OrgVolunteer[]>

  getVolunteersByEvent(eventId: string): Promise<OrgVolunteer[]>

  updateApprovalStatus(
    volunteerId: string,
    status: ApprovalStatus
  ): Promise<OrgVolunteer>

  approveAll(eventId: string): Promise<OrgVolunteer[]>

  // ─── Check-in ─────────────────────────────────────────────────────────────

  checkInVolunteer(
    volunteerId: string,
    method: 'qr' | 'manual'
  ): Promise<OrgVolunteer>

  // ─── Rewards ──────────────────────────────────────────────────────────────

  issueReward(volunteerId: string): Promise<OrgVolunteer>

  issueAllRewards(eventId: string): Promise<OrgVolunteer[]>

  // ─── Vendor deals ─────────────────────────────────────────────────────────

  getVendorDeals(organizationId: string): Promise<VendorDeal[]>

  // ─── Dashboard ────────────────────────────────────────────────────────────

  getDashboardStats(organizationId: string): Promise<OrgDashboardStats>
}