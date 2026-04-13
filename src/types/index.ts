export type CategoryId = 'student' | 'staff' | 'parent' | 'event' | 'ict'

export interface Category {
  id: CategoryId
  label: string
  icon: string
  color: string
  borderColor: string
  badgeBg: string
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'number'
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface Document {
  id: string
  title: string
  description: string
  category: CategoryId
  fields: FormField[]
}

export type FacilityId =
  | 'gymnasium'
  | 'ground'
  | 'meeting1'
  | 'meeting2'
  | 'av_room'
  | 'computer'

export interface Facility {
  id: FacilityId
  label: string
  color: string
  bgColor: string
  borderColor: string
  dotColor: string
}

export interface Reservation {
  id: string
  facilityId: FacilityId
  title: string
  date: string
  startTime: string
  endTime: string
  organizer: string
  notes?: string
  createdAt: string
}
