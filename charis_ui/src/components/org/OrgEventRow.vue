<template>
  <div class="event-row" :class="{ 'is-past': event.status === 'past' }">

    <div class="row-left">
      <div class="category-dot" :style="{ background: categoryColor }" aria-hidden="true"></div>
      <div class="event-info">
        <div class="event-title">{{ event.title }}</div>
        <div class="event-meta">
          <IconMapPin :size="11" aria-hidden="true" />
          {{ event.location }}
        </div>
      </div>
    </div>

    <div class="row-date">{{ event.date }}</div>

    <div class="row-category">
      <span class="category-badge" :style="categoryBadgeStyle">
        {{ categoryLabel }}
      </span>
    </div>

    <div class="row-registered">
      <span class="reg-count">
        <span class="reg-current">{{ event.registeredCount }}</span>
        <span class="reg-max"> / {{ event.capacityMax }}</span>
      </span>
      <div class="fill-bar-track">
        <div class="fill-bar-fill" :style="fillBarStyle"></div>
      </div>
    </div>

    <div class="row-status">
      <span class="status-badge" :style="statusBadgeStyle">{{ statusLabel }}</span>
    </div>

    <div class="row-actions">
      <button
        v-if="event.status === 'live'"
        class="checkin-btn"
        @click.stop="$emit('open-checkin', event)"
      >
        Check-in
        <IconArrowRight :size="12" aria-hidden="true" />
      </button>
      <template v-else>
        <button
          class="icon-btn"
          aria-label="Edit event"
          @click.stop="$emit('edit', event.id)"
        >
          <IconEdit :size="15" aria-hidden="true" />
        </button>
        <button
          class="icon-btn"
          aria-label="More options"
          @click.stop="$emit('more', event.id)"
        >
          <IconDots :size="15" aria-hidden="true" />
        </button>
      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconMapPin,
  IconArrowRight,
  IconEdit,
  IconDots,
} from '@tabler/icons-vue'
import type { OrgEvent, OrgEventStatus } from '../../models/types/org-event.types'
import type { EventCategory } from '../../models/types/event.types'

const props = defineProps<{
  event: OrgEvent
}>()

defineEmits<{
  (e: 'open-checkin', event: OrgEvent): void
  (e: 'edit', id: string): void
  (e: 'more', id: string): void
}>()

// ─── Category ─────────────────────────────────────────────────────────────

const categoryColors: Record<EventCategory, string> = {
  volunteer:  '#a78bfa',
  community:  '#34d399',
  fundraiser: '#f59e0b',
  workshop:   '#2563eb',
}

const categoryBadgeStyles: Record<EventCategory, { color: string; background: string }> = {
  volunteer:  { color: '#7c5cbf', background: '#a78bfa22' },
  community:  { color: '#0d9e6e', background: '#34d39922' },
  fundraiser: { color: '#b37400', background: '#f59e0b22' },
  workshop:   { color: '#1d4ed8', background: '#2563eb18' },
}

const categoryLabels: Record<EventCategory, string> = {
  volunteer:  'Volunteer',
  community:  'Community',
  fundraiser: 'Fundraiser',
  workshop:   'Workshop',
}

const categoryColor = computed(() => categoryColors[props.event.category])
const categoryBadgeStyle = computed(() => categoryBadgeStyles[props.event.category])
const categoryLabel = computed(() => categoryLabels[props.event.category])

// ─── Status ───────────────────────────────────────────────────────────────

const statusLabels: Record<OrgEventStatus, string> = {
  live:     'Live',
  upcoming: 'Upcoming',
  draft:    'Draft',
  past:     'Past',
}

const statusBadgeStyles: Record<OrgEventStatus, { color: string; background: string }> = {
  live:     { color: '#0d9e6e', background: '#34d39922' },
  upcoming: { color: '#2563eb', background: '#2563eb12' },
  draft:    { color: '#6b6b72', background: '#e2e0d8' },
  past:     { color: '#a0a0a8', background: '#f0ede8' },
}

const statusLabel = computed(() => statusLabels[props.event.status])
const statusBadgeStyle = computed(() => statusBadgeStyles[props.event.status])

// ─── Fill bar ─────────────────────────────────────────────────────────────

const fillPct = computed(() => {
  const pct = (props.event.registeredCount / props.event.capacityMax) * 100
  return Math.min(pct, 100)
})

const fillBarStyle = computed(() => ({
  width: `${fillPct.value}%`,
  background: props.event.status === 'past' ? '#a0a0a8' : '#2563eb',
}))
</script>

<style scoped>
.event-row {
  display: grid;
  grid-template-columns: 1fr 80px 100px 110px 90px 100px;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 0.5px solid #e2e0d8;
  transition: background 0.12s;
  cursor: default;
}
.event-row:last-child { border-bottom: none; }
.event-row:hover { background: #f8f7f5; }
.event-row.is-past { opacity: 0.55; }

/* ─── Left ──────────────────────────────────────────────────────────────── */

.row-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.category-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.event-info { min-width: 0; }

.event-title {
  font-size: 12px;
  font-weight: 400;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #a0a0a8;
  margin-top: 2px;
}

/* ─── Date ──────────────────────────────────────────────────────────────── */

.row-date {
  font-size: 12px;
  color: #6b6b72;
}

/* ─── Category badge ────────────────────────────────────────────────────── */

.category-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
}

/* ─── Registration fill ─────────────────────────────────────────────────── */

.reg-count {
  font-size: 11px;
  display: block;
  margin-bottom: 3px;
}
.reg-current { font-weight: 500; color: #1a1a1a; }
.reg-max     { color: #a0a0a8; }

.fill-bar-track {
  height: 2px;
  background: #f0ede8;
  border-radius: 1px;
  overflow: hidden;
}

.fill-bar-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.3s ease;
}

/* ─── Status badge ──────────────────────────────────────────────────────── */

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: var(--r-pill);
  font-size: 10px;
  font-weight: 500;
}

/* ─── Actions ───────────────────────────────────────────────────────────── */

.row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
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
.icon-btn:hover {
  color: var(--ch-blue);
  background: var(--ch-blue-soft);
}

.checkin-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
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
.checkin-btn:hover { opacity: 0.88; }
</style>