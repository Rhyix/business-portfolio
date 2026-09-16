import {
  LayoutDashboard,
  Package,
  Boxes,
  ArrowLeftRight,
  Warehouse,
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { DemoNavGroup, DemoNavItem, DemoNotification } from '../../../components/demo/types'

/** Display name shown in the sidebar brand block and page/document titles. */
export const appName = 'Inventory Management System'

/** Root route for this demo application. */
export const basePath = '/solutions/inventory-management'

/** Flat navigation list, used for route lookups and the mobile drawer. */
export const demoNavItems: DemoNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '' },
  { key: 'products', label: 'Products', icon: Package, to: '/products' },
  { key: 'stock', label: 'Stock', icon: Boxes, to: '/stock' },
  { key: 'movements', label: 'Stock Movements', icon: ArrowLeftRight, to: '/movements' },
  { key: 'warehouses', label: 'Warehouses', icon: Warehouse, to: '/warehouses' },
  { key: 'suppliers', label: 'Suppliers', icon: Truck, to: '/suppliers' },
  { key: 'purchase-orders', label: 'Purchase Orders', icon: ClipboardList, to: '/purchase-orders' },
  { key: 'reports', label: 'Reports', icon: BarChart3, to: '/reports' },
  { key: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

/** Grouped presentation of the same items, so the sidebar reads as one coherent workflow. */
export const demoNavGroups: DemoNavGroup[] = [
  { label: 'Overview', keys: ['dashboard'] },
  { label: 'Inventory', keys: ['products', 'stock', 'movements', 'warehouses'] },
  { label: 'Procurement', keys: ['suppliers', 'purchase-orders'] },
  { label: 'Analytics', keys: ['reports'] },
  { label: 'System', keys: ['settings'] },
]

/** Fictional topbar notifications for the Inventory Management System demo. */
export const demoNotifications: DemoNotification[] = [
  { id: 'note-1', title: 'Low stock alert', detail: 'Cold-Rolled Steel Sheet Roll is nearing its reorder level.' },
  { id: 'note-2', title: 'Purchase order received', detail: 'PO-401 was fully received at Main Distribution Center.' },
  { id: 'note-3', title: 'Stock adjustment logged', detail: 'Safety Helmet, ANSI-Rated was adjusted for damaged units.' },
]
