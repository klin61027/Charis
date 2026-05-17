<template>
  <div class="dashboard">

    <!-- Topbar -->
    <div class="topbar">
      <div class="topbar-title">Dashboard</div>
      <button class="btn-primary" @click="navigateToNewEvent">
        <IconPlus :size="14" aria-hidden="true" />
        New event
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-state">
      <IconLoader2 :size="24" class="spin" aria-hidden="true" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <IconAlertCircle :size="20" aria-hidden="true" />
      {{ error }}
    </div>

    <!-- Content -->
    <div v-else class="content">

      <!-- Stats row -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Volunteers</div>
          <div class="stat-value">{{ stats?.totalVolunteers ?? 0 }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active events</div>
          <div class="stat-value">{{ stats?.activeEvents ?? 0 }}</div>
          <div class="stat-sub">{{ stats?.upcomingCount ?? 0 }} upcoming · {{ stats?.liveCount ?? 0 }} live</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending approval</div>
          <div class="stat-value" :class="{ 'val-amber': (stats?.pendingApprovals ?? 0) > 0 }">
            {{ stats?.pendingApprovals ?? 0 }}
          </div>
          <div class="stat-sub">registrations to review</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Vendor deals</div>
          <div class="stat-value">{{ stats?.vendorDeals ?? 0 }}</div>
          <div class="stat-sub">{{ stats?.vendorTotalRedeemed ?? 0 }} redeemed total</div>
        </div>
      </div>

      <!-- Vendor deals -->
      <div class="card mb-14">
        <div class="card-header">
          <span class="card-title">Vendor deals</span>
          <div class="card-header-right">
            <span class="muted-text">{{ stats?.vendorTotalRedeemed ?? 0 }} of {{ totalDealCount }} redeemed</span>
            <button class="btn-ghost sm">
              <IconPlus :size="12" aria-hidden="true" />
              Add deal
            </button>
          </div>
        </div>
        <div class="vendor-grid">
          <div
            v-for="deal in deals"
            :key="deal.id"
            class="vendor-item"
          >
            <div class="vendor-name">{{ deal.businessName }}</div>
            <div class="vendor-deal">{{ deal.dealDescription }}</div>
            <div class="fill-bar-track">
              <div
                class="fill-bar-fill"
                :style="dealBarStyle(deal)"
              ></div>
            </div>
            <div class="vendor-footer">
              <span class="muted-text">Expires {{ deal.expiryDate }}</span>
              <span class="vendor-count">{{ deal.redeemedCount }} / {{ deal.totalCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Events + Approvals row -->
      <div class="two-col">

        <!-- Events -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Events</span>
            <button class="card-link" @click="navigateToEvents">View all</button>
          </div>
          <div class="scroll-list">
            <div
              v-for="event in events"
              :key="event.id"
              class="list-row"
              @click="event.status === 'live' ? navigateToCheckin(event.id) : undefined"
            >
              <div class="event-dot" :style="{ background: categoryColor(event.category) }"></div>
              <div class="list-row-info">
                <div class="list-row-title">{{ event.title }}</div>
                <div class="list-row-sub">{{ event.date }} · {{ event.location }}</div>
              </div>
              <span class="status-badge" :style="statusBadgeStyle(event.status)">
                {{ statusLabel(event.status) }}
              </span>
              <button class="icon-btn" aria-label="More options" @click.stop>
                <IconDots :size="14" aria-hidden="true" />
              </button>
            </div>
            <div v-if="events.length === 0" class="empty-list">No events yet</div>
          </div>
        </div>

        <!-- Volunteer approvals -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-left">
              <span class="card-title">Volunteer approval</span>
              <span v-if="pendingVolunteers.length > 0" class="pending-badge">
                {{ pendingVolunteers.length }} pending
              </span>
            </div>
            <button class="card-link" @click="navigateToApprovals">View all</button>
          </div>
          <div class="scroll-list">
            <div
              v-for="vol in pendingVolunteers"
              :key="vol.id"
              class="list-row"
            >
              <div class="vol-avatar" :style="avatarStyle(vol.name)">
                {{ initials(vol.name) }}
              </div>
              <div class="list-row-info">
                <div class="list-row-title">{{ vol.name }}</div>
                <div class="list-row-sub">{{ vol.eventTitle }}</div>
              </div>

              <!-- Context menu trigger -->
              <div class="context-wrap">
                <button
                  class="icon-btn"
                  aria-label="Actions"
                  @click.stop="toggleMenu(vol.id)"
                >
                  <IconDots :size="14" aria-hidden="true" />
                </button>
                <div v-if="openMenuId === vol.id" class="context-menu">
                  <button class="context-item approve" @click="approveVolunteer(vol.id)">
                    <IconCheck :size="13" aria-hidden="true" />
                    Approve
                  </button>
                  <button class="context-item decline" @click="declineVolunteer(vol.id)">
                    <IconX :size="13" aria-hidden="true" />
                    Decline
                  </button>
                </div>
              </div>

            </div>
            <div v-if="pendingVolunteers.length === 0" class="empty-list">
              No pending approvals
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IconPlus,
  IconDots,
  IconCheck,
  IconX,
  IconLoader2,
  IconAlertCircle,
} from '@tabler/icons-vue'
import { useOrgDashboard } from '../../viewmodels/useOrgDashboard'
import type { OrgEventStatus } from '../../models/types/org-event.types'
import type { EventCategory } from '../../models/types/event.types'
import type { VendorDeal } from '../../models/types/org-event.types'

const {
  isLoading,
  error,
  stats,
  events,
  deals,
  pendingVolunteers,
  approveVolunteer,
  declineVolunteer,
  navigateToEvents,
  navigateToApprovals,
  navigateToCheckin,
  navigateToNewEvent,
} = useOrgDashboard()

// ─── Context menu ─────────────────────────────────────────────────────────
const openMenuId = ref<string | null>(null)

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

// Close menu when clicking outside
function handleApprove(id: string) {
  approveVolunteer(id)
  openMenuId.value = null
}

function handleDecline(id: string) {
  declineVolunteer(id)
  openMenuId.value = null
}

// ─── Style helpers ────────────────────────────────────────────────────────

const totalDealCount = ref(0)

const categoryColors: Record<EventCategory, string> = {
  volunteer:  '#a78bfa',
  community:  '#34d399',
  fundraiser: '#f59e0b',
  workshop:   '#2563eb',
}

function categoryColor(cat: EventCategory) {
  return categoryColors[cat] ?? '#a0a0a8'
}

const statusLabels: Record<OrgEventStatus, string> = {
  live:     'Live',
  upcoming: 'Upcoming',
  draft:    'Draft',
  past:     'Past',
}

const statusStyles: Record<OrgEventStatus, { color: string; background: string }> = {
  live:     { color: '#0d9e6e', background: '#34d39922' },
  upcoming: { color: '#2563eb', background: '#2563eb12' },
  draft:    { color: '#6b6b72', background: '#e2e0d8'   },
  past:     { color: '#a0a0a8', background: '#f0ede8'   },
}

function statusLabel(s: OrgEventStatus) { return statusLabels[s] }
function statusBadgeStyle(s: OrgEventStatus) { return statusStyles[s] }

const avatarColors = ['#c9920e18', '#2563eb12', '#a78bfa22', '#34d39922']
const avatarTextColors = ['#c9920e', '#2563eb', '#7c5cbf', '#0d9e6e']

function avatarStyle(name: string) {
  const idx = name.charCodeAt(0) % avatarColors.length
  return { background: avatarColors[idx], color: avatarTextColors[idx] }
}

function initials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function dealBarStyle(deal: VendorDeal) {
  const pct = Math.min((deal.redeemedCount / deal.totalCount) * 100, 100)
  const color = pct >= 80 ? '#0d9e6e' : pct >= 40 ? '#c9920e' : '#2563eb'
  return { width: `${pct}%`, background: color }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f7f5;
  font-family: var(--font-main);
}

/* ─── Topbar ────────────────────────────────────────────────────────────── */

.topbar {
  background: #ffffff;
  border-bottom: 0.5px solid #e2e0d8;
  padding: 13px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.topbar-title {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

/* ─── Buttons ───────────────────────────────────────────────────────────── */

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: var(--r-pill);
  border: none;
  background: var(--ch-blue);
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.88; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  color: #6b6b72;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-pill);
  font-size: 12px;
  cursor: pointer;
  font-family: var(--font-main);
  padding: 6px 12px;
  transition: background 0.15s;
}
.btn-ghost:hover { background: #f0ede8; }
.btn-ghost.sm { padding: 4px 10px; font-size: 11px; }

.card-link {
  font-size: 12px;
  color: var(--ch-blue);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-main);
  padding: 0;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #a0a0a8;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color 0.12s, background 0.12s;
}
.icon-btn:hover { color: var(--ch-blue); background: var(--ch-blue-soft); }

/* ─── Content ───────────────────────────────────────────────────────────── */

.content { padding: 22px 26px; }
.mb-14 { margin-bottom: 14px; }

/* ─── Stats ─────────────────────────────────────────────────────────────── */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}

.stat-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: 14px;
  padding: 13px 14px;
}

.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: #a0a0a8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.4px;
}
.stat-value.val-amber { color: #b37400; }

.stat-sub {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 2px;
}

/* ─── Cards ─────────────────────────────────────────────────────────────── */

.card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: 18px;
  overflow: hidden;
}

