import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  Tag,
  UserCog,
  CalendarClock,
  Bell,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { DemoNavGroup, DemoNavItem, DemoNotification } from '../../../components/demo/types'

/** Display name shown in the sidebar brand block and page/document titles. */
export const appName = 'Appointment & Scheduling System'

/** Root route for this demo application. */
export const basePath = '/solutions/appointment-scheduling'

/** Flat navigation list, used for route lookups and the mobile drawer. */
export const demoNavItems: DemoNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '' },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays, to: '/calendar' },
  { key: 'appointments', label: 'Appointments', icon: ClipboardList, to: '/appointments' },
  { key: 'customers', label: 'Customers', icon: Users, to: '/customers' },
  { key: 'services', label: 'Services', icon: Tag, to: '/services' },
  { key: 'staff', label: 'Staff', icon: UserCog, to: '/staff' },
  { key: 'availability', label: 'Availability', icon: CalendarClock, to: '/availability' },
  { key: 'reminders', label: 'Reminders', icon: Bell, to: '/reminders' },
  { key: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

/** Grouped presentation of the same items, so the sidebar reads as one coherent workflow. */
export const demoNavGroups: DemoNavGroup[] = [
  { label: 'Overview', keys: ['dashboard', 'calendar'] },
  { label: 'Bookings', keys: ['appointments', 'customers', 'services'] },
  { label: 'Team', keys: ['staff', 'availability'] },
  { label: 'Communication', keys: ['reminders'] },
  { label: 'Analytics', keys: ['reports'] },
  { label: 'System', keys: ['settings'] },
]

/** Fictional topbar notifications for the Appointment & Scheduling System demo. */
export const demoNotifications: DemoNotification[] = [
  { id: 'note-1', title: 'Upcoming appointment', detail: 'Liza Fernandez is booked with Maria Santos this morning.' },
  { id: 'note-2', title: 'Reschedule requested', detail: 'Camille Dizon’s appointment was moved to a later date.' },
  { id: 'note-3', title: 'Staff on leave', detail: 'Paolo Mercado is unavailable for the next few days.' },
]
