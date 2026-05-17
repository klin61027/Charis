<template>
  <div class="wallet-view">
    <div class="accent-bar"></div>

    <div class="wallet-top">
      <div class="wallet-header">
        <div class="wallet-title">Wallet</div>
      </div>
      <div class="top-divider"></div>

      <div class="summary-strip">
        <div class="summary-card">
          <div class="summary-val">{{ summaryStats.active }}</div>
          <div class="summary-lbl">Active</div>
        </div>
        <div class="summary-card">
          <div class="summary-val expiring">{{ summaryStats.expiring }}</div>
          <div class="summary-lbl">Expiring soon</div>
        </div>
        <div class="summary-card">
          <div class="summary-val used">{{ summaryStats.used }}</div>
          <div class="summary-lbl">Used</div>
        </div>
      </div>

      <div class="top-divider"></div>

      <div class="tab-row">
        <button
          class="pill"
          :class="{ active: activeTab === 'coupons' }"
          @click="setTab('coupons')"
        >
          Coupons
        </button>
        <button
          class="pill"
          :class="{ active: activeTab === 'tickets' }"
          @click="setTab('tickets')"
        >
          Tickets
        </button>
      </div>
    </div>

    <div class="wallet-content">

      <template v-if="activeTab === 'coupons'">
        <div v-if="visibleCoupons.length === 0" class="empty-state">
          <IconTicket :size="32" class="empty-icon" aria-hidden="true" />
          <p>No coupons yet</p>
        </div>
        <CouponCard
          v-for="coupon in visibleCoupons"
          :key="coupon.id"
          :coupon="coupon"
          @use="useCoupon"
        />
      </template>

      <template v-else-if="activeTab === 'tickets'">
        <div v-if="visibleTickets.length === 0" class="empty-state">
          <IconCalendarOff :size="32" class="empty-icon" aria-hidden="true" />
          <p>No tickets yet</p>
        </div>
        <TicketCard
          v-for="ticket in visibleTickets"
          :key="ticket.id"
          :ticket="ticket"
          @show-qr="openQr"
        />
      </template>

    </div>

    <nav class="bottom-nav" aria-label="Main navigation">
      <router-link to="/" class="nav-item">
        <IconHome :size="20" aria-hidden="true" />
        <span class="nav-label">Home</span>
      </router-link>
      <router-link to="/explore" class="nav-item">
        <IconCompass :size="20" aria-hidden="true" />
        <span class="nav-label">Explore</span>
      </router-link>
      <router-link to="/wallet" class="nav-item">
        <IconWallet :size="20" aria-hidden="true" />
        <span class="nav-label">Wallet</span>
      </router-link>
    </nav>

    <TicketQrModal
      :ticket="activeQrTicket"
      @close="closeQr"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IconTicket,
  IconCalendarOff,
  IconHome,
  IconCompass,
  IconWallet,
} from '@tabler/icons-vue'
import { useWallet } from '../../viewmodels/useWallet'
import CouponCard from '../../components/wallet/CouponCard.vue'
import TicketCard from '../../components/wallet/TicketCard.vue'
import TicketQrModal from '../../components/wallet/TicketQrModal.vue'
import type { Ticket } from '../../models/types/ticket.types'

const {
  activeTab,
  visibleCoupons,
  visibleTickets,
  summaryStats,
  setTab,
  useCoupon,
} = useWallet()

const activeQrTicket = ref<Ticket | null>(null)

function openQr(ticket: Ticket) {
  activeQrTicket.value = ticket
}

function closeQr() {
  activeQrTicket.value = null
}
</script>

<style scoped>
.wallet-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f7f5;
  font-family: var(--font-main);
}

.accent-bar {
  height: 4px;
  background: linear-gradient(90deg, var(--ch-gold) 0%, var(--ch-blue-mid) 100%);
  flex-shrink: 0;
}

.wallet-top {
  flex-shrink: 0;
  background: #f8f7f5;
  padding: 0 20px;
}

.wallet-header { padding: 16px 0 14px; }

.wallet-title {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.top-divider {
  height: 0.5px;
  background: #e2e0d8;
  margin: 0 -20px;
}

.summary-strip {
  display: flex;
  gap: 10px;
  padding: 14px 0;
}

.summary-card {
  flex: 1;
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 12px;
  text-align: center;
}

.summary-val {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
}
.summary-val.expiring { color: #f59e0b; }
.summary-val.used     { color: #a0a0a8; }

.summary-lbl {
  font-size: 11px;
  color: #a0a0a8;
  margin-top: 2px;
}

.tab-row {
  display: flex;
  gap: 8px;
  padding: 14px 0 4px;
}

.pill {
  padding: 7px 16px;
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 400;
  border: 0.5px solid #e2e0d8;
  color: #6b6b72;
  background: #ffffff;
  white-space: nowrap;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.15s;
}
.pill.active {
  background: var(--ch-gold);
  color: #ffffff;
  border-color: var(--ch-gold);
  font-weight: 500;
}

.wallet-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px 90px;
  background: #f8f7f5;
}
.wallet-content::-webkit-scrollbar { width: 3px; }
.wallet-content::-webkit-scrollbar-thumb { background: #e2e0d8; border-radius: 3px; }

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #a0a0a8;
  font-size: 13px;
}
.empty-icon {
  display: block;
  margin: 0 auto 10px;
  opacity: 0.25;
  color: #6b6b72;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 0.5px solid #e2e0d8;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  text-decoration: none;
  color: #a0a0a8;
  transition: color 0.15s;
}
.nav-item.router-link-active { color: var(--ch-gold); }

.nav-label {
  font-size: 10px;
  font-weight: 500;
  font-family: var(--font-main);
}
</style>
