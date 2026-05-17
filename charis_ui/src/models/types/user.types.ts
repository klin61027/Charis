export type UserRole = 'user' | 'org'

export type AuthProvider = 'google' | 'apple'

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string | null
  bio: string
}

export interface Organization {
  id: string
  name: string
  logo: string | null
  description: string
  followersCount: number
  eventsCount: number
}

export interface AuthSession {
  role: UserRole
  token: string
  provider: AuthProvider
  user?: User
  org?: Organization
}