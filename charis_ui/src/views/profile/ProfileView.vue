<template>
  <div class="profile-view">
    <div class="accent-bar"></div>

    <div class="profile-body">

      <!-- header -->
      <div class="profile-header">
        <div class="header-title">Profile</div>
        <div class="settings-btn" @click="goToSettings">
          <IconSettings :size="18" aria-hidden="true" />
        </div>
      </div>
      <div class="divider"></div>

      <!-- avatar + name -->
      <div class="identity">
        <div class="avatar">{{ initials }}</div>
        <div class="full-name">{{ profile.name }}</div>
        <div class="username">@{{ profile.username }}</div>
      </div>

      <!-- stats -->
      <div class="stats-row">
        <StatCard :value="profile.eventsJoined"     label="Events" />
        <div class="stat-div"></div>
        <StatCard :value="profile.hoursVolunteered + 'h'" label="Volunteered" />
        <div class="stat-div"></div>
        <StatCard :value="profile.couponsUsed"      label="Coupons used" />
      </div>

      <!-- following orgs -->
      <div class="section-header">
        <span class="section-title">Following</span>
        <span class="see-all">See all</span>
      </div>

      <OrgRow
        v-for="org in followedOrgs"
        :key="org.id"
        :org="org"
        @select="goToOrgDetail"
      />

      <!-- settings rows -->
      <div class="menu-card">
        <div class="menu-row" @click="goToSettings">
          <IconUser :size="18" aria-hidden="true" />
          <span class="menu-label">Edit profile</span>
          <IconChevronRight :size="16" class="menu-chevron" aria-hidden="true" />
        </div>
        <div class="menu-divider"></div>
        <div class="menu-row" @click="goToSettings">
          <IconBell :size="18" aria-hidden="true" />
          <span class="menu-label">Notifications</span>
          <IconChevronRight :size="16" class="menu-chevron" aria-hidden="true" />
        </div>
        <div class="menu-divider"></div>
        <div class="menu-row" @click="goToSettings">
          <IconHelp :size="18" aria-hidden="true" />
          <span class="menu-label">Help & support</span>
          <IconChevronRight :size="16" class="menu-chevron" aria-hidden="true" />
        </div>
      </div>

      <!-- logout -->
      <div class="logout-card" @click="logout">
        <IconLogout :size="18" aria-hidden="true" />
        <span class="logout-label">Log out</span>
      </div>

    </div>

    <!-- bottom nav -->
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

  </div>
</template>

<script setup lang="ts">
import {
  IconSettings,
  IconUser,
  IconBell,
  IconHelp,
  IconLogout,
  IconChevronRight,
  IconHome,
  IconCompass,
  IconWallet,
} from '@tabler/icons-vue'
import { useProfile } from '../../viewmodels/useProfile'
import StatCard from '../../components/profile/StatCard.vue'
import OrgRow from '../../components/org/OrgRow.vue'
import { computed } from 'vue'

const {
  profile,
  followedOrgs,
  goToSettings,
  goToOrgDetail,
  logout,
} = useProfile()

const initials = computed(() =>
  profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
)
</script>

<style scoped>
.profile-view {
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

.profile-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 90px;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 14px;
}

.header-title {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.settings-btn {
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
}

.divider {
  height: 0.5px;
  background: #e2e0d8;
  margin: 0 -20px;
}

.identity {
  text-align: center;
  padding: 28px 0 20px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--ch-gold-soft);
  border: 2px solid #c9920e44;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  font-size: 24px;
  font-weight: 500;
  color: var(--ch-gold);
}

.full-name {
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.username {
  font-size: 13px;
  color: #a0a0a8;
}

.stats-row {
  display: flex;
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: 20px;
}

.stat-div {
  width: 0.5px;
  background: #e2e0d8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.see-all {
  font-size: 13px;
  font-weight: 500;
  color: var(--ch-gold);
  cursor: pointer;
}

.menu-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: 10px;
}

.menu-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  color: #6b6b72;
  transition: background 0.15s;
}
.menu-row:hover { background: #f8f7f5; }

.menu-label {
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
}

.menu-chevron { color: #a0a0a8; }

.menu-divider {
  height: 0.5px;
  background: #e2e0d8;
  margin: 0 16px;
}

.logout-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #f87171;
  margin-bottom: 20px;
  transition: background 0.15s;
}
.logout-card:hover { background: #fff5f5; }

.logout-label {
  font-size: 14px;
  font-weight: 500;
  color: #f87171;
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
