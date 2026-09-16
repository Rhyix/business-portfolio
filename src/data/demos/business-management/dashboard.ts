import {
  DollarSign,
  Package,
  ShoppingCart,
  UserPlus,
  Users,
  FileText,
  PackagePlus,
} from 'lucide-react'
import type { IconComponent } from '../../../types/content'

export interface SummaryMetric {
  label: string
  value: number
  format: 'currency' | 'number'
  icon: IconComponent
  delta: { value: string; direction: 'up' | 'down' }
}

/** Headline figures for the dashboard. All figures are fictional demo data. */
export const summaryMetrics: SummaryMetric[] = [
  {
    label: 'Revenue',
    value: 1284500,
    format: 'currency',
    icon: DollarSign,
    delta: { value: '+12.4% vs last month', direction: 'up' },
  },
  {
    label: 'Orders',
    value: 1248,
    format: 'number',
    icon: ShoppingCart,
    delta: { value: '+6.1% vs last month', direction: 'up' },
  },
  {
    label: 'Customers',
    value: 486,
    format: 'number',
    icon: Users,
    delta: { value: '+3.8% vs last month', direction: 'up' },
  },
  {
    label: 'Products',
    value: 1920,
    format: 'number',
    icon: Package,
    delta: { value: '-1.2% vs last month', direction: 'down' },
  },
]

/** Monthly revenue trend for the dashboard chart, in whole pesos. */
export const revenueSeries: { label: string; value: number }[] = [
  { label: 'Apr', value: 812000 },
  { label: 'May', value: 894500 },
  { label: 'Jun', value: 861000 },
  { label: 'Jul', value: 963200 },
  { label: 'Aug', value: 1102800 },
  { label: 'Sep', value: 1284500 },
]

/** Daily order counts for the past week. */
export const orderActivitySeries: { label: string; value: number }[] = [
  { label: 'Mon', value: 38 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 47 },
  { label: 'Thu', value: 61 },
  { label: 'Fri', value: 74 },
  { label: 'Sat', value: 29 },
  { label: 'Sun', value: 18 },
]

export interface QuickAction {
  label: string
  description: string
  icon: IconComponent
  /** Path suffix appended to the demo base route, e.g. "/customers". */
  to: string
}

export const quickActions: QuickAction[] = [
  {
    label: 'Add customer',
    description: 'Create a new customer record',
    icon: UserPlus,
    to: '/customers',
  },
  {
    label: 'Add product',
    description: 'List a new catalogue item',
    icon: PackagePlus,
    to: '/products',
  },
  {
    label: 'Review orders',
    description: 'Check pending and processing orders',
    icon: ShoppingCart,
    to: '/orders',
  },
  {
    label: 'View invoices',
    description: 'Track outstanding payments',
    icon: FileText,
    to: '/invoices',
  },
]
