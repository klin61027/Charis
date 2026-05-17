<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="accent-bar"></div>

      <div class="card-body">

        <!-- Logo -->
        <CharisLogo :role="role" />

        <!-- Role toggle -->
        <RoleToggle :active="role" @change="setRole" />

        <!-- Org banner -->
        <Transition name="banner">
          <div v-if="isOrgRole" class="org-banner">
            <IconInfoCircle :size="15" aria-hidden="true" />
            <span>Sign in to manage your events, track volunteers, and issue coupons.</span>
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="submitEmail" novalidate>

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
            <label for="password">Password</label>
            <div class="inp-icon">
              <IconLock :size="16" aria-hidden="true" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
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

          <div class="forgot-row">
            <router-link to="/forgot" class="forgot-link" :style="accentStyle">
              Forgot password?
            </router-link>
          </div>

          <Transition name="fade">
            <p v-if="error" class="error-msg">{{ error }}</p>
          </Transition>

          <button
            type="submit"
            class="btn-primary"
            :style="btnStyle"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Signing in…' : isOrgRole ? 'Sign in as Organization' : 'Sign in as Volunteer' }}
          </button>

          <router-link
            :to="isOrgRole ? '/signup/org' : '/signup'"
            class="btn-secondary"
          >
            {{ isOrgRole ? 'Register your organization' : 'Create volunteer account' }}
          </router-link>

        </form>

        <!-- Divider -->
        <div class="divider">
          <span class="div-line"></span>
          <span class="div-txt">or continue with</span>
          <span class="div-line"></span>
        </div>

        <!-- Social -->
        <div class="social-row">
          <button
            type="button"
            class="btn-google"
            :disabled="isLoading"
            @click="loginWithProvider('google')"
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
            @click="loginWithProvider('apple')"
          >
            <IconBrandApple :size="16" aria-hidden="true" />
            Apple
          </button>
        </div>

        <!-- Footer -->
        <p class="footer-text">
          <template v-if="isOrgRole">
            Want to volunteer?
            <a href="#" @click.prevent="setRole('user')" class="footer-link org">
              Switch to volunteer
            </a>
          </template>
          <template v-else>
            New volunteer?
            <router-link to="/signup" class="footer-link vol">
              Create an account
            </router-link>
          </template>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconInfoCircle, IconLock, IconEye, IconBrandApple } from '@tabler/icons-vue'
import RoleToggle from '../../components/common/RoleToggle.vue'
import CharisLogo from '../../components/common/CharisLogo.vue'
import { useAuth } from '../../viewmodels/useAuth'

const {
  role, email, password, showPassword,
  isLoading, error, isOrgRole,
  setRole, submitEmail, loginWithProvider,
} = useAuth()

const accentStyle = computed(() => ({
  color: isOrgRole.value ? '#2563eb' : '#b8860b',
}))

const btnStyle = computed(() => ({
  background: isOrgRole.value ? '#2563eb' : '#c9920e',
}))
</script>

<style scoped>
.card-body { padding: 0 28px 36px; }

.org-banner {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 10px 14px; border-radius: 10px; margin-bottom: 20px;
  font-size: 12px; color: #2563eb;
  background: #2563eb12; border: 0.5px solid #2563eb2a;
}
.banner-enter-active, .banner-leave-active {
  transition: max-height 0.4s ease, opacity 0.4s ease, margin-bottom 0.4s ease;
  overflow: hidden;
}
.banner-enter-from, .banner-leave-to  { max-height: 0; opacity: 0; margin-bottom: 0; }
.banner-enter-to,   .banner-leave-from { max-height: 80px; opacity: 1; margin-bottom: 20px; }

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
.inp:focus { border-color: #c9920e; }
.inp-icon {
  display: flex; align-items: center;
  background: #f8f7f5; border: 0.5px solid #e2e0d8;
  border-radius: 10px; padding: 0 14px; gap: 8px;
}
.inp-icon input {
  flex: 1; border: none; background: transparent;
  padding: 12px 0; font-size: 14px; color: #1a1a1a;
  font-family: var(--font-main); outline: none;
}
.eye-btn {
  background: none; border: none; cursor: pointer;
  color: #a0a0a8; display: flex; padding: 0;
}

.forgot-row { text-align: right; margin-bottom: 16px; }
.forgot-link { font-size: 12px; font-weight: 500; text-decoration: none; transition: color 0.4s ease; }

.error-msg { font-size: 12px; color: #e24b4a; margin-bottom: 10px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.btn-primary {
  display: block; width: 100%; padding: 14px;
  border-radius: 12px; border: none; color: #fff;
  font-size: 15px; font-weight: 500; font-family: var(--font-main);
  cursor: pointer; margin-bottom: 10px;
  transition: background 0.45s ease, opacity 0.2s;
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  display: block; width: 100%; padding: 14px;
  border-radius: 12px; border: 0.5px solid #e2e0d8;
  background: transparent; color: #1a1a1a;
  font-size: 15px; font-weight: 500; font-family: var(--font-main);
  text-align: center; text-decoration: none; cursor: pointer;
}
.btn-secondary:hover { background: #f8f7f5; }

.divider {
  display: flex; align-items: center;
  gap: 12px; margin: 20px 0;
}
.div-line { flex: 1; height: 0.5px; background: #e2e0d8; }
.div-txt { font-size: 12px; color: #a0a0a8; white-space: nowrap; }

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

.footer-text { text-align: center; margin-top: 22px; font-size: 13px; color: #a0a0a8; }
.footer-link { font-weight: 500; text-decoration: none; }
.footer-link.vol { color: #b8860b; }
.footer-link.org { color: #2563eb; }
</style>