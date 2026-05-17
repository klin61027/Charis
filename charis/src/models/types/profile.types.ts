export interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatar: string | null
  eventsJoined: number
  hoursVolunteered: number
  couponsUsed: number
}

export interface FollowedOrg {
  id: string
  name: string
  category: 'food' | 'environment' | 'community'
  eventsCount: number
}

export type NotificationSetting = {
  eventReminders: boolean
  newCoupons: boolean
  applicationUpdates: boolean
}
