import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { DemoNavItem, DemoNotification } from '../../../components/demo/types'

/** Display name shown in the sidebar brand block and page/document titles. */
export const appName = 'Human Resource Management System'

/** Root route for this demo application. */
export const basePath = '/solutions/human-resource-management'

/** Sidebar navigation for the Human Resource Management System demo. */
export const demoNavItems: DemoNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '' },
  { key: 'employees', label: 'Employees', icon: Users, to: '/employees' },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck, to: '/attendance' },
  { key: 'leave', label: 'Leave Requests', icon: ClipboardList, to: '/leave' },
  { key: 'recruitment', label: 'Recruitment', icon: Briefcase, to: '/recruitment' },
  { key: 'documents', label: 'Documents', icon: FileText, to: '/documents' },
  { key: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

/** Fictional topbar notifications for the Human Resource Management System demo. */
export const demoNotifications: DemoNotification[] = [
  { id: 'note-1', title: 'Leave request pending', detail: 'Rafael Buenaventura is awaiting approval for LV-4003.' },
  { id: 'note-2', title: 'Document expiring', detail: 'Rafael Buenaventura’s Medical Clearance expires soon.' },
  { id: 'note-3', title: 'Interview scheduled', detail: 'Trisha Belmonte is scheduled for Sep 18, 10:00 AM.' },
]
