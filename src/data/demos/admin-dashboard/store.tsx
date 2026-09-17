import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AdminDashboardDataContext } from './context'
import { initialKpis } from './kpis'
import { initialDepartments } from './departments'
import { initialApprovals } from './approvals'
import { initialRecords } from './records'
import { initialActivity } from './activity'
import { DEFAULT_VISIBLE_WIDGETS } from './types'
import type {
  AdminActivityType,
  Approval,
  DashboardDateRange,
  DashboardWidgetId,
  DataRecord,
  Department,
  DepartmentInput,
  Kpi,
  KpiInput,
} from './types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Shared in-memory demo store for the Custom Administrative Dashboard. A
 * lightweight custom store (useState + plain updater functions), scoped
 * entirely to this demo — no cross-demo integration yet (matching every
 * other standalone demo in this portfolio).
 */
export function AdminDashboardDataProvider({ children }: { children: ReactNode }) {
  const [kpis, setKpis] = useState<Kpi[]>(initialKpis)
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals)
  const [records] = useState<DataRecord[]>(initialRecords)
  const [activity, setActivity] = useState(initialActivity)
  const [visibleWidgetIds, setVisibleWidgetIdsState] = useState<DashboardWidgetId[]>(DEFAULT_VISIBLE_WIDGETS)
  const [dateRange, setDateRangeState] = useState<DashboardDateRange>('This Month')

  const nextKpiId = useRef(11)
  const nextActivityId = useRef(8)

  const logActivity = useCallback((type: AdminActivityType, message: string) => {
    setActivity((current) => [{ id: `aact-${nextActivityId.current++}`, type, message, timestamp: today() }, ...current].slice(0, 25))
  }, [])

  const addKpi = useCallback(
    (values: KpiInput) => {
      const newKpi: Kpi = { id: `KPI-${nextKpiId.current++}`, ...values, updatedDate: today() }
      setKpis((current) => [newKpi, ...current])
      logActivity('kpi.added', `${newKpi.metric} was added to the KPI list.`)
    },
    [logActivity],
  )

  const updateKpi = useCallback(
    (id: string, values: KpiInput) => {
      const existing = kpis.find((kpi) => kpi.id === id)
      if (!existing) return
      setKpis((current) => current.map((kpi) => (kpi.id === id ? { ...kpi, ...values, updatedDate: today() } : kpi)))
      logActivity('kpi.updated', `${values.metric} was updated.`)
    },
    [kpis, logActivity],
  )

  const removeKpi = useCallback(
    (id: string) => {
      const existing = kpis.find((kpi) => kpi.id === id)
      if (!existing) return
      setKpis((current) => current.filter((kpi) => kpi.id !== id))
      logActivity('kpi.removed', `${existing.metric} was removed from the KPI list.`)
    },
    [kpis, logActivity],
  )

  const updateDepartment = useCallback(
    (id: string, values: DepartmentInput) => {
      const existing = departments.find((department) => department.id === id)
      if (!existing) return
      setDepartments((current) => current.map((department) => (department.id === id ? { ...department, ...values } : department)))
      logActivity('department.updated', `${existing.name} department details were updated.`)
    },
    [departments, logActivity],
  )

  const approveRequest = useCallback(
    (id: string) => {
      const approval = approvals.find((item) => item.id === id)
      if (!approval) return
      setApprovals((current) => current.map((item) => (item.id === id ? { ...item, status: 'Approved', decisionDate: today() } : item)))
      logActivity('approval.approved', `Approved ${approval.type.toLowerCase()} ${approval.id} from ${approval.requester}.`)
    },
    [approvals, logActivity],
  )

  const rejectRequest = useCallback(
    (id: string) => {
      const approval = approvals.find((item) => item.id === id)
      if (!approval) return
      setApprovals((current) => current.map((item) => (item.id === id ? { ...item, status: 'Rejected', decisionDate: today() } : item)))
      logActivity('approval.rejected', `Rejected ${approval.type.toLowerCase()} ${approval.id} from ${approval.requester}.`)
    },
    [approvals, logActivity],
  )

  const setVisibleWidgets = useCallback(
    (ids: DashboardWidgetId[]) => {
      setVisibleWidgetIdsState(ids)
      logActivity('dashboard.widgets_changed', 'Dashboard widget selection was updated.')
    },
    [logActivity],
  )

  const resetWidgetLayout = useCallback(() => {
    setVisibleWidgetIdsState(DEFAULT_VISIBLE_WIDGETS)
    logActivity('dashboard.widgets_changed', 'Dashboard layout was reset to the default widget set.')
  }, [logActivity])

  const setDateRange = useCallback(
    (range: DashboardDateRange) => {
      setDateRangeState(range)
      logActivity('dashboard.date_range_changed', `Dashboard date range changed to ${range}.`)
    },
    [logActivity],
  )

  const value = {
    kpis,
    departments,
    approvals,
    records,
    activity,
    addKpi,
    updateKpi,
    removeKpi,
    updateDepartment,
    approveRequest,
    rejectRequest,
    visibleWidgetIds,
    setVisibleWidgets,
    resetWidgetLayout,
    dateRange,
    setDateRange,
  }

  return <AdminDashboardDataContext.Provider value={value}>{children}</AdminDashboardDataContext.Provider>
}
