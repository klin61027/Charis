<template>
  <div class="org-detail-view">
    <div class="accent-bar"></div>

    <div style="overflow-y:auto;flex:1;padding-bottom:80px;">

      <!-- back -->
      <div class="back-row">
        <div class="back-btn" @click="router.back()">
          <IconArrowLeft :size="16" aria-hidden="true" />
        </div>
      </div>

      <!-- cover -->
      <div class="cover-banner">
        <div class="org-logo">
          <IconBuildingCommunity :size="28" :style="{ color: accentColor, opacity: 0.5 }" aria-hidden="true" />
        </div>
      </div>

      <!-- org info -->
      <div class="org-info-section">
        <div class="org-name">{{ org?.name }}</div>
        <div class="org-meta">{{ categoryLabel }} · Seattle, WA · {{ formatCount(stats.followers) }} followers</div>

        <!-- follower avatars -->
        <div class="follower-row">
          <div class="mini-avatars">
            <div class="mini-av">A</div>
            <div class="mini-av">B</div>
          </div>
          <span class="follower-text">Kevin & 42 others follow this org</span>
        </div>

        <!-- action buttons -->
        <div class="action-row">
          <button class="btn-follow" :class="{ following: isFollowing }" @click="toggleFollow">
            <IconCheck v-if="isFollowing" :size="14" aria-hidden="true" />
            <IconPlus v-else :size="14" aria-hidden="true" />
            {{ isFollowing ? 'Following' : 'Follow' }}
          </button>
          <button class="btn-website">
            <IconWorld :size="14" aria-hidden="true" />
            Website
          </button>
          <button class="btn-more">
            <IconDots :size="16" aria-hidden="true" />
          </button>
        </div>

        <!-- tab bar -->
        <div class="tab-bar">
          <div
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeTab === tab.value }"
            @click="setTab(tab.value)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>

      <!-- HOME TAB -->
      <div v-if="activeTab === 'home'" class="tab-content">
        <div class="overview-card">
          <div class="card-title">Overview</div>
          <div class="card-text">{{ orgDescription }}</div>
        </div>

        <div class="stats-strip">
          <div class="stat-box">
            <div class="stat-val">{{ stats.events }}</div>
            <div class="stat-lbl">Events</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">{{ formatCount(stats.followers) }}</div>
            <div class="stat-lbl">Followers</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">{{ stats.hours }}h</div>
            <div class="stat-lbl">Volunteered</div>
          </div>
        </div>

        <div class="section-title">Upcoming Events</div>
        <EventCard
          v-for="event in orgEvents"
          :key="event.id"
          :event="event"
          :is-joined="false"
          @open-form="openForm"
        />
      </div>

      <!-- ABOUT TAB -->
      <div v-else-if="activeTab === 'about'" class="tab-content">
        <div class="info-card">
          <div class="info-row">
            <div class="info-label">Mission</div>
            <div class="info-value">Ensuring Washington residents have access to nutritious food while building a stronger, hunger-free community.</div>
          </div>
          <div class="row-divider"></div>
          <div class="info-row">
            <div class="info-label">Category</div>
            <div class="info-value">{{ categoryLabel }}</div>
          </div>
          <div class="row-divider"></div>
          <div class="info-row">
            <div class="info-label">Location</div>
            <div class="info-value">Seattle, Washington</div>
          </div>
          <div class="row-divider"></div>
          <div class="info-row">
            <div class="info-label">Website</div>
            <div class="info-value gold">northwestharvest.org</div>
          </div>
          <div class="row-divider"></div>
          <div class="info-row">
            <div class="info-label">Founded</div>
            <div class="info-value">1967</div>
          </div>
        </div>
      </div>

      <!-- EVENTS TAB -->
      <div v-else-if="activeTab === 'events'" class="tab-content">
        <div class="sub-label">Upcoming</div>
        <div v-for="event in orgEvents" :key="event.id" class="event-list-card">
          <div class="elc-bar" :style="{ background: categoryGradient(event.category) }"></div>
          <div class="elc-body">
            <div class="elc-top">
              <div class="elc-title">{{ event.title }}</div>
              <span class="elc-badge" :style="badgeStyle(event.category)">{{ event.category }}</span>
            </div>
            <div class="elc-meta"><IconCalendar :size="12" aria-hidden="true" /> {{ event.date }} · {{ event.time }}</div>
            <div class="elc-meta"><IconMapPin :size="12" aria-hidden="true" /> {{ event.location }}</div>
            <div class="elc-footer">
              <span class="elc-count">{{ event.attendeeCount }}/{{ event.attendeeMax }} going</span>
              <button class="join-btn" @click="openForm(event)">Join</button>
            </div>
          </div>
        </div>

        <div class="sub-label" style="margin-top:16px;">Past</div>
        <div v-for="event in pastOrgEvents" :key="event.id" class="event-list-card past">
          <div class="elc-bar" style="background:#e2e0d8;"></div>
          <div class="elc-body">
            <div class="elc-top">
              <div class="elc-title">{{ event.title }}</div>
              <span class="elc-badge ended">Ended</span>
            </div>
            <div class="elc-meta"><IconCalendar :size="12" aria-hidden="true" /> {{ event.date }} · {{ event.time }}</div>
            <div class="elc-meta"><IconMapPin :size="12" aria-hidden="true" /> {{ event.location }}</div>
          </div>
        </div>
      </div>

      <!-- VOLUNTEERS TAB -->
      <div v-else-if="activeTab === 'volunteers'" class="tab-content">
        <div class="stats-strip">
          <div class="stat-box">
            <div class="stat-val">{{ stats.volunteers }}</div>
            <div class="stat-lbl">Total volunteers</div>
          </div>
          <div class="stat-box">
            <div class="stat-val">{{ stats.hours }}h</div>
            <div class="stat-lbl">Hours given</div>
          </div>
        </div>

        <div class="sub-label">Top volunteers</div>
        <VolunteerRow
          v-for="(vol, i) in volunteers"
          :key="vol.id"
          :volunteer="vol"
          :rank="i + 1"
        />

        <div class="sub-label" style="margin-top:16px;">Recent activity</div>
        <div v-for="act in recentActivity" :key="act.id" class="recent-row">
          <div class="recent-av">{{ act.initials }}</div>
          <div class="recent-info">
            <div class="recent-name">{{ act.name }}</div>
            <div class="recent-meta">Joined {{ act.eventTitle }} · {{ act.daysAgo }} days ago</div>
          </div>
        </div>
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

    <JoinFormSheet
      :is-open="isOpen"
      :is-submitted="isSubmitted"
      :is-loading="isLoading"
      :error="error"
      :active-event="activeEvent"
      :question1="question1"
      :question2="question2"
      :question3="question3"
      :form="form"
      @close="closeForm"
      @submit="() => submitForm(() => {})"
      @update:question1="question1 = $event"
      @update:question2="question2 = $event"
      @update:question3="question3 = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IconArrowLeft,
  IconBuildingCommunity,
  IconCheck,
  IconPlus,
  IconWorld,
  IconDots,
  IconCalendar,
  IconMapPin,
  IconHome,
  IconCompass,
  IconWallet,
} from '@tabler/icons-vue'
import { useOrgDetail } from '../../viewmodels/useOrgDetail'
import { useJoinForm } from '../../viewmodels/useJoinForm'
import EventCard from '../../components/events/EventCard.vue'
import JoinFormSheet from '../../components/events/JoinFormSheet.vue'
import VolunteerRow from '../../components/org/VolunteerRow.vue'
import type { EventCategory } from '../../models/types/event.types'

