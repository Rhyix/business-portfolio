import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Boxes,
  Receipt,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { DemoNavItem, DemoNotification } from '../../../components/demo/types'

/** Display name shown in the sidebar brand block and page/document titles. */
export const appName = 'Business Management System'

/** Root route for this demo application. */
export const basePath = '/solutions/business-management-system'

/** Sidebar navigation for the Business Management System demo. */
export const demoNavItems: DemoNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '' },
  { key: 'customers', label: 'Customers', icon: Users, to: '/customers' },
  { key: 'products', label: 'Products', icon: Package, to: '/products' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, to: '/orders' },
  { key: 'inventory', label: 'Inventory', icon: Boxes, to: '/inventory' },
  { key: 'invoices', label: 'Invoices', icon: Receipt, to: '/invoices' },
  { key: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

/** Fictional topbar notifications for the Business Management System demo. */
export const demoNotifications: DemoNotification[] = [
  { id: 'note-1', title: 'Low stock alert', detail: 'Mechanical Keyboard is below its reorder level.' },
  { id: 'note-2', title: 'New order received', detail: 'Order ORD-5011 was placed by Cielo Ramos.' },
  { id: 'note-3', title: 'Invoice overdue', detail: 'INV-3004 is 3 weeks past its due date.' },
]
