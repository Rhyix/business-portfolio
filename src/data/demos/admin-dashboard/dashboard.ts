import { DollarSign, ClipboardCheck, UsersRound, Gauge, Target, BarChart3, Database } from 'lucide-react'
import type { IconComponent } from '../../../types/content'
import type { DashboardDateRange } from './types'

export interface SummaryMetric {
  label: string
  value: string
  delta?: { value: string; direction: 'up' | 'down' }
  icon: IconComponent
}

/** Illustrative Overview-page figures — separate from the small interactive dataset, matching the established pattern across the other demos. */
export const overviewMetrics: SummaryMetric[] = [
  { label: 'Revenue (MTD)', value: '₱1,850,000', delta: { value: '+4.2%', direction: 'up' }, icon: DollarSign },
  { label: 'Approvals Pending', value: '7', delta: { value: '+2', direction: 'up' }, icon: ClipboardCheck },
  { label: 'Total Headcount', value: '188', delta: { value: '+3', direction: 'up' }, icon: UsersRound },
  { label: 'Avg. Department Performance', value: '80%', delta: { value: '-1.5%', direction: 'down' }, icon: Gauge },
]

/** Illustrative performance-trend datasets, one per date-range option — swapped by the Dashboard's date-range control rather than filtering real records. */
export const performanceTrendByRange: Record<DashboardDateRange, { label: string; value: number }[]> = {
  Today: [
    { label: '6a', value: 12 },
    { label: '9a', value: 28 },
    { label: '12p', value: 41 },
    { label: '3p', value: 35 },
    { label: '6p', value: 22 },
    { label: '9p', value: 9 },
  ],
  'This Week': [
    { label: 'Mon', value: 62 },
    { label: 'Tue', value: 74 },
    { label: 'Wed', value: 58 },
    { label: 'Thu', value: 81 },
    { label: 'Fri', value: 90 },
    { label: 'Sat', value: 34 },
    { label: 'Sun', value: 21 },
  ],
  'This Month': [
    { label: 'Wk 1', value: 320 },
    { label: 'Wk 2', value: 410 },
    { label: 'Wk 3', value: 385 },
    { label: 'Wk 4', value: 452 },
  ],
  'This Quarter': [
    { label: 'Jul', value: 1180 },
    { label: 'Aug', value: 1340 },
    { label: 'Sep', value: 1420 },
  ],
}

export interface QuickAction {
  label: string
  description: string
  to: string
  icon: IconComponent
}

export const quickActions: QuickAction[] = [
  { label: 'Add KPI', description: 'Track a new metric against target', to: '/kpis', icon: Target },
  { label: 'Review approvals', description: 'See requests waiting for a decision', to: '/approvals', icon: ClipboardCheck },
  { label: 'View reports', description: 'KPI, department and approval reporting', to: '/reports', icon: BarChart3 },
  { label: 'Data Explorer', description: 'Browse administrative records', to: '/data', icon: Database },
]
