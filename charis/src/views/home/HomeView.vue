<template>
  <div class="home-view">

    <!-- accent bar -->
    <div class="accent-bar"></div>

    <!-- PINNED TOP: header + orgs -->
    <div class="home-top">

      <div class="home-header">
        <div class="home-title">Home</div>
        <div class="avatar-btn" @click="goToProfile">
          <span class="avatar-initials">KL</span>
        </div>
      </div>

      <div class="top-divider"></div>

      <div class="section-header">
        <span class="section-title">Organizations</span>
        <span class="see-all">See all</span>
      </div>

      <div class="orgs-scroll">
        <OrgCard
          v-for="org in organizations"
          :key="org.id"
          :org="org"
          @select="onOrgSelect"
        />
      </div>

      <div class="top-divider"></div>

    </div>

    <!-- SCROLLABLE: events -->
    <div class="home-content">

      <div class="events-title">Events</div>

      <div class="pill-row">
        <button
          v-for="pill in eventPills"
          :key="pill.value"
          class="pill"
          :class="{ active: activeFilter === pill.value }"
          @click="setFilter(pill.value)"
        >
          {{ pill.label }}
        </button>
      </div>

      <!-- empty states -->
      <div
        v-if="visibleEvents.length === 0 && activeFilter === 'saved'"
        class="empty-state"
      >
        <IconBookmark :size="32" class="empty-icon" aria-hidden="true" />
        <p>No saved events yet</p>
      </div>

      <div
        v-else-if="visibleEvents.length === 0 && activeFilter === 'groups'"
        class="empty-state"
      >
        <IconCalendarOff :size="32" class="empty-icon" aria-hidden="true" />
        <p>No events to show</p>
      </div>

      <!-- event list -->
      <EventCard
        v-for="event in visibleEvents"
        :key="event.id"
        :event="event"
        :is-joined="isJoined(event.id)"
        @join="toggleJoin"
      />

    </div>

    <!-- BOTTOM NAV -->
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
import { useRouter } from 'vue-router'
import {
  IconBookmark,
  IconCalendarOff,
  IconHome,
  IconCompass,
  IconWallet,
} from '@tabler/icons-vue'
import { useHome } from '../../viewmodels/useHome'
import EventCard from '../../components/events/EventCard.vue'
import OrgCard from '../../components/org/OrgCard.vue'

const router = useRouter()

const {
  activeFilter,
  organizations,
  visibleEvents,
  setFilter,
  toggleJoin,
  isJoined,
} = useHome()

const eventPills = [
  { label: 'Your groups', value: 'groups' as const },
  { label: 'Join',        value: 'join'   as const },
  { label: 'Saved',       value: 'saved'  as const },
  { label: 'Past',        value: 'past'   as const },
]

function goToProfile() {
  router.push('/profile')
}

function onOrgSelect(id: string) {
  router.push(`/org/${id}`)
}
</script>

<style scoped>
.home-view {
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

.home-top {
  flex-shrink: 0;
  background: #f8f7f5;
  padding: 0 20px;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 14px;
}

.home-title {
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: -0.3px;
}

.avatar-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--ch-gold-soft);
  border: 0.5px solid var(--ch-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-initials {
  font-size: 13px;
  font-weight: 500;
  color: var(--ch-gold);
}

.top-divider {
  height: 0.5px;
  background: #e2e0d8;
  margin: 0 -20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 12px;
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

.orgs-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 16px;
}
.orgs-scroll::-webkit-scrollbar { display: none; }

.home-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 90px;
  background: #f8f7f5;
}
.home-content::-webkit-scrollbar { width: 3px; }
.home-content::-webkit-scrollbar-thumb { background: #e2e0d8; border-radius: 3px; }

.events-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  padding: 16px 0 14px;
}

.pill-row {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.pill-row::-webkit-scrollbar { display: none; }

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
.nav-item.router-link-active {
  color: var(--ch-gold);
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  font-family: var(--font-main);
}
</style>