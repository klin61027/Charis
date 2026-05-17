<template>
  <div class="logo-area">
    <div class="logo-wrap" ref="logoWrap">
      <span class="logo-base">Charıs</span>
      <span class="logo-overlay" :class="{ full: isOrg }">Charıs</span>
      <span class="i-dot" :class="{ org: isOrg }" ref="iDot"></span>
      <span class="probe" ref="probeBefore">Char</span>
      <span class="probe" ref="probeI">ı</span>
    </div>
    <p class="tagline">Express gratitude. Build community.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { UserRole } from '../../models/types/user.types'

const props = withDefaults(defineProps<{
  role?: UserRole
}>(), {
  role: 'user',
})

const isOrg = computed(() => props.role === 'org')

const logoWrap    = ref<HTMLElement | null>(null)
const probeBefore = ref<HTMLElement | null>(null)
const probeI      = ref<HTMLElement | null>(null)
const iDot        = ref<HTMLElement | null>(null)

function positionDot() {
  if (!logoWrap.value || !probeBefore.value || !probeI.value || !iDot.value) return
  const wrapRect   = logoWrap.value.getBoundingClientRect()
  const beforeRect = probeBefore.value.getBoundingClientRect()
  const iRect      = probeI.value.getBoundingClientRect()
  const iCenterX   = (beforeRect.left - wrapRect.left) + beforeRect.width + iRect.width / 2
  const dotSize    = 5
  const dotY       = wrapRect.height * 0.10
  iDot.value.style.width  = dotSize + 'px'
  iDot.value.style.height = dotSize + 'px'
  iDot.value.style.left   = (iCenterX - dotSize / 2) + 'px'
  iDot.value.style.top    = dotY + 'px'
}

onMounted(() => setTimeout(positionDot, 80))
onUnmounted(() => window.removeEventListener('resize', positionDot))
window.addEventListener('resize', positionDot)
</script>

<style scoped>
.logo-area { text-align: center; padding: 36px 0 28px; }
.logo-wrap { position: relative; display: inline-block; line-height: 1.2; margin-bottom: 6px; }
.logo-base {
  font-size: 36px; font-weight: 500; letter-spacing: -.5px;
  color: #c9920e; display: block; white-space: nowrap;
  font-family: var(--font-main);
}
.logo-overlay {
  position: absolute; inset: 0;
  font-size: 36px; font-weight: 500; letter-spacing: -.5px;
  color: #2563eb; white-space: nowrap;
  overflow: hidden; width: 0%;
  transition: width 0.55s cubic-bezier(.4,0,.2,1);
  font-family: var(--font-main);
}
.logo-overlay.full { width: 100%; }
.i-dot {
  position: absolute; border-radius: 50%;
  background: #3b82f6; pointer-events: none;
  transition: background 0.45s ease, transform 0.35s cubic-bezier(.4,0,.2,1);
}
.i-dot.org { background: #c9920e; transform: scale(1.3); }
.probe {
  position: absolute; visibility: hidden;
  white-space: nowrap; pointer-events: none;
  font-size: 36px; font-weight: 500; letter-spacing: -.5px;
  font-family: var(--font-main); top: 0; left: 0;
}
.tagline { font-size: 13px; color: #a0a0a8; }
</style>