<template>
  <div class="event-card" :class="{ 'past-card': event.past }">
    <div class="event-thumb" :style="thumbStyle">
      <component
        :is="categoryIcon"
        :size="32"
        :style="{ color: style.color, opacity: 0.35 }"
        aria-hidden="true"
      />
    </div>
    <div class="event-content">
      <div class="event-title">{{ event.title }}</div>
      <div class="event-meta">
        <IconCalendar :size="12" aria-hidden="true" />
        {{ event.date }} · {{ event.time }}
      </div>
      <div class="event-meta">
        <IconMapPin :size="12" aria-hidden="true" />
        {{ event.location }}
      </div>
      <template v-if="event.past">
        <div class="event-footer">
          <span class="attendee-text">{{ event.attendeeCount }}/{{ event.attendeeMax }} attended</span>
          <span class="attended-badge">Attended</span>
        </div>
      </template>
      <template v-else>
        <div v-if="event.reward" class="reward-tag">
          <IconTicket :size="11" aria-hidden="true" />
          <span>Earn: {{ event.reward.value }} · {{ event.reward.businessName }}</span>
        </div>
        <div class="event-footer">
          <div class="attendees">
            <div class="avatar-stack">
              <div v-for="(att, i) in event.attendees" :key="i" class="av">{{ att.initial }}</div>
            </div>
            <span class="attendee-text">{{ event.attendeeCount }}/{{ event.attendeeMax }}</span>
          </div>
          <button
            class="action-btn"
            :class="{ joined: isJoined }"
            @click.stop="handleJoin"
          >
            {{ isJoined ? 'Joined' : 'Join' }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconCalendar,
  IconMapPin,
  IconTicket,
  IconHeartHandshake,
  IconTrees,
  IconCoin,
  IconSchool,
} from '@tabler/icons-vue'
import type { Event, EventCategory } from '../../models/types/event.types'

const props = defineProps<{
  event:    Event
  isJoined?: boolean
}>()

const emit = defineEmits<{
  (e: 'join', id: string): void
  (e: 'open-form', event: Event): void
}>()

const categoryStyles: Record<EventCategory, { color: string; bg: string }> = {
  volunteer:  { color: '#a78bfa', bg: '#a78bfa22' },
  community:  { color: '#34d399', bg: '#34d39922' },
  workshop:   { color: '#2563eb', bg: '#2563eb18' },
  fundraiser: { color: '#f59e0b', bg: '#f59e0b22' },
}

const categoryIcons: Record<EventCategory, unknown> = {
  volunteer:  IconHeartHandshake,
  community:  IconTrees,
  fundraiser: IconCoin,
  workshop:   IconSchool,
}

const style        = computed(() => categoryStyles[props.event.category])
const categoryIcon = computed(() => categoryIcons[props.event.category])
const thumbStyle   = computed(() => ({
  background: `linear-gradient(135deg, ${style.value.bg} 0%, #f0ede8 100%)`,
}))

function handleJoin() {
  if (props.isJoined) {
    emit('join', props.event.id)
  } else {
    emit('open-form', props.event)
  }
}
</script>

<style scoped>
.event-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 0.5px solid #e2e0d8;
  cursor: pointer;
}
.event-card:last-child { border-bottom: none; }
.past-card { opacity: 0.65; }
.event-thumb {
  width: 100px;
  height: 80px;
  border-radius: var(--r-sm);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.event-content { flex: 1; min-width: 0; }
.event-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 4px;
}
.event-meta {
  font-size: 12px;
  color: #6b6b72;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.reward-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #c9920e18;
  border: 0.5px solid #c9920e44;
  border-radius: var(--r-pill);
  padding: 3px 10px;
  margin-top: 5px;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #c9920e;
}
.event-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  gap: 8px;
}
.attendees { display: flex; align-items: center; gap: 6px; }
.avatar-stack { display: flex; }
.av {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f0ede8;
  border: 2px solid #f8f7f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 500;
  color: #6b6b72;
}
.av + .av { margin-left: -8px; }
.attendee-text { font-size: 11px; color: #a0a0a8; margin-left: 4px; }
.action-btn {
  padding: 6px 14px;
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 0.5px solid #e2e0d8;
  background: transparent;
  color: #1a1a1a;
  font-family: var(--font-main);
  white-space: nowrap;
  transition: all 0.15s;
}
.action-btn.joined {
  background: var(--ch-gold-soft);
  color: var(--ch-gold);
  border-color: var(--ch-gold);
}
.attended-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 500;
  color: #0d9e6e;
  background: #0d9e6e15;
}
</style>
