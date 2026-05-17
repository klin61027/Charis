export type CouponStatus = 'active' | 'expiring_soon' | 'expired' | 'redeemed'

export type BusinessCategory = 'cafe' | 'restaurant' | 'bakery' | 'retail'

export interface Business {
  id: string
  name: string
  category: BusinessCategory
  neighborhood: string
}

export interface Coupon {
  id: string
  businessId: string
  businessName: string
  businessCategory: BusinessCategory
  neighborhood: string
  value: string
  status: CouponStatus
  daysLeft: number
  earnedFromEventId: string
  barcode?: string
}

export interface EventReward {
  couponId: string
  businessName: string
  businessCategory: BusinessCategory
  value: string
}