.card-header {
  padding: 12px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-title {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
}

.muted-text {
  font-size: 10px;
  color: #a0a0a8;
}

/* ─── Vendor grid ───────────────────────────────────────────────────────── */

.vendor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.vendor-item {
  padding: 14px 16px;
  border-right: 0.5px solid #e2e0d8;
}
.vendor-item:last-child { border-right: none; }

.vendor-name {
  font-size: 11px;
  color: #6b6b72;
}

.vendor-deal {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  margin-top: 2px;
}

.fill-bar-track {
  height: 3px;
  background: #f0ede8;
  border-radius: 2px;
  overflow: hidden;
  margin: 7px 0 4px;
}

.fill-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.vendor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vendor-count {
  font-size: 10px;
  font-weight: 500;
  color: #1a1a1a;
}

/* ─── Two col ───────────────────────────────────────────────────────────── */

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ─── Scroll list ───────────────────────────────────────────────────────── */

.scroll-list {
  max-height: 240px;
  overflow-y: auto;
}
.scroll-list::-webkit-scrollbar { width: 3px; }
.scroll-list::-webkit-scrollbar-thumb { background: #e2e0d8; border-radius: 3px; }

.list-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  cursor: default;
}
.list-row:last-child { border-bottom: none; }
.list-row:hover { background: #f8f7f5; }

.event-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.list-row-info {
  flex: 1;
  min-width: 0;
}

.list-row-title {
  font-size: 12px;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-row-sub {
  font-size: 10px;
  color: #a0a0a8;
  margin-top: 1px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
}

/* ─── Volunteer list ────────────────────────────────────────────────────── */

.vol-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
}

.pending-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
  background: #f59e0b22;
  color: #b37400;
}

/* ─── Context menu ──────────────────────────────────────────────────────── */

.context-wrap {
  position: relative;
  flex-shrink: 0;
}

.context-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 4px;
  min-width: 120px;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.context-item {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 7px 10px;
  border-radius: 7px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-family: var(--font-main);
  cursor: pointer;
  color: #1a1a1a;
  transition: background 0.12s;
}
.context-item:hover { background: #f0ede8; }
.context-item.approve { color: #0d9e6e; }
.context-item.decline { color: #e24b4a; }

/* ─── Empty / loading / error ───────────────────────────────────────────── */

.empty-list {
  padding: 24px 16px;
  text-align: center;
  font-size: 12px;
  color: #a0a0a8;
}

.loading-state, .error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  font-size: 13px;
  color: #a0a0a8;
}

.error-state { color: #e24b4a; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }
</style>