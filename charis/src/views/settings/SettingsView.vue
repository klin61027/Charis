<template>
  <div class="settings-view">
    <div class="accent-bar"></div>

    <div class="settings-body">

      <!-- header -->
      <div class="settings-header">
        <div class="back-btn" @click="router.back()">
          <IconArrowLeft :size="18" aria-hidden="true" />
        </div>
        <div class="header-title">Settings</div>
      </div>
      <div class="divider"></div>

      <!-- account -->
      <div class="section-label">Account</div>
      <div class="menu-card">
        <div class="info-row">
          <div class="info-label">Full name</div>
          <div class="info-value">{{ profile.name }}</div>
        </div>
        <div class="row-divider"></div>
        <div class="info-row">
          <div class="info-label">Username</div>
          <div class="info-value">@{{ profile.username }}</div>
        </div>
        <div class="row-divider"></div>
        <div class="info-row">
          <div class="info-label">Email</div>
          <div class="info-value">{{ profile.email }}</div>
        </div>
      </div>

      <!-- notifications -->
      <div class="section-label">Notifications</div>
      <div class="menu-card">
        <div class="toggle-row">
          <span class="toggle-label">Event reminders</span>
          <div
            class="toggle"
            :class="{ on: notificationSettings.eventReminders }"
            @click="notificationSettings.eventReminders = !notificationSettings.eventReminders"
          >
            <div class="toggle-thumb"></div>
          </div>
        </div>
        <div class="row-divider"></div>
        <div class="toggle-row">
          <span class="toggle-label">New coupons</span>
          <div
            class="toggle"
            :class="{ on: notificationSettings.newCoupons }"
            @click="notificationSettings.newCoupons = !notificationSettings.newCoupons"
          >
            <div class="toggle-thumb"></div>
          </div>
        </div>
        <div class="row-divider"></div>
        <div class="toggle-row">
          <span class="toggle-label">Application updates</span>
          <div
            class="toggle"
            :class="{ on: notificationSettings.applicationUpdates }"
            @click="notificationSettings.applicationUpdates = !notificationSettings.applicationUpdates"
          >
            <div class="toggle-thumb"></div>
          </div>
        </div>
      </div>

      <!-- privacy -->
      <div class="section-label">Privacy</div>
      <div class="menu-card">
        <div class="menu-row">
          <span class="menu-label">Privacy policy</span>
          <IconChevronRight :size="16" class="chevron" aria-hidden="true" />
        </div>
        <div class="row-divider"></div>
        <div class="menu-row">
          <span class="menu-label">Terms of service</span>
          <IconChevronRight :size="16" class="chevron" aria-hidden="true" />
        </div>
      </div>

      <!-- about -->
      <div class="section-label">About</div>
      <div class="menu-card">
        <div class="info-row">
          <div class="info-label">Version</div>
          <div class="info-value">1.0.0</div>
        </div>
        <div class="row-divider"></div>
        <div class="menu-row">
          <span class="menu-label">Contact us</span>
          <IconChevronRight :size="16" class="chevron" aria-hidden="true" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  IconArrowLeft,
  IconChevronRight,
} from '@tabler/icons-vue'
import { useProfile } from '../../viewmodels/useProfile'

const router = useRouter()
const { profile, notificationSettings } = useProfile()
</script>

<style scoped>
.settings-view {
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

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 40px;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0 14px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f8f7f5;
  border: 0.5px solid #e2e0d8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b6b72;
  flex-shrink: 0;
}

.header-title {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.divider {
  height: 0.5px;
  background: #e2e0d8;
  margin: 0 -20px 20px;
}

.section-label {
  font-size: 11px;
  font-weight: 500;
  color: #a0a0a8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.menu-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: 20px;
}

.info-row {
  padding: 14px 16px;
}

.info-label {
  font-size: 11px;
  color: #a0a0a8;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
}

.row-divider {
  height: 0.5px;
  background: #e2e0d8;
  margin: 0 16px;
}

.menu-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
}
.menu-row:hover { background: #f8f7f5; }

.menu-label {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
}

.chevron { color: #a0a0a8; }

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.toggle-label {
  font-size: 14px;
  color: #1a1a1a;
}

.toggle {
  width: 44px;
  height: 24px;
  border-radius: var(--r-pill);
  background: #e2e0d8;
  position: relative;
  cursor: pointer;
  transition: background 0.25s ease;
  flex-shrink: 0;
}
.toggle.on { background: var(--ch-gold); }

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.25s ease;
}
.toggle.on .toggle-thumb { transform: translateX(20px); }
</style>
