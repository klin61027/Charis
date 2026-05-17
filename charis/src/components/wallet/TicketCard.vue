<template>
  <div class="ticket-card" :class="{ 'attended': ticket.status === 'attended' }">
    <div class="ticket-bar" :style="barStyle"></div>
    <div class="ticket-body">
      <div class="ticket-header">
        <div class="event-icon" :style="iconBgStyle">
          <IconHeartHandshake v-if="ticket.eventCategory === 'volunteer'" :size="18" aria-hidden="true" />
          <IconTrees v-else-if="ticket.eventCategory === 'community'" :size="18" aria-hidden="true" />
          <IconCoin v-else-if="ticket.eventCategory === 'fundraiser'" :size="18" aria-hidden="true" />
          <IconSchool v-else :size="18" aria-hidden="true" />
        </div>
        <div class="event-info">
          <div class="event-title">{{ ticket.eventTitle }}</div>
          <div class="event-org">{{ ticket.organizationName }}</div>
        </div>
        <div class="status-badge" :style="statusBadgeStyle">{{ statusLabel }}</div>
      </div>
      <div class="ticket-divider"></div>
      <div class="ticket-meta">
        <IconCalendar :size="13" aria-hidden="true" />
        {{ ticket.date }} · {{ ticket.time }}
      </div>
      <div class="ticket-meta">
        <IconMapPin :size="13" aria-hidden="true" />
        {{ ticket.location }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconHeartHandshake,
  IconTrees,
  IconCoin,
  IconSchool,
  IconCalendar,
  IconMapPin,
} from '@tabler/icons-vue'
import type { Ticket } from '../../models/types/ticket.types'

const props = defineProps<{
  ticket: Ticket
}>()

const categoryIconColors: Record<string, string> = {
  volunteer:  '#a78bfa',
  community:  '#34d399',
  fundraiser: '#f59e0b',
  workshop:   '#2563eb',
}

const iconBgStyle = computed(() => {
  const color = categoryIconColors[props.ticket.eventCategory] ?? '#a78bfa'
  return { background: `${color}18`, color }
})

const barStyle = computed(() => {
  if (props.ticket.status === 'attended') return { background: '#e2e0d8' }
  const color = categoryIconColors[props.ticket.eventCategory] ?? '#a78bfa'
  return { background: `linear-gradient(90deg, ${color}, #2563eb)` }
})

const statusLabel = computed(() => {
  if (props.ticket.status === 'upcoming')  return 'Upcoming'
  if (props.ticket.status === 'attended')  return 'Attended'
  return 'Cancelled'
})

const statusBadgeStyle = computed(() => {
  if (props.ticket.status === 'upcoming') return { color: '#2563eb', background: '#2563eb12' }
  if (props.ticket.status === 'attended') return { color: '#34d399', background: '#34d39918' }
  return { color: '#f87171', background: '#f8717118' }
})
</script>

<style scoped>
.ticket-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  margin-bottom: 12px;
  overflow: hidden;
}
.ticket-card.attended { opacity: 0.65; }

.ticket-bar { height: 3px; }

.ticket-body { padding: 14px 16px; }

.ticket-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.event-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.event-info { flex: 1; }

.event-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
}

.event-org {
  font-size: 12px;
  color: #a0a0a8;
}

.status-badge {
  font-size: 11px;
  font-weight: 500;
  border-radius: var(--r-pill);
  padding: 3px 10px;
  flex-shrink: 0;
}

.ticket-divider {
  height: 0.5px;
  background: #e2e0d8;
  margin-bottom: 10px;
}

.ticket-meta {
  font-size: 12px;
  color: #6b6b72;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
}
</style>
