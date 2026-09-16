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
import type { IconComponent } from '../../../types/content'

export interface DemoNavItem {
  key: string
  label: string
  icon: IconComponent
  /** Path suffix appended to the demo base route; '' is the dashboard root. */
  to: string
}

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
