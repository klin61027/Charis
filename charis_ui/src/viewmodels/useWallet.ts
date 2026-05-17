import { ref, computed } from 'vue'
import { mockCoupons } from '../data/coupons'
import { getTicketsByUser } from '../repositories/ticket.api.repository'
import type { Ticket } from '../models/types/ticket.types'

export type WalletTab = 'coupons' | 'tickets'

export function useWallet() {
  const activeTab = ref<WalletTab>('coupons')
  const tickets   = ref<Ticket[]>([])

  const activeCoupons   = computed(() => mockCoupons.filter(c => c.status === 'active'))
  const expiringCoupons = computed(() => mockCoupons.filter(c => c.status === 'expiring_soon'))
  const usedCoupons     = computed(() => mockCoupons.filter(c => c.status === 'redeemed'))

  const visibleCoupons = computed(() =>
    mockCoupons.filter(c => c.status === 'active' || c.status === 'expiring_soon')
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
    const coupon = mockCoupons.find(c => c.id === id)
    if (coupon) coupon.status = 'redeemed'
  }

  async function loadTickets(userId: string) {
    tickets.value = await getTicketsByUser(userId)
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
