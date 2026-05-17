export type OrgCategory = 'food' | 'environment' | 'community'

export interface Organization {
  id: string
  name: string
  category: OrgCategory
}