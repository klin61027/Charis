<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="accent-bar"></div>

      <div class="card-body">

        <!-- Logo -->
        <div class="logo-area">
          <div class="logo-wrap" ref="logoWrap">
            <span class="logo-char">Char</span><span class="logo-i">i</span><span class="logo-char">s</span>
            <span class="i-dot" ref="iDot"></span>
            <span class="probe" ref="probeBefore">Char</span>
            <span class="probe" ref="probeI">i</span>
          </div>
          <p class="tagline">Express gratitude. Build community.</p>
        </div>

        <!-- Page header -->
        <div class="page-header">
          <div class="role-badge">
            <IconHeartHandshake :size="13" aria-hidden="true" />
            Volunteer
          </div>
          <h1 class="page-title">Create account</h1>
          <p class="page-sub">Join the Charis community</p>
        </div>

        <!-- Back -->
        <div class="back-row">
          <router-link to="/login" class="back-link">
            <IconArrowLeft :size="15" aria-hidden="true" />
            Back to login
          </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitSignUp" novalidate>

          <div class="field">
            <label for="fullName">Full name</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              placeholder="Your name"
              autocomplete="name"
              class="inp"
            />
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@email.com"
              autocomplete="email"
              class="inp"
            />
          </div>

          <div class="field">
            <label for="username">Username</label>
            <div class="inp-icon">
              <IconAt :size="16" aria-hidden="true" />
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="username"
                autocomplete="username"
              />
            </div>
            <span class="hint">Letters, numbers and underscores only</span>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <div class="inp-icon">
              <IconLock :size="16" aria-hidden="true" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min 8 characters"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="eye-btn"
                @click="showPassword = !showPassword"
                aria-label="Toggle password visibility"
              >
                <IconEye :size="16" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="field">
            <label for="confirmPassword">Confirm password</label>
            <div class="inp-icon">
              <IconLock :size="16" aria-hidden="true" />
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Re-enter password"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="eye-btn"
                @click="showConfirm = !showConfirm"
                aria-label="Toggle confirm password visibility"
              >
                <IconEye :size="16" aria-hidden="true" />
              </button>
            </div>
          </div>

          <Transition name="fade">
            <p v-if="error" class="error-msg">{{ error }}</p>
          </Transition>

          <button
            type="submit"
            class="btn-primary"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Creating account…' : 'Create volunteer account' }}
          </button>

        </form>

        <!-- Divider -->
        <div class="divider">
          <span class="div-line"></span>
          <span class="div-txt">or sign up with</span>
          <span class="div-line"></span>
        </div>

        <!-- Social -->
        <div class="social-row">
          <button
            type="button"
            class="btn-google"
            :disabled="isLoading"
            @click="signUpWithProvider('google')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            class="btn-apple"
            :disabled="isLoading"
            @click="signUpWithProvider('apple')"
          >
            <IconBrandApple :size="16" aria-hidden="true" />
            Apple
          </button>
        </div>

        <p class="footer-text">
          Already have an account?
          <router-link to="/login" class="footer-link">Sign in</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  IconHeartHandshake,
  IconArrowLeft,
  IconAt,
  IconLock,
  IconEye,
  IconBrandApple,
} from '@tabler/icons-vue'
import { useSignUp } from '../../viewmodels/useSignUp'

const {
  fullName, email, username,
  password, confirmPassword,
  showPassword, showConfirm,
  isLoading, error,
  submitSignUp, signUpWithProvider,
} = useSignUp()

// Logo dot positioning — identical to LoginView
const logoWrap    = ref<HTMLElement | null>(null)
const probeBefore = ref<HTMLElement | null>(null)
const probeI      = ref<HTMLElement | null>(null)
const iDot        = ref<HTMLElement | null>(null)

function positionDot() {
  if (!logoWrap.value || !probeBefore.value || !probeI.value || !iDot.value) return
  const wrapRect   = logoWrap.value.getBoundingClientRect()
  const beforeRect = probeBefore.value.getBoundingClientRect()
  const iRect      = probeI.value.getBoundingClientRect()
  const iCenterX   = (beforeRect.left - wrapRect.left) + beforeRect.width + iRect.width / 2
  const dotSize    = 5
  const dotY       = wrapRect.height * 0.10
  iDot.value.style.width  = dotSize + 'px'
  iDot.value.style.height = dotSize + 'px'
  iDot.value.style.left   = (iCenterX - dotSize / 2) + 'px'
  iDot.value.style.top    = dotY + 'px'
}

