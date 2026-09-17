/**
 * Entity shapes for the Custom Administrative Dashboard demo.
 * Every record produced from these types is fictional sample data — see the
 * DemoNotice component shown throughout the demo shell.
 */

import { formatCurrency, formatNumber } from '../../../lib/format'

// ---------------------------------------------------------------------------
// KPI
// ---------------------------------------------------------------------------

export type KpiStatus = 'On Track' | 'Attention' | 'Below Target'
export type KpiCategory = 'Financial' | 'Operational' | 'Workforce' | 'Customer' | 'Compliance'
export type KpiUnit = 'currency' | 'percent' | 'number'

export interface Kpi {
  id: string
  metric: string
  category: KpiCategory
  currentValue: number
  target: number
  unit: KpiUnit
  /** Signed percentage change vs. the previous period, e.g. 4.2 or -1.8. */
  changePct: number
  /**
   * A deliberate, explicitly-stored field rather than a pure derivation — an
   * admin may flag a KPI 'Attention' even when the raw number looks on
   * track. deriveKpiStatus() below exists only as a form default-suggestion.
   */
  status: KpiStatus
  updatedDate: string
}

/** Fields supplied by the KPI add/edit form. */
export type KpiInput = Pick<Kpi, 'metric' | 'category' | 'currentValue' | 'target' | 'unit' | 'changePct' | 'status'>

/** Suggests a status from the raw numbers — a starting point for the form, not an enforced rule. */
export function deriveKpiStatus(currentValue: number, target: number): KpiStatus {
  if (target <= 0) return 'On Track'
  const ratio = currentValue / target
  if (ratio >= 1) return 'On Track'
  if (ratio >= 0.85) return 'Attention'
  return 'Below Target'
}

export function formatKpiValue(kpi: Pick<Kpi, 'currentValue' | 'unit'>): string {
  if (kpi.unit === 'currency') return formatCurrency(kpi.currentValue)
  if (kpi.unit === 'percent') return `${kpi.currentValue}%`
  return formatNumber(kpi.currentValue)
}

export function formatKpiTarget(kpi: Pick<Kpi, 'target' | 'unit'>): string {
  if (kpi.unit === 'currency') return formatCurrency(kpi.target)
  if (kpi.unit === 'percent') return `${kpi.target}%`
  return formatNumber(kpi.target)
}

export function kpisByStatus(kpis: Kpi[]): { status: KpiStatus; count: number }[] {
  const order: KpiStatus[] = ['On Track', 'Attention', 'Below Target']
  return order.map((status) => ({ status, count: kpis.filter((kpi) => kpi.status === status).length }))
}

// ---------------------------------------------------------------------------
// Department
// ---------------------------------------------------------------------------

export type DepartmentName = 'Operations' | 'Human Resources' | 'Finance' | 'Sales' | 'Administration' | 'IT'
export type DepartmentStatus = 'Active' | 'Inactive'

export interface Department {
  id: string
  name: DepartmentName
  description: string
  headcount: number
  openRequests: number
  /** 0-100 illustrative performance score. */
  performance: number
  status: DepartmentStatus
}

/** Fields editable from the department detail view — the org itself (6 departments) is fixed. */
export type DepartmentInput = Pick<Department, 'headcount' | 'openRequests' | 'performance' | 'status'>

export function totalHeadcount(departments: Department[]): number {
  return departments.reduce((sum, department) => sum + department.headcount, 0)
}

export function totalOpenRequests(departments: Department[]): number {
  return departments.reduce((sum, department) => sum + department.openRequests, 0)
}

export function averagePerformance(departments: Department[]): number {
  if (departments.length === 0) return 0
  return Math.round(departments.reduce((sum, department) => sum + department.performance, 0) / departments.length)
}

// ---------------------------------------------------------------------------
// Approval
// ---------------------------------------------------------------------------

export type ApprovalType = 'Purchase Request' | 'Leave Request' | 'Budget Request' | 'Administrative Request'
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected'

export interface Approval {
  id: string
  type: ApprovalType
  requester: string
  department: DepartmentName
  dateSubmitted: string
  status: ApprovalStatus
  details: string
  /** Set once approved or rejected; undefined while Pending. */
  decisionDate?: string
}

export function pendingApprovalsCount(approvals: Approval[]): number {
  return approvals.filter((approval) => approval.status === 'Pending').length
}

export function approvalsByStatus(approvals: Approval[]): { status: ApprovalStatus; count: number }[] {
  const order: ApprovalStatus[] = ['Pending', 'Approved', 'Rejected']
  return order.map((status) => ({ status, count: approvals.filter((approval) => approval.status === status).length }))
}

// ---------------------------------------------------------------------------
// Data Explorer record
// ---------------------------------------------------------------------------

export type DataRecordStatus = 'Active' | 'Pending' | 'Needs Review' | 'Closed'

export interface DataRecord {
  id: string
  name: string
  category: string
  department: DepartmentName
  value: number
  status: DataRecordStatus
  updatedDate: string
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

export type AdminActivityType =
  | 'kpi.added'
  | 'kpi.updated'
  | 'kpi.removed'
  | 'approval.approved'
  | 'approval.rejected'
  | 'dashboard.widgets_changed'
  | 'dashboard.date_range_changed'
  | 'department.updated'
  | 'data.record_updated'

export interface AdminActivityItem {
  id: string
  type: AdminActivityType
  message: string
  timestamp: string
}

// ---------------------------------------------------------------------------
// Dashboard widget system — visibility-only, fixed order, no drag-and-drop.
// ---------------------------------------------------------------------------

export type DashboardWidgetId = 'kpis' | 'performance' | 'departments' | 'approvals' | 'activity' | 'operations'

export interface DashboardWidgetDefinition {
  id: DashboardWidgetId
  /** Card title and the customization panel's checkbox label. */
  title: string
  /** One line shown under the checkbox, so a toggle is self-explanatory. */
  description: string
}

export const DASHBOARD_WIDGETS: DashboardWidgetDefinition[] = [
  { id: 'kpis', title: 'KPI Summary', description: 'Key metrics against target, at a glance.' },
  { id: 'performance', title: 'Performance Trend', description: 'Illustrative trend for the selected date range.' },
  { id: 'departments', title: 'Department Overview', description: 'Headcount, requests and performance by department.' },
  { id: 'approvals', title: 'Pending Approvals', description: 'Requests waiting for a decision.' },
  { id: 'activity', title: 'Recent Activity', description: 'The latest actions across the workspace.' },
  { id: 'operations', title: 'Operational Snapshot', description: 'Quick operational indicators for today.' },
]

export const DEFAULT_VISIBLE_WIDGETS: DashboardWidgetId[] = ['kpis', 'performance', 'departments', 'approvals', 'activity', 'operations']

// ---------------------------------------------------------------------------
// Date range — four fixed illustrative options, not a calendar picker.
// ---------------------------------------------------------------------------

export type DashboardDateRange = 'Today' | 'This Week' | 'This Month' | 'This Quarter'

export const DATE_RANGE_OPTIONS: DashboardDateRange[] = ['Today', 'This Week', 'This Month', 'This Quarter']
