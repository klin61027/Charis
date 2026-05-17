<template>
  <div class="home-view">

    <div class="home-header">
      <div class="home-title">Home</div>
      <div class="avatar-btn">
        <span class="avatar-initials">KL</span>
      </div>
    </div>

    <div class="home-content">

      <!-- Organizations -->
      <div class="section-header">
        <span class="section-title">Organizations</span>
        <span class="see-all">See all</span>
      </div>

      <div class="orgs-scroll">
        <div v-for="org in organizations" :key="org.id" class="org-card">
          <div class="org-img">
            <img :src="org.imageUrl" :alt="org.name" />
          </div>
          <div class="org-name">{{ org.name }}</div>
        </div>
      </div>

      <!-- Events -->
      <div class="events-section">
        <div class="events-title">Events</div>

        <div class="pill-row">
          <button
            v-for="pill in eventPills"
            :key="pill.value"
            class="pill"
            :class="{ active: activeFilter === pill.value }"
            @click="activeFilter = pill.value"
          >
            {{ pill.label }}
          </button>
        </div>

        <!-- Join tab -->
        <template v-if="activeFilter === 'join'">
          <div v-for="event in mockEvents" :key="event.id" class="event-card">
            <div v-if="event.hasImage" class="event-img">
              <img :src="event.imageUrl" :alt="event.title" />
              <div class="event-img-gradient"></div>
            </div>
            <div class="event-body">
              <div class="event-top">
                <div class="event-title">{{ event.title }}</div>
                <span class="badge" :style="badgeStyle(event.category)">
                  {{ event.category }}
                </span>
              </div>
              <div class="event-meta">
                <IconCalendar :size="12" aria-hidden="true" />
                {{ event.date }} · {{ event.time }}
              </div>
              <div class="event-meta">
                <IconMapPin :size="12" aria-hidden="true" />
                {{ event.location }}
              </div>
              <div class="event-footer">
                <div class="attendees">
                  <div class="avatar-stack">
                    <div v-for="(att, i) in event.attendees" :key="i" class="av">
                      {{ att.initial }}
                    </div>
                  </div>
                  <span class="attendee-text">
                    {{ event.attendeeCount }}/{{ event.attendeeMax }} going
                  </span>
                </div>
                <button
                  class="action-btn"
                  :class="{ joined: joinedIds.has(event.id) }"
                  @click.stop="toggleJoin(event.id)"
                >
                  {{ joinedIds.has(event.id) ? 'Joined' : 'Join' }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Your groups tab -->
        <template v-else-if="activeFilter === 'groups'">
          <div v-for="event in mockEvents.slice(1, 2)" :key="event.id" class="event-card">
            <div v-if="event.hasImage" class="event-img">
              <img :src="event.imageUrl" :alt="event.title" />
              <div class="event-img-gradient"></div>
            </div>
            <div class="event-body">
              <div class="event-top">
                <div class="event-title">{{ event.title }}</div>
                <span class="badge" :style="badgeStyle(event.category)">
                  {{ event.category }}
                </span>
              </div>
              <div class="event-meta">
                <IconCalendar :size="12" aria-hidden="true" />
                {{ event.date }} · {{ event.time }}
              </div>
              <div class="event-meta">
                <IconMapPin :size="12" aria-hidden="true" />
                {{ event.location }}
              </div>
              <div class="event-footer">
                <div class="attendees">
                  <div class="avatar-stack">
                    <div v-for="(att, i) in event.attendees" :key="i" class="av">
                      {{ att.initial }}
                    </div>
                  </div>
                  <span class="attendee-text">
                    {{ event.attendeeCount }}/{{ event.attendeeMax }} going
                  </span>
                </div>
                <button class="action-btn joined">Joined</button>
              </div>
            </div>
          </div>
        </template>

        <!-- Saved tab -->
        <template v-else-if="activeFilter === 'saved'">
          <div class="empty-state">
            <IconBookmark :size="32" class="empty-icon" aria-hidden="true" />
            <p>No saved events yet</p>
          </div>
        </template>

        <!-- Past tab -->
        <template v-else-if="activeFilter === 'past'">
          <div v-for="event in pastEvents" :key="event.id" class="event-card past-card">
            <div v-if="event.hasImage" class="event-img">
              <img :src="event.imageUrl" :alt="event.title" />
              <div class="event-img-gradient"></div>
            </div>
            <div class="event-body">
              <div class="event-top">
                <div class="event-title">{{ event.title }}</div>
                <span class="badge" :style="badgeStyle(event.category)">
                  {{ event.category }}
                </span>
              </div>
              <div class="event-meta">
                <IconCalendar :size="12" aria-hidden="true" />
                {{ event.date }} · {{ event.time }}
              </div>
              <div class="event-meta">
                <IconMapPin :size="12" aria-hidden="true" />
                {{ event.location }}
              </div>
              <div class="event-footer">
                <span class="attendee-text">
                  {{ event.attendeeCount }}/{{ event.attendeeMax }} attended
                </span>
                <span class="attended-badge">Attended</span>
              </div>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCalendar, IconMapPin, IconBookmark } from '@tabler/icons-vue'
