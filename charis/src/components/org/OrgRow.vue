<template>
  <div class="org-row" @click="$emit('select', org.id)">
    <div class="org-icon" :style="iconBgStyle">
      <IconBuildingCommunity :size="18" :style="{ color: accentColor, opacity: 0.6 }" aria-hidden="true" />
    </div>
    <div class="org-info">
      <div class="org-name">{{ org.name }}</div>
      <div class="org-meta">{{ categoryLabel }} · {{ org.eventsCount }} events</div>
    </div>
    <div class="following-badge">Following</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconBuildingCommunity } from '@tabler/icons-vue'
import type { FollowedOrg } from '../../models/types/profile.types'

const props = defineProps<{
  org: FollowedOrg
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

const categoryAccents: Record<string, string> = {
  food:        '#c9920e',
  environment: '#2563eb',
  community:   '#a78bfa',
}

const categoryLabels: Record<string, string> = {
  food:        'Food',
  environment: 'Environment',
  community:   'Community',
}

const accentColor  = computed(() => categoryAccents[props.org.category] ?? '#c9920e')
const categoryLabel = computed(() => categoryLabels[props.org.category] ?? props.org.category)
const iconBgStyle  = computed(() => ({
  background: `${accentColor.value}18`,
}))
</script>

<style scoped>
.org-row {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.org-row:hover { background: #f0ede8; }

.org-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.org-info { flex: 1; }

.org-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.org-meta {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 2px;
}

.following-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--ch-gold);
  background: var(--ch-gold-soft);
  border-radius: var(--r-pill);
  padding: 3px 10px;
  flex-shrink: 0;
}
</style>