onMounted(() => setTimeout(positionDot, 80))
onUnmounted(() => window.removeEventListener('resize', positionDot))
window.addEventListener('resize', positionDot)
</script>

<style scoped>
.card-body { padding: 0 28px 36px; }

/* Logo */
.logo-area { text-align: center; padding: 36px 0 28px; }
.logo-wrap { position: relative; display: inline-block; line-height: 1.2; margin-bottom: 6px; }
.logo-char {
  font-size: 36px; font-weight: 500; letter-spacing: -.5px;
  color: #c9920e; font-family: var(--font-main);
}
.logo-i {
  font-size: 36px; font-weight: 500; letter-spacing: -.5px;
  color: #c9920e; font-family: var(--font-main);
  display: inline-block; position: relative;
}
.logo-i::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 35%;
  background: #fff;
  pointer-events: none;
}
.i-dot {
  position: absolute; border-radius: 50%;
  background: #3b82f6; pointer-events: none;
}
.probe {
  position: absolute; visibility: hidden;
  white-space: nowrap; pointer-events: none;
  font-size: 36px; font-weight: 500; letter-spacing: -.5px;
  font-family: var(--font-main); top: 0; left: 0;
}
.tagline { font-size: 13px; color: #a0a0a8; }

/* Page header */
.page-header { margin-bottom: 20px; }
.role-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: #c9920e18; color: #b8860b;
  font-size: 11px; font-weight: 500;
  padding: 3px 10px; border-radius: var(--r-pill);
  margin-bottom: 10px;
}
.page-title { font-size: 20px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
.page-sub   { font-size: 13px; color: #a0a0a8; }

/* Back link */
.back-row { margin-bottom: 20px; }
.back-link {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 13px; color: #6b6b72; text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: #1a1a1a; }

/* Fields — identical to LoginView */
.field { margin-bottom: 16px; }
.field label {
  display: block; font-size: 12px; color: #6b6b72;
  margin-bottom: 6px; font-weight: 500;
}
.inp {
  width: 100%; padding: 12px 14px; border-radius: 10px;
  border: 0.5px solid #e2e0d8; background: #f8f7f5;
  color: #1a1a1a; font-size: 14px; font-family: var(--font-main);
  outline: none; transition: border-color 0.2s;
}
.inp::placeholder { color: #a0a0a8; }
.inp:focus { border-color: #c9920e; }
.inp-icon {
  display: flex; align-items: center;
  background: #f8f7f5; border: 0.5px solid #e2e0d8;
  border-radius: 10px; padding: 0 14px; gap: 8px;
  transition: border-color 0.2s;
}
.inp-icon:focus-within { border-color: #c9920e; }
.inp-icon :deep(svg) { color: #a0a0a8; flex-shrink: 0; }
.inp-icon input {
  flex: 1; border: none; background: transparent;
  padding: 12px 0; font-size: 14px; color: #1a1a1a;
  font-family: var(--font-main); outline: none;
}
.inp-icon input::placeholder { color: #a0a0a8; }
.eye-btn {
  background: none; border: none; cursor: pointer;
  color: #a0a0a8; display: flex; padding: 0;
}
.hint { font-size: 11px; color: #a0a0a8; margin-top: 4px; }

/* Error */
.error-msg { font-size: 12px; color: #e24b4a; margin-bottom: 10px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Button */
.btn-primary {
  display: block; width: 100%; padding: 14px;
  border-radius: 12px; border: none;
  background: #c9920e; color: #fff;
  font-size: 15px; font-weight: 500; font-family: var(--font-main);
  cursor: pointer; margin-top: 4px;
  transition: opacity 0.2s;
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* Divider */
.divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.div-line { flex: 1; height: 0.5px; background: #e2e0d8; }
.div-txt  { font-size: 12px; color: #a0a0a8; white-space: nowrap; }

/* Social */
.social-row { display: flex; gap: 10px; }
.btn-google {
  flex: 1; padding: 11px; border-radius: 10px;
  border: 0.5px solid #dadce0; background: #fff; color: #3c4043;
  font-size: 12px; font-weight: 500; font-family: var(--font-main);
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-apple {
  flex: 1; padding: 11px; border-radius: 10px;
  border: 0.5px solid #1a1a1a; background: #1a1a1a; color: #fff;
  font-size: 12px; font-weight: 500; font-family: var(--font-main);
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-google:disabled, .btn-apple:disabled { opacity: 0.6; cursor: not-allowed; }

/* Footer */
.footer-text { text-align: center; margin-top: 22px; font-size: 13px; color: #a0a0a8; }
.footer-link { font-weight: 500; text-decoration: none; color: #b8860b; }
</style>