const router = useRouter()
const route  = useRoute()
const orgId  = route.params.id as string

const {
  activeTab,
  isFollowing,
  org,
  orgEvents,
  pastOrgEvents,
  stats,
  volunteers,
  recentActivity,
  setTab,
  toggleFollow,
} = useOrgDetail(orgId)

const {
  isOpen, isSubmitted, isLoading, error,
  activeEvent, question1, question2, question3, form,
  openForm, closeForm, submitForm,
} = useJoinForm()

const tabs = [
  { label: 'Home',       value: 'home'       as const },
  { label: 'About',      value: 'about'      as const },
  { label: 'Events',     value: 'events'     as const },
  { label: 'Volunteers', value: 'volunteers' as const },
]

const categoryAccents: Record<string, string> = {
  food:        '#c9920e',
  environment: '#2563eb',
  community:   '#a78bfa',
}

const categoryLabels: Record<string, string> = {
  food:        'Food rescue',
  environment: 'Environment',
  community:   'Community',
}

const orgDescriptions: Record<string, string> = {
  food:        'Working to ensure everyone has access to nutritious food. We partner with local food banks and community organizations across King County.',
  environment: 'Dedicated to preserving and enhancing Seattle\'s parks, open spaces, and urban forests for future generations.',
  community:   'Building stronger communities through local engagement, shared resources, and volunteer-driven programs.',
}

const accentColor   = computed(() => categoryAccents[org.value?.category ?? 'food'])
const categoryLabel = computed(() => categoryLabels[org.value?.category ?? 'food'])
const orgDescription = computed(() => orgDescriptions[org.value?.category ?? 'food'])

const categoryStyles: Record<EventCategory, { color: string; bg: string }> = {
  volunteer:  { color: '#a78bfa', bg: '#a78bfa18' },
  community:  { color: '#34d399', bg: '#34d39918' },
  workshop:   { color: '#2563eb', bg: '#2563eb12' },
  fundraiser: { color: '#f59e0b', bg: '#f59e0b18' },
}

function badgeStyle(category: EventCategory) {
  return categoryStyles[category]
}

function categoryGradient(category: EventCategory) {
  const colors: Record<EventCategory, string> = {
    volunteer:  'linear-gradient(90deg,#a78bfa,#2563eb)',
    community:  'linear-gradient(90deg,#34d399,#2563eb)',
    fundraiser: 'linear-gradient(90deg,#f59e0b,#f87171)',
    workshop:   'linear-gradient(90deg,#2563eb,#a78bfa)',
  }
  return colors[category]
}

