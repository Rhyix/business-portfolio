import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Boxes,
  Receipt,
  UsersRound,
  CalendarCheck,
  ClipboardList,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { DemoNavItem, DemoNavGroup, DemoNotification } from '../../../components/demo/types'

/** Display name shown in the sidebar brand block and page/document titles. */
export const appName = 'Business Management Platform'

/** Root route for the integrated demo application. */
export const basePath = '/solutions/integrated-business-management-platform'

/** Flat navigation list, used for route lookups and the mobile drawer. */
export const demoNavItems: DemoNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '' },
  { key: 'customers', label: 'Customers', icon: Users, to: '/customers' },
  { key: 'products', label: 'Products', icon: Package, to: '/products' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, to: '/orders' },
  { key: 'inventory', label: 'Inventory', icon: Boxes, to: '/inventory' },
  { key: 'invoices', label: 'Invoices', icon: Receipt, to: '/invoices' },
  { key: 'employees', label: 'Employees', icon: UsersRound, to: '/employees' },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck, to: '/attendance' },
  { key: 'leave', label: 'Leave Requests', icon: ClipboardList, to: '/leave' },
  { key: 'recruitment', label: 'Recruitment', icon: Briefcase, to: '/recruitment' },
  { key: 'documents', label: 'Documents', icon: FileText, to: '/documents' },
  { key: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

/** Grouped presentation of the same items, so the sidebar reads as one coherent platform. */
export const demoNavGroups: DemoNavGroup[] = [
  { label: 'Overview', keys: ['dashboard'] },
  { label: 'Operations', keys: ['customers', 'products', 'orders', 'inventory', 'invoices'] },
  { label: 'People & HR', keys: ['employees', 'attendance', 'leave', 'recruitment', 'documents'] },
  { label: 'Analytics', keys: ['reports'] },
  { label: 'System', keys: ['settings'] },
]

/** Fictional topbar notifications for the integrated platform demo. */
export const demoNotifications: DemoNotification[] = [
  { id: 'note-1', title: 'Leave request pending', detail: 'Rafael Buenaventura is awaiting approval for LV-4003.' },
  { id: 'note-2', title: 'Low stock alert', detail: 'Mechanical Keyboard is below its reorder level.' },
  { id: 'note-3', title: 'Invoice overdue', detail: 'INV-3004 is 3 weeks past its due date.' },
]
