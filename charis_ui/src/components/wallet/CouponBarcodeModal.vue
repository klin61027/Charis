<template>
  <Transition name="overlay">
    <div v-if="coupon" class="overlay" @click.self="$emit('close')">
      <div class="modal">

        <div class="modal-header">
          <div>
            <div class="modal-title">{{ coupon.businessName }}</div>
            <div class="modal-sub">{{ coupon.value }}</div>
          </div>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <IconX :size="18" aria-hidden="true" />
          </button>
        </div>

        <div class="modal-body">
          <div class="barcode-wrap">
            <img
              v-if="coupon.barcode"
              :src="`https://barcodeapi.org/api/128/${encodeURIComponent(coupon.barcode)}`"
              alt="Coupon barcode"
              class="barcode-img"
            />
            <div v-else class="barcode-placeholder">
              <IconBarcode :size="48" aria-hidden="true" />
            </div>
          </div>

          <div class="barcode-code">{{ coupon.barcode }}</div>

          <p class="hint">Show this barcode to the cashier to redeem your reward</p>
        </div>

        <div class="modal-footer">
          <button class="confirm-btn" @click="$emit('confirm', coupon.id)">
            Mark as used
          </button>
          <button class="cancel-btn" @click="$emit('close')">Close</button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconX, IconBarcode } from '@tabler/icons-vue'
import type { Coupon } from '../../models/types/coupon.types'

defineProps<{
  coupon: Coupon | null
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'confirm', id: string): void
}>()
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 22, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 300;
  padding-bottom: 24px;
}

.modal {
  background: #ffffff;
  border-radius: 20px;
  border: 0.5px solid #e2e0d8;
  width: 100%;
  max-width: 360px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 0.5px solid #e2e0d8;
}

.modal-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  font-family: var(--font-main);
}

.modal-sub {
  font-size: 12px;
  color: var(--ch-gold);
  font-weight: 500;
  margin-top: 2px;
  font-family: var(--font-main);
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #a0a0a8;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.close-btn:hover { color: #1a1a1a; }

.modal-body {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.barcode-wrap {
  background: #f8f7f5;
  border-radius: 12px;
  padding: 16px 20px;
  border: 0.5px solid #e2e0d8;
  width: 100%;
  display: flex;
  justify-content: center;
}

.barcode-img {
  width: 100%;
  max-width: 280px;
  height: 80px;
  object-fit: contain;
  display: block;
}

.barcode-placeholder {
  color: #a0a0a8;
  opacity: 0.4;
}

.barcode-code {
  font-size: 12px;
  font-weight: 500;
  color: #6b6b72;
  letter-spacing: 1px;
  font-family: var(--font-main);
}

.hint {
  font-size: 11px;
  color: #a0a0a8;
  text-align: center;
  line-height: 1.5;
  font-family: var(--font-main);
}

.modal-footer {
  padding: 0 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-btn {
  width: 100%;
  padding: 10px;
  border-radius: var(--r-pill);
  border: none;
  background: var(--ch-gold);
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  transition: opacity 0.15s;
}
.confirm-btn:hover { opacity: 0.88; }

.cancel-btn {
  width: 100%;
  padding: 8px;
  border-radius: var(--r-pill);
  border: 0.5px solid #e2e0d8;
  background: transparent;
  font-size: 12px;
  color: #a0a0a8;
  cursor: pointer;
  font-family: var(--font-main);
  transition: background 0.15s;
}
.cancel-btn:hover { background: #f0ede8; }

.overlay-enter-active, .overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-active .modal, .overlay-leave-active .modal {
  transition: transform 0.2s ease;
}
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
.overlay-enter-from .modal, .overlay-leave-to .modal { transform: translateY(24px); }
</style>
