<template>
  <div class="org-shell">

    <div class="sidebar">
      <div class="sidebar-accent"></div>

      <div class="sidebar-logo">
        <CharisLogo role="org" />
        <p class="portal-label">Organization portal</p>
      </div>

      <nav class="sidebar-nav" aria-label="Organization navigation">

        <div class="nav-section">
          <p class="nav-label">Overview</p>
          <router-link to="/org/dashboard" class="nav-item">
            <IconLayoutDashboard :size="16" aria-hidden="true" />
            Dashboard
          </router-link>
          <router-link to="/org/events" class="nav-item">
            <IconCalendarEvent :size="16" aria-hidden="true" />
            Events
          </router-link>
        </div>

        <div class="nav-section">
          <p class="nav-label">Growth</p>
          <router-link to="/org/approvals" class="nav-item">
            <IconUserCheck :size="16" aria-hidden="true" />
            <span>Volunteer approval</span>
            <span v-if="pendingCount > 0" class="nav-badge">{{ pendingCount }}</span>
          </router-link>
          <router-link to="/org/vendors" class="nav-item">
            <IconBuildingStore :size="16" aria-hidden="true" />
            Vendors
          </router-link>
        </div>

        <div class="nav-section">
          <p class="nav-label">Account</p>
          <router-link to="/org/settings" class="nav-item">
            <IconSettings :size="16" aria-hidden="true" />
            Settings
          </router-link>
        </div>

      </nav>

      <div class="sidebar-footer">
        <div class="org-avatar" aria-hidden="true">
          {{ orgInitials }}
        </div>
        <div class="org-info">
          <p class="org-name">{{ orgName }}</p>
          <p class="org-role">Admin</p>
        </div>
      </div>
    </div>

    <div class="shell-main">
      <router-view />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconLayoutDashboard,
  IconCalendarEvent,
  IconUserCheck,
  IconBuildingStore,
  IconSettings,
} from '@tabler/icons-vue'
import CharisLogo from '../common/CharisLogo.vue'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'

const authStore = useAuthStore()
const orgStore  = useOrgStore()

const orgName = computed(() => authStore.org?.name ?? 'Organization')

const orgInitials = computed(() => {
  const words = orgName.value.trim().split(' ')
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
})

const pendingCount = computed(() =>
  orgStore.checkinVolunteers.length > 0
    ? orgStore.checkinVolunteers.filter(v => v.approvalStatus === 'pending').length
    : 0
)
</script>

<style scoped>
.org-shell {
  display: flex;
  min-height: 100vh;
  background: #f8f7f5;
  font-family: var(--font-main);
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 0.5px solid #e2e0d8;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-accent {
  height: 4px;
  background: linear-gradient(90deg, var(--ch-gold) 0%, var(--ch-blue-mid) 100%);
  flex-shrink: 0;
}

.sidebar-logo {
  padding: 16px 20px 14px;
  border-bottom: 0.5px solid #e2e0d8;
}

.portal-label {
  font-size: 10px;
  color: #a0a0a8;
  margin-top: 2px;
}

/* ─── Nav ─────────────────────────────────────────────────────────────────── */

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
}

.nav-section {
  padding: 8px 12px 4px;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  color: #a0a0a8;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 4px 8px 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 400;
  color: #6b6b72;
  text-decoration: none;
  margin-bottom: 1px;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: #f0ede8;
  color: #1a1a1a;
}

.nav-item.router-link-active {
  background: var(--ch-blue-soft);
  color: var(--ch-blue);
  font-weight: 500;
}

.nav-badge {
  margin-left: auto;
  background: var(--ch-blue);
  color: #ffffff;
  font-size: 10px;
  font-weight: 500;
  border-radius: var(--r-pill);
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */

.sidebar-footer {
  padding: 14px 20px;
  border-top: 0.5px solid #e2e0d8;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.org-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--ch-blue-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  color: var(--ch-blue);
  flex-shrink: 0;
}

.org-name {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.org-role {
  font-size: 10px;
  color: #a0a0a8;
}

/* ─── Main content area ───────────────────────────────────────────────────── */

.shell-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
}
</style>