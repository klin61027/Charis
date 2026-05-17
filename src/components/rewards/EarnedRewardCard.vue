<template>
  <div class="reward-card">
    <div class="reward-bar" :style="barStyle"></div>
    <div class="reward-body">
      <div class="reward-header">
        <div class="biz-icon" :style="iconBgStyle">
          <IconCoffee v-if="coupon.businessCategory === 'cafe'" :size="14" aria-hidden="true" />
          <IconToolsKitchen2 v-else-if="coupon.businessCategory === 'restaurant'" :size="14" aria-hidden="true" />
          <IconBread v-else-if="coupon.businessCategory === 'bakery'" :size="14" aria-hidden="true" />
          <IconShoppingBag v-else :size="14" aria-hidden="true" />
        </div>
        <div>
          <div class="biz-name">{{ coupon.businessName }}</div>
          <div class="biz-neighborhood">{{ coupon.neighborhood }}</div>
        </div>
      </div>
      <div class="reward-value">{{ coupon.value }}</div>
      <div class="reward-expiry">
        <IconClock :size="11" aria-hidden="true" />
        <span :style="expiryStyle">{{ expiryLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconCoffee,
  IconToolsKitchen2,
  IconBread,
  IconShoppingBag,
  IconClock,
} from '@tabler/icons-vue'
import type { Coupon } from '../../models/types/coupon.types'

const props = defineProps<{
  coupon: Coupon
}>()

const categoryIconColors: Record<string, string> = {
  cafe:       '#c9920e',
  restaurant: '#a78bfa',
  bakery:     '#34d399',
  retail:     '#2563eb',
}

const iconBgStyle = computed(() => {
  const color = categoryIconColors[props.coupon.businessCategory] ?? '#c9920e'
  return {
    background: `${color}18`,
    color,
  }
})

const barStyle = computed(() => {
  if (props.coupon.status === 'expiring_soon') {
    return { background: 'linear-gradient(90deg, #f59e0b, #f87171)' }
  }
  return { background: 'linear-gradient(90deg, #c9920e, #f59e0b)' }
})

const expiryLabel = computed(() => {
  if (props.coupon.daysLeft === 0) return 'Expires today'
  if (props.coupon.daysLeft === 1) return 'Expires tomorrow'
  return `${props.coupon.daysLeft} days left`
})

const expiryStyle = computed(() => {
  if (props.coupon.status === 'expiring_soon') return { color: '#f59e0b' }
  return { color: '#34d399' }
})
</script>

<style scoped>
.reward-card {
  min-width: 148px;
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.15s;
}
.reward-card:hover { background: #f0ede8; }

.reward-bar {
  height: 3px;
}

.reward-body {
  padding: 11px;
}

.reward-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
}

.biz-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.biz-name {
  font-size: 11px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.2;
}

.biz-neighborhood {
  font-size: 10px;
  color: #a0a0a8;
}

.reward-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--ch-gold);
  margin-bottom: 5px;
}

.reward-expiry {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #34d399;
}

.reward-expiry span {
  font-size: 10px;
  font-weight: 500;
}
</style>
