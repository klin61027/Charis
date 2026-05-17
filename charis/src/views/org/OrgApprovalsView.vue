<template>
  <div class="approvals-view">

    <!-- Topbar -->
    <div class="topbar">
      <div class="topbar-left">
        <span class="topbar-title">Volunteer approval</span>
        <span v-if="totalPending > 0" class="pending-badge">{{ totalPending }} pending</span>
      </div>
      <button
        v-if="totalPending > 0"
        class="btn-ghost"
        @click="approveAll"
      >
        Approve all
        <IconChecks :size="14" aria-hidden="true" />
      </button>
    </div>

    <!-- Sub-tabs -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: activeTab === tab.value }"
        @click="setTab(tab.value)"
      >
        <span
          v-if="tab.value === 'live'"
          class="live-dot"
          aria-hidden="true"
        ></span>
        {{ tab.label }}
        <span
          class="tab-count"
          :class="{ 'has-pending': counts[tab.value] > 0 }"
        >
          {{ counts[tab.value] }}
        </span>
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
      <div class="card">

        <!-- Table header -->
        <div class="table-head">
          <div class="col-vol">Volunteer</div>
          <div class="col-event">Event</div>
          <div class="col-evtstatus">Event status</div>
          <div class="col-status">Approve / Deny</div>
        </div>

        <!-- Volunteer rows -->
        <template v-if="filteredVolunteers.length > 0">
          <div
            v-for="vol in filteredVolunteers"
            :key="vol.id"
            class="vol-row"
            :class="{ resolved: vol.approvalStatus !== 'pending' }"
          >

            <!-- Volunteer -->
            <div class="col-vol">
              <div class="vol-avatar" :style="avatarStyle(vol.name)">
                {{ initials(vol.name) }}
              </div>
              <div class="vol-info">
                <div class="vol-name">{{ vol.name }}</div>
                <div class="vol-username">@{{ vol.username }}</div>
              </div>
            </div>

            <!-- Event -->
            <div class="col-event">
              <div class="event-title">{{ vol.eventTitle }}</div>
              <div class="event-meta">{{ vol.eventDate }} · {{ categoryLabel(vol.eventCategory) }}</div>
            </div>

            <!-- Event status -->
            <div class="col-evtstatus">
              <span class="evt-status-badge" :style="eventStatusStyle(vol.eventStatus)">
                {{ vol.eventStatus.charAt(0).toUpperCase() + vol.eventStatus.slice(1) }}
              </span>
            </div>

            <!-- Approval status + actions -->
            <div class="col-status">
              <template v-if="vol.approvalStatus === 'pending'">
                <span class="approval-badge pending">Pending</span>
                <div class="action-btns">
                  <button class="approve-btn" @click="approve(vol.id)">
                    <IconCheck :size="11" aria-hidden="true" />
                    Approve
                  </button>
                  <button class="decline-btn" @click="decline(vol.id)">
                    <IconX :size="11" aria-hidden="true" />
                    Decline
                  </button>
                </div>
              </template>
              <template v-else-if="vol.approvalStatus === 'approved'">
                <span class="approval-badge approved">Approved</span>
              </template>
              <template v-else>
                <span class="approval-badge declined">Declined</span>
              </template>
            </div>

          </div>
        </template>

        <!-- Empty -->
        <div v-else class="empty-state">
          <IconUserCheck :size="28" class="empty-icon" aria-hidden="true" />
          <p>No volunteers in this filter</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {
  IconChecks,
  IconCheck,
  IconX,
  IconLoader2,
  IconAlertCircle,
  IconUserCheck,
} from '@tabler/icons-vue'
import { useOrgApprovals } from '../../viewmodels/useOrgApprovals'
import type { OrgEventStatus } from '../../models/types/org-event.types'
import type { EventCategory } from '../../models/types/event.types'

const {
  isLoading,
  error,
  activeTab,
  filteredVolunteers,
  counts,
  totalPending,
  setTab,
  approve,
  decline,
  approveAll,
} = useOrgApprovals()

// ─── Tabs ─────────────────────────────────────────────────────────────────

const tabs: { value: 'all' | 'live' | 'upcoming'; label: string }[] = [
  { value: 'all',      label: 'All events' },
  { value: 'live',     label: 'Now'        },
  { value: 'upcoming', label: 'Upcoming'   },
]

// ─── Style helpers ────────────────────────────────────────────────────────

const avatarColors     = ['#c9920e18', '#2563eb12', '#a78bfa22', '#34d39922']
const avatarTextColors = ['#c9920e',   '#2563eb',   '#7c5cbf',   '#0d9e6e'  ]

