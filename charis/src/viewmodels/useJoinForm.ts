import { ref, computed } from 'vue'
import type { ApplicationForm } from '../models/types/application.types'
import type { Event } from '../models/types/event.types'
import { mockApplications } from '../data/applications'

export function useJoinForm() {
  const isOpen            = ref(false)
  const isSubmitted       = ref(false)
  const isLoading         = ref(false)
  const error             = ref<string | null>(null)
  const activeEvent       = ref<Event | null>(null)
  const justJoinedEventId = ref<string | null>(null)

  const question1 = ref('')
  const question2 = ref('')
  const question3 = ref('')

  const form = computed<ApplicationForm | null>(() => {
    if (!activeEvent.value) return null
    return {
      eventId:          activeEvent.value.id,
      eventTitle:       activeEvent.value.title,
      eventCategory:    activeEvent.value.category,
      organizationName: activeEvent.value.organizationName,
      eventDate:        `${activeEvent.value.date} · ${activeEvent.value.time}`,
      eventLocation:    activeEvent.value.location,
      question1:        question1.value,
      question2:        question2.value,
      question3:        question3.value,
    }
  })

  function openForm(event: Event) {
    activeEvent.value       = event
    question1.value         = ''
    question2.value         = ''
    question3.value         = ''
    isSubmitted.value       = false
    justJoinedEventId.value = null
    error.value             = null
    isOpen.value            = true
  }

  function closeForm() {
    isOpen.value            = false
    isSubmitted.value       = false
    activeEvent.value       = null
    justJoinedEventId.value = null
  }

  async function submitForm(onJoined: (id: string) => void) {
    if (!question1.value || !question2.value || !question3.value) {
      error.value = 'Please answer all questions.'
      return
    }

    isLoading.value = true
    error.value     = null

    try {
      await new Promise(r => setTimeout(r, 700))

      mockApplications.push({
        id:        `app-${Date.now()}`,
        usersId:   'u1',
        eventId:   activeEvent.value!.id,
        status:    'check',
        question1: [question1.value],
        question2: [question2.value],
        question3: [question3.value],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      justJoinedEventId.value = activeEvent.value!.id
      onJoined(activeEvent.value!.id)
      isSubmitted.value = true
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isOpen,
    isSubmitted,
    isLoading,
    error,
    activeEvent,
    question1,
    question2,
    question3,
    form,
    openForm,
    closeForm,
    submitForm,
  }
}
