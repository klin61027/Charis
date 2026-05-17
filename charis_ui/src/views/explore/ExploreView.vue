<template>
  <div class="explore-view">
    <div class="accent-bar"></div>

    <div class="explore-top">
      <div class="explore-header">
        <div class="explore-title">Explore</div>
      </div>
      <div class="top-divider"></div>

      <!-- search -->
      <div class="search-wrap">
        <div class="search-bar">
          <IconSearch :size="16" aria-hidden="true" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search events, orgs..."
            class="search-input"
          />
        </div>
      </div>

      <!-- category filters -->
      <div class="filter-row">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-pill"
          :class="{ active: activeFilter === f.value }"
          @click="setFilter(f.value)"
        >
          <i :class="`ti ${f.icon}`" aria-hidden="true"></i>
          {{ f.label }}
        </button>
      </div>

      <div class="top-divider"></div>
    </div>

    <!-- results -->
    <div class="explore-content">
      <div class="results-label">{{ filteredEvents.length }} events near Seattle</div>

      <div v-if="filteredEvents.length === 0" class="empty-state">
        <IconCalendarOff :size="32" class="empty-icon" aria-hidden="true" />
        <p>No events found</p>
      </div>

      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        :is-joined="false"
        @open-form="openForm"
      />
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

    <!-- join form sheet -->
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
import {
  IconSearch,
  IconCalendarOff,
  IconHome,
  IconCompass,
  IconWallet,
} from '@tabler/icons-vue'
import { useExplore } from '../../viewmodels/useExplore'
import { useJoinForm } from '../../viewmodels/useJoinForm'
import EventCard from '../../components/events/EventCard.vue'
import JoinFormSheet from '../../components/events/JoinFormSheet.vue'
import type { Event } from '../../models/types/event.types'

const {
  searchQuery,
  activeFilter,
  filters,
  filteredEvents,
  setFilter,
} = useExplore()

const {
  isOpen,
  isSubmitted,
  isLoading,
  error,
  activeEvent,
  question1,
  question2,
  question3,
  form,
  openForm,
  closeForm,
  submitForm,
} = useJoinForm()
</script>

<style scoped>
.explore-view {
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
.explore-top {
  flex-shrink: 0;
  background: #f8f7f5;
  padding: 0 20px;
}
.explore-header {
  padding: 16px 0 14px;
}
.explore-title {
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
.search-wrap { padding: 14px 0; }
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  padding: 0 14px;
  color: #a0a0a8;
}
.search-input {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1a1a1a;
  font-family: var(--font-main);
  outline: none;
}
.search-input::placeholder { color: #a0a0a8; }
.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 14px;
}
.filter-row::-webkit-scrollbar { display: none; }
.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 400;
  border: 0.5px solid #e2e0d8;
  background: #ffffff;
  color: #6b6b72;
  white-space: nowrap;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.15s;
}
.filter-pill i { font-size: 13px; }
.filter-pill.active {
  background: var(--ch-gold-soft);
  border-color: var(--ch-gold);
  color: var(--ch-gold);
  font-weight: 500;
}
.explore-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px 90px;
}
.results-label {
  font-size: 13px;
  color: #a0a0a8;
  margin-bottom: 12px;
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
.nav-item.router-link-active { color: var(--ch-gold); }
.nav-label {
  font-size: 10px;
  font-weight: 500;
  font-family: var(--font-main);
}
</style>
