<template>
  <div class="volunteer-row">
    <div class="rank" :class="{ top: rank <= 3 }">{{ rank }}</div>
    <div class="vol-avatar" :style="avatarStyle">{{ volunteer.initials }}</div>
    <div class="vol-info">
      <div class="vol-name">{{ volunteer.name }}</div>
      <div class="vol-meta">@{{ volunteer.username }} · {{ volunteer.events }} events</div>
    </div>
    <div class="vol-hours">{{ volunteer.hours }}h</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  volunteer: {
    id: string
    name: string
    username: string
    events: number
    hours: number
    initials: string
    category: string
  }
  rank: number
}>()

const rankColors = ['#c9920e', '#a78bfa', '#34d399']

const avatarStyle = computed(() => {
  const color = rankColors[props.rank - 1] ?? '#a0a0a8'
  return {
    background: `${color}18`,
    border: `1.5px solid ${color}44`,
    color,
  }
})
</script>

<style scoped>
.volunteer-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 0.5px solid #e2e0d8;
}
.volunteer-row:last-child { border-bottom: none; }

.rank {
  width: 20px;
  font-size: 13px;
  color: #a0a0a8;
  text-align: center;
  flex-shrink: 0;
}
.rank.top {
  font-weight: 500;
  color: var(--ch-gold);
}

.vol-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.vol-info { flex: 1; }

.vol-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.vol-meta {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 2px;
}

.vol-hours {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
}
</style>
