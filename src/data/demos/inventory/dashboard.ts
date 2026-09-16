import { Boxes, ClipboardList, FilePlus, PackagePlus, TriangleAlert, Wallet, PackageX, PackageSearch } from 'lucide-react'
import type { IconComponent } from '../../../types/content'

export interface SummaryMetric {
  label: string
  value: number
  delta?: { value: string; direction: 'up' | 'down' }
  icon: IconComponent
  /** Pre-formats the value for currency vs. plain-count cards. */
  format?: 'currency' | 'count'
}

/** Illustrative dashboard figures — a larger, separate set from the small interactive sample dataset, matching the established pattern across the other standalone demos. */
export const summaryMetrics: SummaryMetric[] = [
  { label: 'Total Products', value: 1920, delta: { value: '+3.2%', direction: 'up' }, icon: Boxes, format: 'count' },
  { label: 'Stock Value', value: 4820000, delta: { value: '+1.8%', direction: 'up' }, icon: Wallet, format: 'currency' },
  { label: 'Low Stock', value: 24, delta: { value: '+4', direction: 'up' }, icon: TriangleAlert, format: 'count' },
  { label: 'Out of Stock', value: 7, delta: { value: '-2', direction: 'down' }, icon: PackageX, format: 'count' },
  { label: 'Purchase Orders', value: 18, delta: { value: '+5', direction: 'up' }, icon: ClipboardList, format: 'count' },
]

/** Movements per day, last 7 days. */
export const movementTrend: { label: string; value: number }[] = [
  { label: 'Mon', value: 18 },
  { label: 'Tue', value: 24 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 32 },
  { label: 'Fri', value: 28 },
  { label: 'Sat', value: 10 },
  { label: 'Sun', value: 6 },
]

/** Stock units by warehouse, illustrative distribution. */
export const stockByWarehouse: { label: string; value: number }[] = [
  { label: 'Main DC', value: 3120 },
  { label: 'North WH', value: 1480 },
  { label: 'South WH', value: 980 },
  { label: 'Overflow', value: 640 },
]

export interface QuickAction {
  label: string
  description: string
  to: string
  icon: IconComponent
}

export const quickActions: QuickAction[] = [
  { label: 'Add product', description: 'Register a new item in the catalogue', to: '/products', icon: PackagePlus },
  { label: 'Receive stock', description: 'Record a delivery against a purchase order', to: '/purchase-orders', icon: FilePlus },
  { label: 'Create purchase order', description: 'Order replenishment stock from a supplier', to: '/purchase-orders', icon: ClipboardList },
  { label: 'View low stock', description: 'See everything nearing its reorder level', to: '/stock', icon: PackageSearch },
]
