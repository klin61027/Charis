<template>
  <div class="coupon-card" :class="{ 'expiring': coupon.status === 'expiring_soon' }">
    <div class="coupon-bar" :style="barStyle"></div>
    <div class="coupon-body">
      <div class="coupon-header">
        <div class="biz-icon" :style="iconBgStyle">
          <IconCoffee v-if="coupon.businessCategory === 'cafe'" :size="18" aria-hidden="true" />
          <IconToolsKitchen2 v-else-if="coupon.businessCategory === 'restaurant'" :size="18" aria-hidden="true" />
          <IconBread v-else-if="coupon.businessCategory === 'bakery'" :size="18" aria-hidden="true" />
          <IconShoppingBag v-else :size="18" aria-hidden="true" />
        </div>
        <div class="biz-info">
          <div class="biz-name">{{ coupon.businessName }}</div>
          <div class="biz-neighborhood">{{ coupon.neighborhood }}</div>
        </div>
        <div class="status-badge" :style="statusBadgeStyle">{{ statusLabel }}</div>
      </div>
      <div class="coupon-value">{{ coupon.value }}</div>
      <div class="coupon-divider"></div>
      <div class="coupon-footer">
        <div class="expiry-row">
          <IconClock :size="13" aria-hidden="true" :style="expiryIconStyle" />
          <span class="expiry-label" :style="expiryStyle">{{ expiryLabel }}</span>
        </div>
        <button class="use-btn" @click.stop="$emit('use', coupon.id)">
          Use now
        </button>
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

defineEmits<{
  (e: 'use', id: string): void
}>()

const categoryIconColors: Record<string, string> = {
  cafe:       '#c9920e',
  restaurant: '#a78bfa',
  bakery:     '#34d399',
  retail:     '#2563eb',
}

const iconBgStyle = computed(() => {
  const color = categoryIconColors[props.coupon.businessCategory] ?? '#c9920e'
  return { background: `${color}18`, color }
})

const barStyle = computed(() => {
  if (props.coupon.status === 'expiring_soon') {
    return { background: 'linear-gradient(90deg, #f59e0b, #f87171)' }
  }
  return { background: 'linear-gradient(90deg, #c9920e, #f59e0b)' }
})

const statusLabel = computed(() => {
  if (props.coupon.status === 'expiring_soon') return 'Expiring'
  if (props.coupon.status === 'active') return 'Active'
  if (props.coupon.status === 'redeemed') return 'Used'
  return 'Expired'
})

const statusBadgeStyle = computed(() => {
  if (props.coupon.status === 'expiring_soon') return { color: '#f59e0b', background: '#f59e0b18' }
  if (props.coupon.status === 'active') return { color: '#34d399', background: '#34d39918' }
  return { color: '#a0a0a8', background: '#a0a0a818' }
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

const expiryIconStyle = computed(() => {
  if (props.coupon.status === 'expiring_soon') return { color: '#f59e0b' }
  return { color: '#34d399' }
})
</script>

<style scoped>
.coupon-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  margin-bottom: 12px;
  overflow: hidden;
}
.coupon-card.expiring { border-color: #f59e0b44; }

.coupon-bar { height: 3px; }

.coupon-body { padding: 14px 16px; }

.coupon-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.biz-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.biz-info { flex: 1; }

.biz-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.biz-neighborhood {
  font-size: 12px;
  color: #a0a0a8;
}

.status-badge {
  font-size: 11px;
  font-weight: 500;
  border-radius: var(--r-pill);
  padding: 3px 10px;
}

.coupon-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--ch-gold);
  margin-bottom: 10px;
}

.coupon-divider {
  height: 0.5px;
  background: #e2e0d8;
  margin-bottom: 10px;
}

.coupon-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expiry-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.expiry-label {
  font-size: 12px;
  font-weight: 500;
}

.use-btn {
  padding: 7px 16px;
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 500;
  border: 0.5px solid var(--ch-gold);
  background: var(--ch-gold-soft);
  color: var(--ch-gold);
  cursor: pointer;
  font-family: var(--font-main);
  transition: all 0.15s;
}
</style>