function avatarStyle(name: string) {
  const idx = name.charCodeAt(0) % avatarColors.length
  return { background: avatarColors[idx], color: avatarTextColors[idx] }
}

function initials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const categoryLabels: Record<EventCategory, string> = {
  volunteer:  'Volunteer',
  community:  'Community',
  fundraiser: 'Fundraiser',
  workshop:   'Workshop',
}
function categoryLabel(cat: EventCategory) {
  return categoryLabels[cat] ?? cat
}

const eventStatusStyles: Record<OrgEventStatus, { color: string; background: string }> = {
  live:     { color: '#0d9e6e', background: '#34d39922' },
  upcoming: { color: '#2563eb', background: '#2563eb12' },
  draft:    { color: '#6b6b72', background: '#e2e0d8'   },
  past:     { color: '#a0a0a8', background: '#f0ede8'   },
}
function eventStatusStyle(status: OrgEventStatus) {
  return eventStatusStyles[status]
}
</script>

<style scoped>
.approvals-view {
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

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topbar-title {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.pending-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
  background: #f59e0b22;
  color: #b37400;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  color: #6b6b72;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 400;
  padding: 6px 12px;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.15s;
}
.btn-ghost:hover { background: #f0ede8; }

/* ─── Tab bar ───────────────────────────────────────────────────────────── */

.tab-bar {
  background: #ffffff;
  border-bottom: 0.5px solid #e2e0d8;
  padding: 0 26px;
  display: flex;
  gap: 0;
  flex-shrink: 0;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 18px 10px;
  font-size: 12px;
  color: #6b6b72;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-main);
  transition: color 0.15s, border-color 0.15s;
}

.tab.active {
  font-weight: 500;
  color: var(--ch-blue);
  border-bottom-color: var(--ch-blue);
}

.tab-count {
  font-size: 10px;
  font-weight: 500;
  padding: 1px 7px;
  border-radius: var(--r-pill);
  background: #f0ede8;
  color: #a0a0a8;
}

.tab-count.has-pending {
  background: #f59e0b22;
  color: #b37400;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
}

/* ─── Content ───────────────────────────────────────────────────────────── */

.content { padding: 20px 26px; }

/* ─── Card ──────────────────────────────────────────────────────────────── */

.card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: 18px;
  overflow: hidden;
}

/* ─── Table header ──────────────────────────────────────────────────────── */

.table-head {
  display: grid;
  grid-template-columns: 220px 1fr 130px 260px;
  gap: 8px;
  padding: 9px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  font-size: 10px;
  font-weight: 500;
  color: #a0a0a8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* ─── Volunteer row ─────────────────────────────────────────────────────── */

.vol-row {
  display: grid;
  grid-template-columns: 220px 1fr 130px 260px;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  align-items: center;
  transition: background 0.12s;
}
.vol-row:last-child { border-bottom: none; }
.vol-row:hover { background: #f8f7f5; }
.vol-row.resolved { opacity: 0.45; }

/* ─── Volunteer col ─────────────────────────────────────────────────────── */

.col-vol {
  display: flex;
  align-items: center;
  gap: 9px;
}

.vol-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
}

.vol-name {
  font-size: 12px;
  color: #1a1a1a;
  font-weight: 400;
}

.vol-username {
  font-size: 10px;
  color: #a0a0a8;
}

/* ─── Event col ─────────────────────────────────────────────────────────── */

.event-title {
  font-size: 12px;
  color: #1a1a1a;
}

.event-meta {
  font-size: 10px;
  color: #a0a0a8;
  margin-top: 1px;
}

/* ─── Event status badge ────────────────────────────────────────────────── */

.evt-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
}

/* ─── Approval status + actions ─────────────────────────────────────────── */

.col-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.approval-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
}
.approval-badge.pending  { background: #f59e0b22; color: #b37400; }
.approval-badge.approved { background: #34d39922; color: #0d9e6e; }
.approval-badge.declined { background: #e2e0d8;   color: #6b6b72; }

.action-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.approve-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  border-radius: 7px;
  border: 0.5px solid #34d399;
  background: transparent;
  color: #0d9e6e;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.12s;
}
.approve-btn:hover { background: #34d39915; }

.decline-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  border-radius: 7px;
  border: 0.5px solid #e2e0d8;
  background: transparent;
  color: #a0a0a8;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.12s;
}
.decline-btn:hover { background: #f0ede8; }

/* ─── Empty / loading / error ───────────────────────────────────────────── */

.empty-state {
  padding: 48px 20px;
  text-align: center;
  color: #a0a0a8;
  font-size: 13px;
}
.empty-icon {
  display: block;
  margin: 0 auto 10px;
  opacity: 0.3;
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