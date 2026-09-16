import { Users, UserCheck, CalendarOff, Briefcase, UserPlus, ClipboardCheck, CalendarClock, FileCheck } from 'lucide-react'
import type { IconComponent } from '../../../types/content'

export interface SummaryMetric {
  label: string
  value: number
  icon: IconComponent
  delta: { value: string; direction: 'up' | 'down' }
}

/** Headline figures for the HR dashboard. All figures are fictional demo data. */
export const summaryMetrics: SummaryMetric[] = [
  {
    label: 'Total Employees',
    value: 486,
    icon: Users,
    delta: { value: '+2.1% vs last month', direction: 'up' },
  },
  {
    label: 'Present Today',
    value: 452,
    icon: UserCheck,
    delta: { value: '93% attendance', direction: 'up' },
  },
  {
    label: 'On Leave',
    value: 18,
    icon: CalendarOff,
    delta: { value: '-3 vs yesterday', direction: 'down' },
  },
  {
    label: 'Open Positions',
    value: 12,
    icon: Briefcase,
    delta: { value: '+4 vs last month', direction: 'up' },
  },
]

/** Headcount by department for the dashboard and reports charts. */
export const departmentHeadcount: { label: string; value: number }[] = [
  { label: 'Engineering', value: 142 },
  { label: 'Sales', value: 98 },
  { label: 'Operations', value: 86 },
  { label: 'Support', value: 64 },
  { label: 'Finance', value: 48 },
  { label: 'Marketing', value: 33 },
  { label: 'HR', value: 15 },
]

/** Present-employee count for the past week. */
export const attendanceTrend: { label: string; value: number }[] = [
  { label: 'Mon', value: 438 },
  { label: 'Tue', value: 445 },
  { label: 'Wed', value: 430 },
  { label: 'Thu', value: 448 },
  { label: 'Fri', value: 441 },
  { label: 'Sat', value: 96 },
  { label: 'Sun', value: 452 },
]

/** Approved leave-day totals over the last 6 months, for the reports chart. */
export const leaveActivityTrend: { label: string; value: number }[] = [
  { label: 'Apr', value: 52 },
  { label: 'May', value: 61 },
  { label: 'Jun', value: 74 },
  { label: 'Jul', value: 88 },
  { label: 'Aug', value: 69 },
  { label: 'Sep', value: 58 },
]

export interface HrActivityItem {
  id: string
  message: string
  timestamp: string
}

/** Recent fictional HR activity feed shown on the dashboard. */
export const recentActivity: HrActivityItem[] = [
  { id: 'act-1', message: 'Leave request LV-4003 submitted by Rafael Buenaventura.', timestamp: '2026-09-16' },
  { id: 'act-2', message: 'Applicant Noel Fabros was shortlisted for Full Stack Developer.', timestamp: '2026-09-15' },
  { id: 'act-3', message: 'Employment Contract for Felicidad Navarro flagged as expired.', timestamp: '2026-09-15' },
  { id: 'act-4', message: 'Corazon Villanueva marked On Leave through Sep 19.', timestamp: '2026-09-12' },
  { id: 'act-5', message: 'New job opening posted: Payroll Coordinator.', timestamp: '2026-09-05' },
]

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  detail: string
}

/** Fictional upcoming HR events and reminders shown on the dashboard. */
export const upcomingEvents: UpcomingEvent[] = [
  { id: 'evt-1', title: 'Interview: Trisha Belmonte', date: '2026-09-18', detail: 'Full Stack Developer · Video call' },
  { id: 'evt-2', title: 'Interview: Herbert Nazareno', date: '2026-09-19', detail: 'HR Business Partner · In-person' },
  { id: 'evt-3', title: 'Document expiring: Rafael Buenaventura', date: '2026-09-30', detail: 'Medical Clearance renewal due' },
  { id: 'evt-4', title: 'Quarterly performance reviews begin', date: '2026-10-01', detail: 'All departments' },
]

export interface QuickAction {
  label: string
  description: string
  icon: IconComponent
  /** Path suffix appended to the demo base route, e.g. "/employees". */
  to: string
}

export const quickActions: QuickAction[] = [
  { label: 'Add employee', description: 'Create a new employee record', icon: UserPlus, to: '/employees' },
  { label: 'Review leave requests', description: 'Approve or reject pending requests', icon: ClipboardCheck, to: '/leave' },
  { label: 'View attendance', description: 'Check today’s attendance log', icon: CalendarClock, to: '/attendance' },
  { label: 'Review documents', description: 'Check expiring or missing documents', icon: FileCheck, to: '/documents' },
]
