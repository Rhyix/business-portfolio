import { Briefcase, UsersRound, CalendarClock, Trophy, FilePlus, UserPlus, CalendarPlus, KanbanSquare } from 'lucide-react'
import type { IconComponent } from '../../../types/content'

export interface SummaryMetric {
  label: string
  value: number
  icon: IconComponent
  delta: { value: string; direction: 'up' | 'down' }
}

/** Headline figures for the recruitment dashboard. All figures are fictional demo data. */
export const summaryMetrics: SummaryMetric[] = [
  {
    label: 'Open Positions',
    value: 12,
    icon: Briefcase,
    delta: { value: '+3 vs last month', direction: 'up' },
  },
  {
    label: 'Total Applicants',
    value: 184,
    icon: UsersRound,
    delta: { value: '+22 this month', direction: 'up' },
  },
  {
    label: 'Interviews This Week',
    value: 18,
    icon: CalendarClock,
    delta: { value: '+5 vs last week', direction: 'up' },
  },
  {
    label: 'Offers / Hires',
    value: 7,
    icon: Trophy,
    delta: { value: '+2 this month', direction: 'up' },
  },
]

/** Illustrative applicant funnel counts by stage, for the dashboard chart. */
export const applicantFunnel: { label: string; value: number }[] = [
  { label: 'Applied', value: 62 },
  { label: 'Screening', value: 41 },
  { label: 'Interview', value: 28 },
  { label: 'Assessment', value: 19 },
  { label: 'Shortlisted', value: 12 },
  { label: 'Hired', value: 7 },
]

/** Illustrative applicant counts for the top open positions. */
export const applicationsByPosition: { label: string; value: number }[] = [
  { label: 'Sr Frontend', value: 34 },
  { label: 'Backend', value: 29 },
  { label: 'Designer', value: 22 },
  { label: 'DevOps', value: 18 },
  { label: 'SDR', value: 15 },
]

/** Candidate activity (new applications) over the past week. */
export const candidateActivity: { label: string; value: number }[] = [
  { label: 'Mon', value: 6 },
  { label: 'Tue', value: 9 },
  { label: 'Wed', value: 5 },
  { label: 'Thu', value: 11 },
  { label: 'Fri', value: 8 },
  { label: 'Sat', value: 2 },
  { label: 'Sun', value: 1 },
]

export interface QuickAction {
  label: string
  description: string
  icon: IconComponent
  /** Path suffix appended to the demo base route, e.g. "/vacancies". */
  to: string
}

export const quickActions: QuickAction[] = [
  { label: 'Create vacancy', description: 'Post a new job opening', icon: FilePlus, to: '/vacancies' },
  { label: 'Add applicant', description: 'Record a new candidate', icon: UserPlus, to: '/applicants' },
  { label: 'Schedule interview', description: 'Book a candidate interview', icon: CalendarPlus, to: '/interviews' },
  { label: 'Review pipeline', description: 'See where candidates stand', icon: KanbanSquare, to: '/pipeline' },
]
