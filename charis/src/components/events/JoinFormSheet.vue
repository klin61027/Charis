<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="isOpen" class="sheet-overlay" @click.self="$emit('close')">
        <div class="sheet">
          <div class="accent-bar"></div>
          <div class="sheet-body">

            <div class="handle-row">
              <div class="handle"></div>
            </div>

            <!-- submitted state -->
            <template v-if="isSubmitted">
              <div class="success-state">
                <div class="success-icon">
                  <IconCheck :size="32" aria-hidden="true" />
                </div>
                <div class="success-title">Application submitted!</div>
                <div class="success-sub">
                  {{ form?.organizationName }} will review your application and notify you shortly.
                </div>
              </div>
              <div class="event-summary">
                <div class="summary-icon" :style="iconBgStyle">
                  <component :is="categoryIcon" :size="20" aria-hidden="true" />
                </div>
                <div class="summary-info">
                  <div class="summary-title">{{ form?.eventTitle }}</div>
                  <div class="summary-meta">{{ form?.eventDate }} · {{ form?.eventLocation }}</div>
                </div>
                <div class="pending-badge">Pending</div>
              </div>
              <button class="btn-primary" @click="$emit('close')">
                Back to Home
              </button>
            </template>

            <!-- form state -->
            <template v-else>
              <div class="event-context">
                <div class="context-icon" :style="iconBgStyle">
                  <component :is="categoryIcon" :size="22" aria-hidden="true" />
                </div>
                <div>
                  <div class="context-title">{{ activeEvent?.title }}</div>
                  <div class="context-meta">{{ activeEvent?.organizationName }} · {{ activeEvent?.date }}</div>
                </div>
              </div>

              <div class="form-heading">
                <div class="form-title">Apply to join</div>
                <div class="form-sub">Answer a few questions for the organizer</div>
              </div>

              <div class="field">
                <label>Why do you want to join this event?</label>
                <textarea
                  :value="question1"
                  @input="$emit('update:question1', ($event.target as HTMLTextAreaElement).value)"
                  placeholder="Share your motivation..."
                  class="inp-textarea"
                  rows="3"
                />
              </div>

              <div class="field">
                <label>Do you have any relevant experience?</label>
                <textarea
                  :value="question2"
                  @input="$emit('update:question2', ($event.target as HTMLTextAreaElement).value)"
                  placeholder="e.g. previous volunteering, relevant skills..."
                  class="inp-textarea"
                  rows="3"
                />
              </div>

              <div class="field">
                <label>Anything the organizer should know?</label>
                <textarea
                  :value="question3"
                  @input="$emit('update:question3', ($event.target as HTMLTextAreaElement).value)"
                  placeholder="Dietary needs, accessibility requirements, etc."
                  class="inp-textarea"
                  rows="3"
                />
              </div>

              <div class="info-banner">
                <IconInfoCircle :size="15" aria-hidden="true" />
                <span>Your application will be reviewed by the organizer. You'll be notified once approved.</span>
              </div>

              <Transition name="fade">
                <p v-if="error" class="error-msg">{{ error }}</p>
              </Transition>

              <button
                class="btn-primary"
                :disabled="isLoading"
                @click="$emit('submit')"
              >
                {{ isLoading ? 'Submitting…' : 'Submit application' }}
              </button>

              <button class="btn-secondary" @click="$emit('close')">
                Cancel
              </button>
            </template>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconCheck,
  IconInfoCircle,
  IconHeartHandshake,
  IconTrees,
  IconCoin,
  IconSchool,
} from '@tabler/icons-vue'
import type { Event, EventCategory } from '../../models/types/event.types'
import type { ApplicationForm } from '../../models/types/application.types'

const props = defineProps<{
  isOpen:      boolean
  isSubmitted: boolean
  isLoading:   boolean
  error:       string | null
  activeEvent: Event | null
  question1:   string
  question2:   string
  question3:   string
  form:        ApplicationForm | null
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'update:question1', val: string): void
  (e: 'update:question2', val: string): void
  (e: 'update:question3', val: string): void
}>()

const categoryIconColors: Record<EventCategory, string> = {
  volunteer:  '#a78bfa',
  community:  '#34d399',
  fundraiser: '#f59e0b',
  workshop:   '#2563eb',
}

const categoryIcons: Record<EventCategory, unknown> = {
  volunteer:  IconHeartHandshake,
  community:  IconTrees,
  fundraiser: IconCoin,
  workshop:   IconSchool,
}

const iconBgStyle = computed(() => {
  const cat   = props.activeEvent?.category ?? 'volunteer'
  const color = categoryIconColors[cat]
  return { background: `${color}18`, color }
})

const categoryIcon = computed(() => {
  const cat = props.activeEvent?.category ?? 'volunteer'
  return categoryIcons[cat]
})
</script>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}
.sheet {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
}
.accent-bar {
  height: 4px;
  background: linear-gradient(90deg, var(--ch-gold) 0%, var(--ch-blue-mid) 100%);
  flex-shrink: 0;
}
.sheet-body {
  padding: 0 24px 40px;
  overflow-y: auto;
}
.handle-row {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
}
.handle {
  width: 36px;
  height: 4px;
  background: #e2e0d8;
  border-radius: var(--r-pill);
}
.event-context {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0 16px;
  border-bottom: 0.5px solid #e2e0d8;
  margin-bottom: 20px;
}
.context-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.context-title { font-size: 14px; font-weight: 500; color: #1a1a1a; }
.context-meta  { font-size: 12px; color: #a0a0a8; }
.form-heading  { margin-bottom: 20px; }
.form-title    { font-size: 16px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
.form-sub      { font-size: 13px; color: #a0a0a8; }
.field         { margin-bottom: 16px; }
.field label   { display: block; font-size: 12px; font-weight: 500; color: #6b6b72; margin-bottom: 6px; }
.inp-textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 0.5px solid #e2e0d8;
  background: #f8f7f5;
  color: #1a1a1a;
  font-size: 13px;
  font-family: var(--font-main);
  resize: none;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s;
}
.inp-textarea:focus { border-color: var(--ch-gold); }
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--ch-blue-soft);
  border: 0.5px solid #2563eb2a;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 20px;
  font-size: 12px;
  color: var(--ch-blue);
  line-height: 1.5;
}
.error-msg { font-size: 12px; color: #e24b4a; margin-bottom: 10px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.btn-primary {
  display: block;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background: var(--ch-gold);
  cursor: pointer;
  font-family: var(--font-main);
  margin-bottom: 10px;
  transition: opacity 0.2s;
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary {
  display: block;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 0.5px solid #e2e0d8;
  background: transparent;
  color: #1a1a1a;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-main);
  text-align: center;
}
.success-state { text-align: center; padding: 32px 0 24px; }
.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #34d39918;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #34d399;
}
.success-title { font-size: 18px; font-weight: 500; color: #1a1a1a; margin-bottom: 8px; }
.success-sub   { font-size: 13px; color: #a0a0a8; line-height: 1.5; }
.event-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f7f5;
  border: 0.5px solid #e2e0d8;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 24px;
}
.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.summary-info { flex: 1; }
.summary-title { font-size: 13px; font-weight: 500; color: #1a1a1a; }
.summary-meta  { font-size: 12px; color: #a0a0a8; }
.pending-badge {
  font-size: 11px;
  font-weight: 500;
  color: #f59e0b;
  background: #f59e0b18;
  border-radius: var(--r-pill);
  padding: 3px 10px;
  flex-shrink: 0;
}
.sheet-enter-active, .sheet-leave-active {
  transition: transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s ease;
}
.sheet-enter-from, .sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
