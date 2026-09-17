import {
  LayoutDashboard,
  LayoutGrid,
  Target,
  Building2,
  BarChart3,
  ClipboardCheck,
  Activity as ActivityIcon,
  Database,
  Settings,
} from 'lucide-react'
import type { DemoNavGroup, DemoNavItem, DemoNotification } from '../../../components/demo/types'

/** Display name shown in the sidebar brand block and page/document titles. */
export const appName = 'Administrative Dashboard'

/** Root route for this demo application. */
export const basePath = '/solutions/administrative-dashboard'

/** Flat navigation list, used for route lookups and the mobile drawer. */
export const demoNavItems: DemoNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '' },
  { key: 'overview', label: 'Overview', icon: LayoutGrid, to: '/overview' },
  { key: 'kpis', label: 'KPIs', icon: Target, to: '/kpis' },
  { key: 'departments', label: 'Departments', icon: Building2, to: '/departments' },
  { key: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
  { key: 'approvals', label: 'Approvals', icon: ClipboardCheck, to: '/approvals' },
  { key: 'activity', label: 'Activity', icon: ActivityIcon, to: '/activity' },
  { key: 'data', label: 'Data Explorer', icon: Database, to: '/data' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

/** Grouped presentation of the same items, so the sidebar reads as one coherent workflow. */
export const demoNavGroups: DemoNavGroup[] = [
  { label: 'Overview', keys: ['dashboard'] },
  { label: 'Analytics', keys: ['overview', 'kpis', 'departments', 'reports'] },
  { label: 'Workflow', keys: ['approvals', 'activity'] },
  { label: 'Data', keys: ['data'] },
  { label: 'System', keys: ['settings'] },
]

/** Fictional topbar notifications for the Administrative Dashboard demo. */
export const demoNotifications: DemoNotification[] = [
  { id: 'note-1', title: 'Approval pending', detail: 'A purchase request from IT is awaiting your decision.' },
  { id: 'note-2', title: 'KPI needs attention', detail: 'Open Support Tickets has moved below target.' },
  { id: 'note-3', title: 'Record flagged for review', detail: 'Annual Compliance Filing needs review.' },
]
