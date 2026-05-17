export type ApplicationStatus = 'check' | 'approved' | 'rejected'

export interface Application {
  id: string
  usersId: string
  eventId: string
  status: ApplicationStatus
  question1: string[]
  question2: string[]
  question3: string[]
  createdAt: string
  updatedAt: string
}

export interface ApplicationForm {
  eventId: string
  eventTitle: string
  eventCategory: 'volunteer' | 'community' | 'workshop' | 'fundraiser'
  organizationName: string
  eventDate: string
  eventLocation: string
  question1: string
  question2: string
  question3: string
}
