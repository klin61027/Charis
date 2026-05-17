<template>
  <div class="checkin-view">

    <!-- Topbar -->
    <div class="topbar">
      <div class="topbar-left">
        <button class="back-btn" aria-label="Back to events" @click="goBack">
          <IconArrowLeft :size="16" aria-hidden="true" />
        </button>
        <div class="event-heading">
          <div class="topbar-title">{{ event?.title ?? 'Check-in' }}</div>
          <div class="event-meta" v-if="event">
            <IconMapPin :size="11" aria-hidden="true" />
            {{ event.location }} · {{ event.date }}, {{ event.time }}
          </div>
        </div>
        <span class="live-badge">Live</span>
      </div>
      <button class="btn-end" @click="goBack">End event</button>
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
        {{ tab.label }}
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

    <!-- Check-in tab -->
    <div v-else-if="activeTab === 'checkin'" class="content">

      <!-- Stats row -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Checked in</div>
          <div class="stat-value green">{{ checkedInCount }}</div>
          <div class="stat-sub">of {{ approvedCount }} approved</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Not yet arrived</div>
          <div class="stat-value">{{ notArrivedCount }}</div>
          <div class="stat-sub">approved volunteers</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Rewards issued</div>
          <div class="stat-value amber">{{ rewardsIssuedCount }}</div>
          <div class="stat-sub">of {{ checkedInCount }} checked in</div>
        </div>
      </div>

      <!-- Reward + quick actions row -->
      <div class="top-row">

        <!-- Reward attached -->
        <div class="card reward-card">
          <div class="card-header">
            <span class="card-title">Reward attached</span>
            <button class="btn-ghost sm">Change</button>
          </div>
          <div class="reward-body" v-if="deal">
            <div class="reward-vendor">
              <div class="vendor-icon">
                <IconBuildingStore :size="18" aria-hidden="true" />
              </div>
              <div>
                <div class="vendor-name">{{ deal.businessName }}</div>
                <div class="vendor-deal">{{ deal.dealDescription }} · issued automatically on check-in</div>
              </div>
            </div>
            <div class="reward-progress">
              <div class="progress-labels">
                <span class="progress-lbl">Redemption progress</span>
                <span class="progress-val">{{ deal.redeemedCount }} / {{ deal.totalCount }} used</span>
              </div>
              <div class="fill-bar-track">
                <div class="fill-bar-fill" :style="dealBarStyle"></div>
              </div>
              <div class="progress-sub">{{ deal.totalCount - deal.redeemedCount }} remaining · Expires {{ deal.expiryDate }}</div>
            </div>
          </div>
          <div class="reward-body no-deal" v-else>
            <IconGiftOff :size="20" class="no-deal-icon" aria-hidden="true" />
            <span>No reward attached to this event</span>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="card actions-card">
          <div class="card-header">
            <span class="card-title">Quick actions</span>
          </div>
          <div class="actions-list">
            <button class="action-row" @click="triggerScanQR">
              <IconQrcode :size="16" class="action-icon blue" aria-hidden="true" />
              Scan QR code
            </button>
            <button class="action-row">
              <IconSend :size="16" class="action-icon" aria-hidden="true" />
              Message all volunteers
            </button>
            <button class="action-row gold" @click="issueAllRewards">
              <IconGift :size="16" class="action-icon gold" aria-hidden="true" />
              Issue all rewards now
            </button>
          </div>
        </div>

      </div>

      <!-- Volunteers table -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Volunteers</span>
          <div class="search-wrap">
            <IconSearch :size="12" class="search-icon" aria-hidden="true" />
            <input
              v-model="search"
              class="search-input"
              placeholder="Search volunteer…"
              aria-label="Search volunteers"
            />
          </div>
        </div>

        <!-- Table head -->
        <div class="table-head">
          <div class="col-name">Name</div>
          <div class="col-checkin">Check-in</div>
          <div class="col-reward">Issue reward</div>
        </div>

        <!-- Rows -->
        <div
          v-for="vol in filteredVolunteers"
          :key="vol.id"
          class="vol-row"
          :class="{ 'not-arrived': !vol.checkedIn }"
        >
          <!-- Name -->
          <div class="col-name">
            <div class="vol-avatar" :style="avatarStyle(vol.name, vol.checkedIn)">
              {{ initials(vol.name) }}
            </div>
            <span class="vol-name">{{ vol.name }}</span>
          </div>

          <!-- Check-in -->
          <div class="col-checkin">
            <button
              v-if="!vol.checkedIn"
              class="checkin-btn"
              @click="openCheckinModal(vol)"
            >
              <IconScan :size="13" aria-hidden="true" />
              Check in
            </button>
            <span v-else class="checkin-done">
              <IconCircleCheck :size="13" aria-hidden="true" />
              Checked in · {{ vol.checkedInAt }}
            </span>
          </div>

          <!-- Issue reward -->
          <div class="col-reward">
            <button
              v-if="vol.checkedIn && !vol.rewardIssued"
              class="reward-btn"
              @click="issueReward(vol.id)"
            >
              <IconGift :size="13" aria-hidden="true" />
              Issue reward
            </button>
            <span v-else-if="vol.rewardIssued" class="reward-done">
              <IconCircleCheck :size="13" aria-hidden="true" />
              Issued
            </span>
            <span v-else class="reward-disabled">
              <IconGift :size="13" aria-hidden="true" />
              Issue reward
            </span>
          </div>

        </div>

        <div v-if="filteredVolunteers.length === 0" class="empty-state">
          No volunteers found
        </div>
      </div>
    </div>

    <!-- Rewards tab placeholder -->
    <div v-else-if="activeTab === 'rewards'" class="content">
      <div class="placeholder-tab">
        <IconGift :size="28" aria-hidden="true" />
        <p>Rewards tab — coming soon</p>
      </div>
    </div>

    <!-- Details tab placeholder -->
    <div v-else-if="activeTab === 'details'" class="content">
      <div class="placeholder-tab">
        <IconInfoCircle :size="28" aria-hidden="true" />
        <p>Event details — coming soon</p>
      </div>
    </div>

    <!-- Check-in method overlay -->
    <Transition name="overlay">
      <div
        v-if="showCheckinModal && selectedVolunteer"
        class="overlay"
        @click.self="closeCheckinModal"
      >
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Check in volunteer</div>
            <div class="modal-sub">{{ selectedVolunteer.name }} · {{ selectedVolunteer.eventTitle }}</div>
          </div>
          <div class="modal-options">
            <button class="modal-option" @click="confirmCheckin('qr')">
              <IconQrcode :size="24" class="option-icon blue" aria-hidden="true" />
              <div class="option-label">QR code</div>
              <div class="option-desc">Scan volunteer's unique ticket</div>
            </button>
            <button class="modal-option" @click="confirmCheckin('manual')">
              <IconUserCheck :size="24" class="option-icon" aria-hidden="true" />
              <div class="option-label">Manual</div>
              <div class="option-desc">Confirm in person, no scan</div>
            </button>
          </div>
          <div class="modal-footer">
            <button class="modal-cancel" @click="closeCheckinModal">Cancel</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  IconArrowLeft,
  IconMapPin,
  IconLoader2,
  IconAlertCircle,
  IconBuildingStore,
  IconQrcode,
  IconSend,
  IconGift,
  IconGiftOff,
  IconSearch,
  IconScan,
  IconCircleCheck,
  IconUserCheck,
  IconInfoCircle,
} from '@tabler/icons-vue'
import { useOrgCheckin } from '../../viewmodels/useOrgCheckin'

