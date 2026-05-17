import { ref, computed } from 'vue'
import { getTicketsByUser, getCouponsByUser } from '../repositories/ticket.api.repository'
import type { Ticket } from '../models/types/ticket.types'
import type { Coupon } from '../models/types/coupon.types'

export type WalletTab = 'coupons' | 'tickets'

export function useWallet() {
  const activeTab = ref<WalletTab>('coupons')
  const tickets   = ref<Ticket[]>([])
  const coupons   = ref<Coupon[]>([])

  const activeCoupons   = computed(() => coupons.value.filter(c => c.status === 'active'))
  const expiringCoupons = computed(() => coupons.value.filter(c => c.status === 'expiring_soon'))
  const usedCoupons     = computed(() => coupons.value.filter(c => c.status === 'redeemed'))

  const visibleCoupons = computed(() =>
    coupons.value.filter(c => c.status === 'active' || c.status === 'expiring_soon')
  )

  const upcomingTickets = computed(() => tickets.value.filter(t => t.status === 'upcoming'))
  const attendedTickets = computed(() => tickets.value.filter(t => t.status === 'attended'))

  const visibleTickets = computed(() => tickets.value)

  const summaryStats = computed(() => ({
    active:   activeCoupons.value.length + upcomingTickets.value.length,
    expiring: expiringCoupons.value.length,
    used:     usedCoupons.value.length + attendedTickets.value.length,
  }))

  function setTab(tab: WalletTab) {
    activeTab.value = tab
  }

  function useCoupon(id: string) {
    const coupon = coupons.value.find(c => c.id === id)
    if (coupon) coupon.status = 'redeemed'
  }

  async function loadTickets(userId: string) {
    const [fetchedTickets, fetchedCoupons] = await Promise.all([
      getTicketsByUser(userId),
      getCouponsByUser(userId),
    ])
    tickets.value = fetchedTickets
    coupons.value = fetchedCoupons
  }

  return {
    activeTab,
    visibleCoupons,
    visibleTickets,
    summaryStats,
    setTab,
    useCoupon,
    loadTickets,
  }
}
