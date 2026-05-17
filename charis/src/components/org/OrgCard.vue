<template>
  <div class="org-card" @click="$emit('select', org.id)">
    <div class="org-img" :style="imgStyle">
      <IconBuildingCommunity
        :size="26"
        :style="{ color: accentColor, opacity: 0.4 }"
        aria-hidden="true"
      />
    </div>
    <div class="org-name">{{ org.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconBuildingCommunity } from '@tabler/icons-vue'
import type { Organization, OrgCategory } from '../../models/types/organization.types'

const props = defineProps<{
  org: Organization
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

const categoryAccents: Record<OrgCategory, string> = {
  food:        '#c9920e',
  environment: '#2563eb',
  community:   '#a78bfa',
}

const accentColor = computed(() => categoryAccents[props.org.category])
const imgStyle = computed(() => ({
  background: `linear-gradient(135deg, ${accentColor.value}18 0%, #f8f7f5 100%)`,
}))
</script>

<style scoped>
.org-card {
  min-width: 130px;
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.15s;
}
.org-card:hover { background: #f0ede8; }
.org-img {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.org-name {
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
}
</style>