const route   = useRoute()
const eventId = route.params.eventId as string

const {
  isLoading,
  error,
  search,
  activeTab,
  showCheckinModal,
  selectedVolunteer,
  deal,
  event,
  filteredVolunteers,
  checkedInCount,
  notArrivedCount,
  rewardsIssuedCount,
  setTab,
  openCheckinModal,
  closeCheckinModal,
  confirmCheckin,
  issueReward,
  issueAllRewards,
  goBack,
} = useOrgCheckin(eventId)

// ─── Tabs ─────────────────────────────────────────────────────────────────

const tabs = [
  { value: 'checkin' as const, label: 'Check-in' },
  { value: 'rewards' as const, label: 'Rewards'  },
  { value: 'details' as const, label: 'Details'  },
]

// ─── Derived ──────────────────────────────────────────────────────────────

const approvedCount = computed(() =>
  filteredVolunteers.value.filter(v => v.approvalStatus === 'approved').length
)

const dealBarStyle = computed(() => {
  if (!deal.value) return {}
  const pct = Math.min((deal.value.redeemedCount / deal.value.totalCount) * 100, 100)
  return { width: `${pct}%`, background: '#c9920e' }
})

// ─── Style helpers ────────────────────────────────────────────────────────

const avatarColors     = ['#c9920e18', '#2563eb12', '#a78bfa22', '#34d39922']
const avatarTextColors = ['#c9920e',   '#2563eb',   '#7c5cbf',   '#0d9e6e'  ]

