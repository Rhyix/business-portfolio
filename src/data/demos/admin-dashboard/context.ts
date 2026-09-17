import { createContext, useContext } from 'react'
import type {
  AdminActivityItem,
  Approval,
  DashboardDateRange,
  DashboardWidgetId,
  DataRecord,
  Department,
  DepartmentInput,
  Kpi,
  KpiInput,
} from './types'

export interface AdminDashboardDataContextValue {
  kpis: Kpi[]
  departments: Department[]
  approvals: Approval[]
  records: DataRecord[]
  activity: AdminActivityItem[]

  addKpi: (values: KpiInput) => void
  updateKpi: (id: string, values: KpiInput) => void
  removeKpi: (id: string) => void

  updateDepartment: (id: string, values: DepartmentInput) => void

  approveRequest: (id: string) => void
  rejectRequest: (id: string) => void

  /** Dashboard customization state — lives in the same store as the entity data, read/written by both the Dashboard page and Settings' Dashboard Preferences tab. */
  visibleWidgetIds: DashboardWidgetId[]
  setVisibleWidgets: (ids: DashboardWidgetId[]) => void
  resetWidgetLayout: () => void
  dateRange: DashboardDateRange
  setDateRange: (range: DashboardDateRange) => void
}

export const AdminDashboardDataContext = createContext<AdminDashboardDataContextValue | null>(null)

/** Reads the administrative dashboard demo's shared store. Must be used within AdminDashboardDataProvider. */
export function useAdminDashboardData(): AdminDashboardDataContextValue {
  const context = useContext(AdminDashboardDataContext)
  if (!context) throw new Error('useAdminDashboardData must be used within an AdminDashboardDataProvider')
  return context
}
