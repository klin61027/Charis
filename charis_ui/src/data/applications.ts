import type { Application } from '../models/types/application.types'

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    usersId: 'u1',
    eventId: 'evt-1',
    status: 'check',
    question1: ['I want to help my community and reduce food waste.'],
    question2: ['I have volunteered at food banks twice before.'],
    question3: ['I am available the full shift.'],
    createdAt: '2026-05-17T09:00:00Z',
    updatedAt: '2026-05-17T09:00:00Z',
  },
]