import { mockEvents, pastEvents } from '../../data/events'
import { mockOrganizations } from '../../data/organizations'

const organizations = mockOrganizations
const activeFilter = ref<string>('join')
const joinedIds = ref<Set<string>>(new Set())

const eventPills = [
  { label: 'Your groups', value: 'groups' },
  { label: 'Join',        value: 'join'   },
  { label: 'Saved',       value: 'saved'  },
  { label: 'Past',        value: 'past'   },
]

function toggleJoin(id: string) {
  if (joinedIds.value.has(id)) {
    joinedIds.value.delete(id)
  } else {
    joinedIds.value.add(id)
  }
  joinedIds.value = new Set(joinedIds.value)
}

const categoryColors: Record<string, { color: string; bg: string }> = {
  volunteer: { color: '#c9920e', bg: '#c9920e12' },
  community: { color: '#2563eb', bg: '#2563eb12' },
  workshop:  { color: '#7c5cbf', bg: '#7c5cbf18' },
}

function badgeStyle(category: string) {
  const c = categoryColors[category] ?? { color: '#6b6b72', bg: 'transparent' }
  return { color: c.color, background: c.bg }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f7f5;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 16px;
  flex-shrink: 0;
}

.home-title {
  font-size: 30px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.avatar-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--ch-gold-soft);
  border: 0.5px solid var(--ch-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.avatar-initials {
  font-size: 13px;
  font-weight: 500;
  color: var(--ch-gold);
}

.home-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 90px;
}

.home-content::-webkit-scrollbar { width: 3px; }
.home-content::-webkit-scrollbar-thumb { background: #e2e0d8; border-radius: 3px; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 14px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
}

.see-all {
  font-size: 13px;
  color: var(--ch-gold);
  font-weight: 500;
  cursor: pointer;
}

.orgs-scroll {
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
  overflow-x: auto;
  scrollbar-width: none;
}
.orgs-scroll::-webkit-scrollbar { display: none; }

.org-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  min-width: 150px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.org-card:hover { background: #f0ede8; }

.org-img {
  height: 80px;
  overflow: hidden;
}

.org-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.org-name {
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
}

.events-section { padding: 0 20px; }

.events-title {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 14px;
}

.pill-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
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
  cursor: pointer;
  background: #ffffff;
  white-space: nowrap;
  font-family: var(--font-main);
  transition: all 0.15s;
}
.pill.active {
  background: var(--ch-gold);
  color: #ffffff;
  border-color: var(--ch-gold);
  font-weight: 500;
}

.event-card {
  background: #ffffff;
  border: 0.5px solid #e2e0d8;
  border-radius: var(--r-md);
  margin-bottom: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.15s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.event-card:hover { background: #f0ede8; }
.past-card { opacity: 0.6; }

.event-img {
  height: 130px;
  position: relative;
  overflow: hidden;
}

.event-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-img-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, #ffffff);
}

.event-body { padding: 14px 16px; }

.event-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
}

.event-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  text-transform: capitalize;
}

.event-meta {
  font-size: 12px;
  color: #6b6b72;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.attendees {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-stack { display: flex; }

.av {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 500;
  border: 2px solid #ffffff;
  background: #f0ede8;
  color: #6b6b72;
}
.av + .av { margin-left: -8px; }

.attendee-text {
  font-size: 11px;
  color: #a0a0a8;
}

.action-btn {
  padding: 7px 16px;
  border-radius: var(--r-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 0.5px solid #e2e0d8;
  background: transparent;
  color: #1a1a1a;
  font-family: var(--font-main);
  transition: all 0.15s;
}
.action-btn.joined {
  background: var(--ch-gold-soft);
  color: var(--ch-gold);
  border-color: var(--ch-gold);
}

.attended-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 500;
  color: #0d9e6e;
  background: #0d9e6e15;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a0a0a8;
  font-size: 13px;
}

.empty-icon {
  display: block;
  margin: 0 auto 10px;
  opacity: 0.3;
}
</style>
