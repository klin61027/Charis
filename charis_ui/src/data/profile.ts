import type { UserProfile, FollowedOrg } from '../models/types/profile.types'

export const mockUserProfile: UserProfile = {
  id: 'u1',
  name: 'Kevin Lin',
  username: 'kevinlin',
  email: 'kevin@email.com',
  avatar: null,
  eventsJoined: 7,
  hoursVolunteered: 18,
  couponsUsed: 3,
}

export const mockFollowedOrgs: FollowedOrg[] = [
  {
    id: 'org-1',
    name: 'Northwest Harvest',
    category: 'food',
    eventsCount: 12,
  },
  {
    id: 'org-2',
    name: 'Seattle Parks Foundation',
    category: 'environment',
    eventsCount: 8,
  },
  {
    id: 'org-3',
    name: 'Beacon Food Forest',
    category: 'food',
    eventsCount: 5,
  },
]
