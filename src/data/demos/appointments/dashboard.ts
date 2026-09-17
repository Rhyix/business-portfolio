import { CalendarCheck, CalendarClock, CalendarDays, CalendarPlus, Clock, UserPlus, TagPlus } from 'lucide-react'
import type { IconComponent } from '../../../types/content'

export interface SummaryMetric {
  label: string
  value: number
  delta?: { value: string; direction: 'up' | 'down' }
  icon: IconComponent
}

/** Illustrative dashboard figures — a larger, separate set from the small interactive sample dataset, matching the established pattern across the other standalone demos. */
export const summaryMetrics: SummaryMetric[] = [
  { label: "Today's Appointments", value: 24, delta: { value: '+3', direction: 'up' }, icon: CalendarDays },
  { label: 'Confirmed', value: 18, delta: { value: '+5', direction: 'up' }, icon: CalendarCheck },
  { label: 'Pending', value: 4, delta: { value: '-1', direction: 'down' }, icon: Clock },
  { label: 'Available Slots', value: 31, delta: { value: '+6', direction: 'up' }, icon: CalendarClock },
]

/** Appointments booked per day, last 7 days. */
export const weeklyTrend: { label: string; value: number }[] = [
  { label: 'Mon', value: 14 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 11 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 26 },
  { label: 'Sat', value: 9 },
  { label: 'Sun', value: 4 },
]

/** Illustrative appointment counts by staff, current month. */
export const busiestStaff: { label: string; value: number }[] = [
  { label: 'Maria S.', value: 42 },
  { label: 'Jonathan C.', value: 35 },
  { label: 'Angela R.', value: 28 },
  { label: 'Karen B.', value: 19 },
]

/** Illustrative booking counts by service, current month. */
export const mostBookedServices: { label: string; value: number }[] = [
  { label: 'Consultation', value: 48 },
  { label: 'Follow-up', value: 31 },
  { label: 'Maintenance', value: 24 },
  { label: 'Installation', value: 12 },
]

export interface QuickAction {
  label: string
  description: string
  to: string
  icon: IconComponent
}

export const quickActions: QuickAction[] = [
  { label: 'Book appointment', description: 'Start the guided booking workflow', to: '/appointments', icon: CalendarPlus },
  { label: 'View calendar', description: 'See the full day, week and month schedule', to: '/calendar', icon: CalendarDays },
  { label: 'Add customer', description: 'Register a new customer record', to: '/customers', icon: UserPlus },
  { label: 'Add service', description: 'Offer a new bookable service', to: '/services', icon: TagPlus },
]
