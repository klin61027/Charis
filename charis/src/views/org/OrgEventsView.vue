<template>
  <div class="events-view">

    <!-- Topbar -->
    <div class="topbar">
      <div class="topbar-title">Events</div>
      <div class="topbar-right">
        <div class="search-wrap">
          <IconSearch :size="13" class="search-icon" aria-hidden="true" />
          <input
            v-model="search"
            class="search-input"
            placeholder="Search events…"
            aria-label="Search events"
          />
        </div>
        <button class="btn-primary" @click="navigateToNewEvent">
          <IconPlus :size="14" aria-hidden="true" />
          New event
        </button>
      </div>
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

      <!-- Filter pills -->
      <div class="filter-row">
        <button
          v-for="f in filters"
          :key="f.value"
          class="pill"
          :class="{ active: activeFilter === f.value }"
          @click="setFilter(f.value)"
        >
          <span
            v-if="f.value === 'live'"
            class="live-dot"
            aria-hidden="true"
          ></span>
          {{ f.label }}
          <span v-if="counts[f.value] > 0" class="pill-count">
            {{ counts[f.value] }}
          </span>
        </button>
      </div>

      <!-- Events card -->
      <div class="card">

        <!-- Live event pinned banner -->
        <div
          v-if="liveEvent && (activeFilter === 'all' || activeFilter === 'live')"
          class="live-banner"
        >
          <div class="live-banner-left">
            <span class="live-badge">Live now</span>
            <div>
              <div class="live-title">{{ liveEvent.title }}</div>
              <div class="live-meta">
                <IconMapPin :size="11" aria-hidden="true" />
                {{ liveEvent.location }} · {{ liveEvent.date }}, {{ liveEvent.time }}
              </div>
            </div>
          </div>
          <div class="live-banner-right">
            <span class="live-checkin-count">{{ liveEvent.checkedInCount }} checked in</span>
            <button class="btn-checkin" @click="navigateToCheckin(liveEvent)">
              Open check-in
              <IconArrowRight :size="13" aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- Table header -->
        <div class="table-head">
          <div class="col-event">Event</div>
          <div class="col-date">Date</div>
          <div class="col-cat">Category</div>
          <div class="col-reg">Registered</div>
          <div class="col-status">Status</div>
          <div class="col-actions"></div>
        </div>

        <!-- Rows -->
        <OrgEventRow
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          @open-checkin="navigateToCheckin"
          @edit="handleEdit"
          @more="handleMore"
        />

        <!-- Empty -->
        <div v-if="filteredEvents.length === 0" class="empty-state">
          <IconCalendarOff :size="28" class="empty-icon" aria-hidden="true" />
          <p>No events match this filter</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconSearch,
  IconPlus,
  IconLoader2,
  IconAlertCircle,
  IconMapPin,
  IconArrowRight,
  IconCalendarOff,
} from '@tabler/icons-vue'
import OrgEventRow from '../../components/org/OrgEventRow.vue'
import { useOrgEvents } from '../../viewmodels/useOrgEvents'
import type { OrgEvent } from '../../models/types/org-event.types'

const {
  isLoading,
  error,
  search,
  activeFilter,
  filteredEvents,
  liveEvent,
  counts,
  setFilter,
  navigateToCheckin,
  navigateToNewEvent,
} = useOrgEvents()

const filters: { value: 'all' | 'live' | 'upcoming' | 'draft' | 'past'; label: string }[] = [
  { value: 'all',      label: 'All'      },
  { value: 'live',     label: 'Live'     },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'draft',    label: 'Draft'    },
  { value: 'past',     label: 'Past'     },
]

function handleEdit(id: string) {
  // TODO: navigate to edit event view
  console.warn('Edit event:', id)
}

function handleMore(id: string) {
  // TODO: open event options sheet
  console.warn('More options for event:', id)
}
</script>

<style scoped>
.events-view {
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

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ─── Search ────────────────────────────────────────────────────────────── */

.search-wrap {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #f8f7f5;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 6px 12px;
}

.search-icon { color: #a0a0a8; }

.search-input {
  border: none;
  background: transparent;
  font-size: 12px;
  color: #1a1a1a;
  font-family: var(--font-main);
  outline: none;
  width: 160px;
}
.search-input::placeholder { color: #a0a0a8; }

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

/* ─── Content ───────────────────────────────────────────────────────────── */

.content { padding: 20px 26px; }

/* ─── Filter pills ──────────────────────────────────────────────────────── */

.filter-row {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 13px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  border: 0.5px solid #e2e0d8;
  color: #6b6b72;
  background: transparent;
  font-family: var(--font-main);
  transition: all 0.15s;
}
.pill.active {
  background: #1a1a1a;
  color: #ffffff;
  border-color: #1a1a1a;
}

.pill-count {
  background: #f0ede8;
  color: #6b6b72;
  font-size: 10px;
  padding: 0 5px;
  border-radius: var(--r-pill);
}
.pill.active .pill-count {
  background: rgba(255,255,255,0.2);
  color: #ffffff;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  flex-shrink: 0;
}

/* ─── Card ──────────────────────────────────────────────────────────────── */

.card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: 18px;
  overflow: hidden;
}

/* ─── Live banner ───────────────────────────────────────────────────────── */

.live-banner {
  background: #34d39910;
  border-bottom: 0.5px solid #e2e0d8;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.live-banner-left {
  display: flex;
  align-items: center;
  gap: 10px;
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
  flex-shrink: 0;
}

.live-title {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.live-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #6b6b72;
  margin-top: 2px;
}

.live-banner-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.live-checkin-count {
  font-size: 11px;
  font-weight: 500;
  color: #0d9e6e;
}

.btn-checkin {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  border-radius: var(--r-pill);
  border: none;
  background: #0d9e6e;
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: opacity 0.15s;
}
.btn-checkin:hover { opacity: 0.88; }

/* ─── Table header ──────────────────────────────────────────────────────── */

.table-head {
  display: grid;
  grid-template-columns: 1fr 80px 100px 110px 90px 100px;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  font-size: 10px;
  font-weight: 500;
  color: #a0a0a8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

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