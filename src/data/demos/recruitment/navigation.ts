import {
  LayoutDashboard,
  Briefcase,
  UsersRound,
  KanbanSquare,
  CalendarClock,
  ClipboardCheck,
  Star,
  Handshake,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { DemoNavGroup, DemoNavItem, DemoNotification } from '../../../components/demo/types'

/** Display name shown in the sidebar brand block and page/document titles. */
export const appName = 'Recruitment Management System'

/** Root route for this demo application. */
export const basePath = '/solutions/recruitment-management'

/** Flat navigation list, used for route lookups and the mobile drawer. */
export const demoNavItems: DemoNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '' },
  { key: 'vacancies', label: 'Job Vacancies', icon: Briefcase, to: '/vacancies' },
  { key: 'applicants', label: 'Applicants', icon: UsersRound, to: '/applicants' },
  { key: 'pipeline', label: 'Candidate Pipeline', icon: KanbanSquare, to: '/pipeline' },
  { key: 'interviews', label: 'Interviews', icon: CalendarClock, to: '/interviews' },
  { key: 'assessments', label: 'Assessments', icon: ClipboardCheck, to: '/assessments' },
  { key: 'evaluations', label: 'Evaluations', icon: Star, to: '/evaluations' },
  { key: 'hiring', label: 'Hiring Decisions', icon: Handshake, to: '/hiring' },
  { key: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

/** Grouped presentation of the same items, so the sidebar reads as one coherent workflow. */
export const demoNavGroups: DemoNavGroup[] = [
  { label: 'Overview', keys: ['dashboard'] },
  {
    label: 'Hiring',
    keys: ['vacancies', 'applicants', 'pipeline', 'interviews', 'assessments', 'evaluations', 'hiring'],
  },
  { label: 'Analytics', keys: ['reports'] },
  { label: 'System', keys: ['settings'] },
]

/** Fictional topbar notifications for the Recruitment Management System demo. */
export const demoNotifications: DemoNotification[] = [
  { id: 'note-1', title: 'Interview scheduled', detail: 'Adonis Villaruz is scheduled for Sep 18, 10:00 AM.' },
  { id: 'note-2', title: 'Assessment pending', detail: 'Wilhelmina Sabado’s practical assessment is awaiting scheduling.' },
  { id: 'note-3', title: 'Candidate shortlisted', detail: 'Perpetua Nazarro was shortlisted for Sales Development Representative.' },
]
