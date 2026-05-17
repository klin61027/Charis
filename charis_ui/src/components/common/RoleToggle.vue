<template>
  <div class="role-toggle">
    <div class="slider" :class="active === 'org' ? 'org' : 'vol'"></div>

    <button
      type="button"
      class="role-btn"
      :class="{ active: active === 'user' }"
      :style="active === 'user' ? { color: '#b8860b' } : { color: '#a0a0a8' }"
      @click="$emit('change', 'user')"
    >
      <IconHeartHandshake :size="16" aria-hidden="true" />
      Volunteer
    </button>

    <button
      type="button"
      class="role-btn"
      :class="{ active: active === 'org' }"
      :style="active === 'org' ? { color: '#2563eb' } : { color: '#a0a0a8' }"
      @click="$emit('change', 'org')"
    >
      <IconBuildingCommunity :size="16" aria-hidden="true" />
      Organization
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconHeartHandshake, IconBuildingCommunity } from '@tabler/icons-vue'
import type { UserRole } from '../../models/types/user.types'

defineProps<{ active: UserRole }>()
defineEmits<{ change: [role: UserRole] }>()
</script>

<style scoped>
.role-toggle {
  display: flex;
  position: relative;
  background: #f0efe9;
  border-radius: 12px;
  padding: 4px;
  border: 0.5px solid #e2e0d8;
  margin-bottom: 28px;
}

.slider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  border-radius: 9px;
  background: #fff;
  transition: transform 0.35s cubic-bezier(.4,0,.2,1),
              border-color 0.4s ease;
}
.slider.vol {
  transform: translateX(0);
  border: 0.5px solid #c9920e44;
}
.slider.org {
  transform: translateX(100%);
  border: 0.5px solid #2563eb44;
}

.role-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px;
  border-radius: 9px;
  border: none;
  background: transparent;
  font-family: var(--font-main);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: color 0.35s ease;
}
</style>