function formatCount(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString()
}
</script>

<style scoped>
.org-detail-view {
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
.back-row {
  padding: 14px 20px 0;
}
.back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8f7f5;
  border: 0.5px solid #e2e0d8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b6b72;
}
.cover-banner {
  height: 100px;
  background: linear-gradient(135deg, #c9920e22, #f0ede8);
  position: relative;
  margin-top: 8px;
}
.org-logo {
  position: absolute;
  bottom: -24px;
  left: 20px;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #ffffff;
  border: 2px solid #e2e0d8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.org-info-section { padding: 32px 20px 0; }
.org-name { font-size: 18px; font-weight: 500; color: #1a1a1a; margin-bottom: 3px; }
.org-meta { font-size: 12px; color: #a0a0a8; margin-bottom: 10px; }
.follower-row { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
.mini-avatars { display: flex; }
.mini-av {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f0ede8;
  border: 1.5px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 500;
  color: #6b6b72;
}
.mini-av + .mini-av { margin-left: -6px; }
.follower-text { font-size: 12px; color: #6b6b72; }
.action-row { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
.btn-follow {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 500;
  border: 1.5px solid #e2e0d8;
  background: #ffffff;
  color: #1a1a1a;
  cursor: pointer;
  font-family: var(--font-main);
  transition: all 0.2s;
}
.btn-follow.following {
  border-color: var(--ch-gold);
  background: var(--ch-gold-soft);
  color: var(--ch-gold);
}
.btn-website {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--r-pill);
  font-size: 13px;
  font-weight: 500;
  border: 0.5px solid #e2e0d8;
  background: #ffffff;
  color: #1a1a1a;
  cursor: pointer;
  font-family: var(--font-main);
}
.btn-more {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0.5px solid #e2e0d8;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b6b72;
}
.tab-bar {
  display: flex;
  border-bottom: 0.5px solid #e2e0d8;
  margin: 0 -20px;
  padding: 0 20px;
  gap: 20px;
  overflow-x: auto;
  scrollbar-width: none;
}
.tab-bar::-webkit-scrollbar { display: none; }
.tab-item {
  padding-bottom: 10px;
  font-size: 13px;
  color: #a0a0a8;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.15s;
}
.tab-item.active {
  font-weight: 500;
  color: var(--ch-gold);
  border-bottom: 2px solid var(--ch-gold);
}
.tab-content { padding: 16px 20px; }
.overview-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 14px 16px;
  margin-bottom: 14px;
}
.card-title { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 8px; }
.card-text  { font-size: 13px; color: #6b6b72; line-height: 1.6; }
.stats-strip {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.stat-box {
  flex: 1;
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 12px;
  text-align: center;
}
.stat-val { font-size: 18px; font-weight: 500; color: #1a1a1a; }
.stat-lbl { font-size: 11px; color: #a0a0a8; margin-top: 2px; }
.section-title { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 10px; }
.sub-label {
  font-size: 11px;
  font-weight: 500;
  color: #a0a0a8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}
.info-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: 14px;
}
.info-row { padding: 14px 16px; }
.info-label { font-size: 11px; color: #a0a0a8; margin-bottom: 2px; }
.info-value { font-size: 13px; color: #1a1a1a; line-height: 1.5; }
.info-value.gold { color: var(--ch-gold); cursor: pointer; }
.row-divider { height: 0.5px; background: #e2e0d8; margin: 0 16px; }
.event-list-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: 12px;
  cursor: pointer;
}
.event-list-card.past { opacity: 0.65; }
.elc-bar { height: 3px; }
.elc-body { padding: 14px 16px; }
.elc-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}
.elc-title { font-size: 14px; font-weight: 500; color: #1a1a1a; line-height: 1.3; }
.elc-badge {
  font-size: 11px;
  font-weight: 500;
  border-radius: var(--r-pill);
  padding: 3px 8px;
  flex-shrink: 0;
  text-transform: capitalize;
}
.elc-badge.ended { color: #a0a0a8; background: #a0a0a818; }
.elc-meta {
  font-size: 12px;
  color: #6b6b72;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 3px;
}
.elc-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.elc-count { font-size: 11px; color: #a0a0a8; }
.join-btn {
  padding: 6px 14px;
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 500;
  border: 0.5px solid #e2e0d8;
  background: transparent;
  color: #1a1a1a;
  font-family: var(--font-main);
  cursor: pointer;
}
.recent-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 0.5px solid #e2e0d8;
}
.recent-row:last-child { border-bottom: none; }
.recent-av {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0ede8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: #6b6b72;
  flex-shrink: 0;
}
.recent-name { font-size: 13px; font-weight: 500; color: #1a1a1a; }
.recent-meta { font-size: 11px; color: #a0a0a8; margin-top: 2px; }
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
.nav-label { font-size: 10px; font-weight: 500; font-family: var(--font-main); }
</style>