const checkedInBg   = '#34d39922'
const checkedInText = '#0d9e6e'

function avatarStyle(name: string, checkedIn: boolean) {
  if (checkedIn) return { background: checkedInBg, color: checkedInText }
  const idx = name.charCodeAt(0) % avatarColors.length
  return { background: '#f0ede8', color: '#a0a0a8' }
}

function initials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function triggerScanQR() {
  // TODO: open device camera for QR scan
  console.warn('QR scan triggered')
}
</script>

<style scoped>
.checkin-view {
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
  padding: 12px 26px;
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

.back-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b6b72;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: color 0.12s;
}
.back-btn:hover { color: #1a1a1a; }

.topbar-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #6b6b72;
  margin-top: 1px;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
  background: #34d39922;
  color: #0d9e6e;
}

.btn-end {
  padding: 6px 14px;
  border-radius: var(--r-pill);
  border: none;
  background: #e24b4a;
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: opacity 0.15s;
}
.btn-end:hover { opacity: 0.88; }

/* ─── Tab bar ───────────────────────────────────────────────────────────── */

.tab-bar {
  background: #ffffff;
  border-bottom: 0.5px solid #e2e0d8;
  padding: 0 26px;
  display: flex;
  flex-shrink: 0;
}

.tab {
  padding: 11px 16px 10px;
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

/* ─── Content ───────────────────────────────────────────────────────────── */

.content { padding: 20px 26px; }

/* ─── Stats ─────────────────────────────────────────────────────────────── */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 14px;
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
.stat-value.green { color: #0d9e6e; }
.stat-value.amber { color: #c9920e; }

.stat-sub {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 2px;
}

/* ─── Top row ───────────────────────────────────────────────────────────── */

.top-row {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 12px;
  margin-bottom: 14px;
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

.card-title {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
}

.btn-ghost {
  background: transparent;
  color: #6b6b72;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-pill);
  font-size: 11px;
  padding: 4px 10px;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.15s;
}
.btn-ghost:hover { background: #f0ede8; }
.btn-ghost.sm { font-size: 10px; padding: 3px 9px; }

/* ─── Reward card ───────────────────────────────────────────────────────── */

.reward-body { padding: 16px; }

.reward-vendor {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.vendor-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--ch-gold-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ch-gold);
  flex-shrink: 0;
}

.vendor-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.vendor-deal {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 1px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.progress-lbl { font-size: 11px; color: #6b6b72; }
.progress-val { font-size: 11px; font-weight: 500; color: #1a1a1a; }

.fill-bar-track {
  height: 4px;
  background: #f0ede8;
  border-radius: 2px;
  overflow: hidden;
}

.fill-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-sub {
  font-size: 10px;
  color: #a0a0a8;
  margin-top: 5px;
}

.no-deal {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a0a0a8;
  font-size: 12px;
}
.no-deal-icon { opacity: 0.4; }

/* ─── Quick actions card ────────────────────────────────────────────────── */

.actions-list {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.action-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 12px;
  background: #f8f7f5;
  border: 0.5px solid #e2e0d8;
  border-radius: 10px;
  font-size: 11px;
  color: #1a1a1a;
  cursor: pointer;
  font-family: var(--font-main);
  text-align: left;
  transition: background 0.12s;
}
.action-row:hover { background: #f0ede8; }
.action-row.gold { color: var(--ch-gold); border-color: #c9920e33; background: #c9920e08; }
.action-row.gold:hover { background: #c9920e14; }

.action-icon { color: #6b6b72; }
.action-icon.blue { color: var(--ch-blue); }
.action-icon.gold { color: var(--ch-gold); }

/* ─── Volunteers table ──────────────────────────────────────────────────── */

.search-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f7f5;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 5px 10px;
}

.search-icon { color: #a0a0a8; }

.search-input {
  border: none;
  background: transparent;
  font-size: 11px;
  color: #1a1a1a;
  font-family: var(--font-main);
  outline: none;
  width: 140px;
}
.search-input::placeholder { color: #a0a0a8; }

.table-head {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  font-size: 10px;
  font-weight: 500;
  color: #a0a0a8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.vol-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  align-items: center;
  transition: background 0.12s;
}
.vol-row:last-child { border-bottom: none; }
.vol-row:hover { background: #f8f7f5; }
.vol-row.not-arrived { opacity: 0.5; }

.col-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vol-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 500;
  flex-shrink: 0;
}

.vol-name { font-size: 12px; color: #1a1a1a; }

/* ─── Check-in button states ────────────────────────────────────────────── */

.checkin-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 0.5px solid #2563eb44;
  background: transparent;
  color: var(--ch-blue);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.12s;
}
.checkin-btn:hover { background: var(--ch-blue-soft); }

.checkin-done {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 0.5px solid #34d39966;
  background: #34d39910;
  color: #0d9e6e;
  font-size: 10px;
  font-weight: 500;
}

/* ─── Reward button states ──────────────────────────────────────────────── */

.reward-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 0.5px solid #c9920e44;
  background: transparent;
  color: var(--ch-gold);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.12s;
}
.reward-btn:hover { background: var(--ch-gold-soft); }

.reward-done {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 0.5px solid #34d39966;
  background: #34d39910;
  color: #0d9e6e;
  font-size: 10px;
  font-weight: 500;
}

.reward-disabled {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 0.5px solid #c9920e44;
  color: var(--ch-gold);
  font-size: 10px;
  font-weight: 500;
  opacity: 0.3;
}

/* ─── Empty ─────────────────────────────────────────────────────────────── */

.empty-state {
  padding: 32px 16px;
  text-align: center;
  font-size: 12px;
  color: #a0a0a8;
}

/* ─── Placeholder tabs ──────────────────────────────────────────────────── */

.placeholder-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 60px 20px;
  color: #a0a0a8;
  font-size: 13px;
}

/* ─── Loading / error ───────────────────────────────────────────────────── */

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

/* ─── Overlay / modal ───────────────────────────────────────────────────── */

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: #ffffff;
  border-radius: 16px;
  border: 0.5px solid #e2e0d8;
  width: 300px;
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 0.5px solid #e2e0d8;
}

.modal-title {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.modal-sub {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 2px;
}

.modal-options {
  padding: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.modal-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 14px 10px;
  border-radius: 12px;
  border: 0.5px solid #e2e0d8;
  background: #f8f7f5;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.12s;
}
.modal-option:hover { background: #f0ede8; }

.option-icon { color: #6b6b72; }
.option-icon.blue { color: var(--ch-blue); }

.option-label {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
}

.option-desc {
  font-size: 10px;
  color: #a0a0a8;
  text-align: center;
  line-height: 1.4;
}

.modal-footer {
  padding: 0 14px 14px;
}

.modal-cancel {
  width: 100%;
  padding: 8px;
  border-radius: var(--r-pill);
  border: 0.5px solid #e2e0d8;
  background: transparent;
  font-size: 11px;
  color: #a0a0a8;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.15s;
}
.modal-cancel:hover { background: #f0ede8; }

/* ─── Overlay transition ────────────────────────────────────────────────── */

.overlay-enter-active, .overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>