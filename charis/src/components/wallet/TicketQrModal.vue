<template>
  <Transition name="overlay">
    <div v-if="ticket" class="overlay" @click.self="$emit('close')">
      <div class="modal">

        <div class="modal-header">
          <div>
            <div class="modal-title">{{ ticket.eventTitle }}</div>
            <div class="modal-sub">{{ ticket.organizationName }}</div>
          </div>
          <button class="close-btn" aria-label="Close" @click="$emit('close')">
            <IconX :size="18" aria-hidden="true" />
          </button>
        </div>

        <div class="modal-body">

          <div class="qr-wrap">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PLACEHOLDER"
              alt="Ticket QR code placeholder"
              class="qr-img"
              width="180"
              height="180"
            />
          </div>

          <div class="ticket-id-row">
            <span class="ticket-id-label">Ticket ID</span>
            <span class="ticket-id-value">{{ ticket.qrCode }}</span>
          </div>

          <div class="event-details">
            <div class="detail-row">
              <IconCalendar :size="13" aria-hidden="true" />
              {{ ticket.date }} · {{ ticket.time }}
            </div>
            <div class="detail-row">
              <IconMapPin :size="13" aria-hidden="true" />
              {{ ticket.location }}
            </div>
          </div>

          <p class="hint">
            Show this QR code to the event organizer to check in
          </p>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconX, IconCalendar, IconMapPin } from '@tabler/icons-vue'
import type { Ticket } from '../../models/types/ticket.types'

defineProps<{
  ticket: Ticket | null
}>()

defineEmits<{
  (e: 'close'): void
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

/* ─── Header ────────────────────────────────────────────────────────────── */

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
  font-size: 11px;
  color: #a0a0a8;
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

/* ─── Body ──────────────────────────────────────────────────────────────── */

.modal-body {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* ─── QR ────────────────────────────────────────────────────────────────── */

.qr-wrap {
  background: #f8f7f5;
  border-radius: 14px;
  padding: 16px;
  border: 0.5px solid #e2e0d8;
}

.qr-img {
  display: block;
  border-radius: 4px;
}

/* ─── Ticket ID ─────────────────────────────────────────────────────────── */

.ticket-id-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.ticket-id-label {
  font-size: 11px;
  color: #a0a0a8;
  font-family: var(--font-main);
}

.ticket-id-value {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 0.5px;
  font-family: var(--font-main);
}

/* ─── Event details ─────────────────────────────────────────────────────── */

.event-details {
  width: 100%;
  background: #f8f7f5;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b6b72;
  font-family: var(--font-main);
}

/* ─── Hint ──────────────────────────────────────────────────────────────── */

.hint {
  font-size: 11px;
  color: #a0a0a8;
  text-align: center;
  line-height: 1.5;
  font-family: var(--font-main);
}

/* ─── Transition ────────────────────────────────────────────────────────── */

.overlay-enter-active, .overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-active .modal, .overlay-leave-active .modal {
  transition: transform 0.2s ease;
}
.overlay-enter-from, .overlay-leave-to {
  opacity: 0;
}
.overlay-enter-from .modal, .overlay-leave-to .modal {
  transform: translateY(24px);
}
</style>
