import { ref, computed } from 'vue'
import { mockCoupons } from '../data/coupons'
import { mockTickets } from '../data/tickets'

export type WalletTab = 'coupons' | 'tickets'

export function useWallet() {
  const activeTab = ref<WalletTab>('coupons')

  const activeCoupons   = computed(() => mockCoupons.filter(c => c.status === 'active'))
  const expiringCoupons = computed(() => mockCoupons.filter(c => c.status === 'expiring_soon'))
  const usedCoupons     = computed(() => mockCoupons.filter(c => c.status === 'redeemed'))

  const visibleCoupons = computed(() =>
    mockCoupons.filter(c => c.status === 'active' || c.status === 'expiring_soon')
  )

  const upcomingTickets = computed(() => mockTickets.filter(t => t.status === 'upcoming'))
  const attendedTickets = computed(() => mockTickets.filter(t => t.status === 'attended'))

  const visibleTickets = computed(() => mockTickets)

  const summaryStats = computed(() => ({
    active:   activeCoupons.value.length + upcomingTickets.value.length,
    expiring: expiringCoupons.value.length,
    used:     usedCoupons.value.length + attendedTickets.value.length,
  }))

  function setTab(tab: WalletTab) {
    activeTab.value = tab
  }

  function useCoupon(id: string) {
    const coupon = mockCoupons.find(c => c.id === id)
    if (coupon) coupon.status = 'redeemed'
  }

  return {
    activeTab,
    visibleCoupons,
    visibleTickets,
    summaryStats,
    setTab,
    useCoupon,
  }
}
