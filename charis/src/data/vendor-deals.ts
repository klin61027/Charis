import type { VendorDeal } from '../models/types/org-event.types'

export const mockVendorDeals: VendorDeal[] = [
  {
    id: 'deal-1',
    businessId: 'biz-2',
    businessName: 'Piroshky Piroshky',
    businessCategory: 'restaurant',
    dealDescription: '$5 off any order',
    totalCount: 20,
    redeemedCount: 3,
    expiryDate: 'Jun 1',
  },
  {
    id: 'deal-2',
    businessId: 'biz-1',
    businessName: 'Lighthouse Coffee',
    businessCategory: 'cafe',
    dealDescription: 'Free drip coffee',
    totalCount: 25,
    redeemedCount: 9,
    expiryDate: 'Jun 15',
  },
  {
    id: 'deal-3',
    businessId: 'biz-3',
    businessName: 'Macrina Bakery',
    businessCategory: 'bakery',
    dealDescription: 'Pastry coupon',
    totalCount: 30,
    redeemedCount: 4,
    expiryDate: 'Jul 1',
  },
]