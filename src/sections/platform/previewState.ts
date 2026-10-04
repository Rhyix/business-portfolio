/** Part of the dashboard preview a workflow step lights up. */
export type PreviewHighlight =
  | 'nav-customers'
  | 'nav-employees'
  | 'tile-revenue'
  | 'tile-orders'
  | 'tile-employees'
  | 'tile-attendance'
  | 'chart-activity'
  | 'recent'

export interface PreviewStats {
  revenue: number
  orders: number
  employees: number
  attendance: number
}

/** The figures the static preview has always shown. */
export const BASE_PREVIEW_STATS: PreviewStats = { revenue: 213855, orders: 12, employees: 16, attendance: 75 }

/**
 * What the dashboard shows once each workflow step has happened. Steps are
 * cumulative: placing the order bumps the order count, invoicing it books the
 * revenue, hiring adds an employee whose attendance then counts.
 */
export const workflowEffects: { highlight: PreviewHighlight; change?: Partial<PreviewStats> }[] = [
  { highlight: 'nav-customers' },
  { highlight: 'tile-orders', change: { orders: 13 } },
  { highlight: 'chart-activity' },
  { highlight: 'recent', change: { revenue: 226355 } },
  { highlight: 'nav-employees' },
  { highlight: 'nav-employees' },
  { highlight: 'tile-employees', change: { employees: 17 } },
  { highlight: 'tile-attendance', change: { attendance: 76 } },
]
