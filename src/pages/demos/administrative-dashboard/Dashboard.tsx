import { useState } from 'react'
import type { ReactNode } from 'react'
import { SlidersHorizontal, AlertTriangle } from 'lucide-react'
import { Link } from '../../../lib/router'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { formatDate, formatNumber } from '../../../lib/format'
import { cn } from '../../../lib/cn'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import { basePath } from '../../../data/demos/admin-dashboard/navigation'
import { performanceTrendByRange, quickActions } from '../../../data/demos/admin-dashboard/dashboard'
import {
  DASHBOARD_WIDGETS,
  DATE_RANGE_OPTIONS,
  formatKpiValue,
  pendingApprovalsCount,
} from '../../../data/demos/admin-dashboard/types'
import type { DashboardWidgetId } from '../../../data/demos/admin-dashboard/types'
import { CustomizeDashboardModal } from './CustomizeDashboardModal'

function WidgetCard({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-ink-200/80 bg-white p-5 shadow-soft sm:p-6', className)}>
      <h2 className="mb-4 text-sm font-semibold text-ink-900">{title}</h2>
      {children}
    </div>
  )
}

function KpiSummaryWidget() {
  const { kpis } = useAdminDashboardData()
  const topKpis = kpis.slice(0, 4)

  return (
    <WidgetCard title="KPI Summary" className="lg:col-span-2">
      <div className="grid gap-3 sm:grid-cols-2">
        {topKpis.map((kpi) => (
          <div key={kpi.id} className="rounded-xl border border-ink-200/80 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-medium text-ink-500">{kpi.metric}</p>
              <StatusBadge status={kpi.status} />
            </div>
            <p className="mt-1.5 text-lg font-semibold text-ink-900">{formatKpiValue(kpi)}</p>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

function PerformanceTrendWidget() {
  const { dateRange } = useAdminDashboardData()

  return (
    <div className="lg:col-span-2">
      <ChartCard title="Performance Trend" subtitle={`Illustrative trend for ${dateRange}`}>
        <BarChart data={performanceTrendByRange[dateRange]} formatValue={formatNumber} />
      </ChartCard>
    </div>
  )
}

function DepartmentOverviewWidget() {
  const { departments } = useAdminDashboardData()

  return (
    <WidgetCard title="Department Overview">
      <ul className="divide-y divide-ink-100">
        {departments.map((department) => (
          <li key={department.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-900">{department.name}</p>
              <p className="text-xs text-ink-500">{formatNumber(department.headcount)} staff · {department.openRequests} open requests</p>
            </div>
            <span className="shrink-0 text-sm font-medium text-ink-700">{department.performance}%</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}

function PendingApprovalsWidget() {
  const { approvals } = useAdminDashboardData()
  const pending = approvals.filter((approval) => approval.status === 'Pending').slice(0, 5)

  return (
    <WidgetCard title="Pending Approvals">
      {pending.length > 0 ? (
        <ul className="divide-y divide-ink-100">
          {pending.map((approval) => (
            <li key={approval.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900">{approval.type}</p>
                <p className="text-xs text-ink-500">{approval.requester} · {approval.department}</p>
              </div>
              <StatusBadge status={approval.status} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink-500">Nothing awaiting a decision right now.</p>
      )}
      <Link to={`${basePath}/approvals`} className="mt-3 inline-block text-xs font-medium text-accent-600 hover:text-accent-700">
        View all approvals
      </Link>
    </WidgetCard>
  )
}

function RecentActivityWidget() {
  const { activity } = useAdminDashboardData()

  return (
    <WidgetCard title="Recent Activity">
      <ul className="divide-y divide-ink-100">
        {activity.slice(0, 5).map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <p className="text-sm text-ink-800">{item.message}</p>
            <span className="shrink-0 text-xs text-ink-400">{formatDate(item.timestamp)}</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  )
}

function OperationalSnapshotWidget() {
  const { records, departments, kpis, approvals } = useAdminDashboardData()

  const stats = [
    { label: 'Records needing review', value: records.filter((record) => record.status === 'Needs Review').length },
    { label: 'Departments below 75% performance', value: departments.filter((department) => department.performance < 75).length },
    { label: 'KPIs below target', value: kpis.filter((kpi) => kpi.status === 'Below Target').length },
    { label: 'Approvals awaiting decision', value: pendingApprovalsCount(approvals) },
  ]

  return (
    <WidgetCard title="Operational Snapshot">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-ink-200/80 p-3.5">
            <p className="text-2xl font-semibold text-ink-900">{stat.value}</p>
            <p className="mt-1 text-xs text-ink-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </WidgetCard>
  )
}

const widgetRenderers: Record<DashboardWidgetId, () => ReactNode> = {
  kpis: () => <KpiSummaryWidget />,
  performance: () => <PerformanceTrendWidget />,
  departments: () => <DepartmentOverviewWidget />,
  approvals: () => <PendingApprovalsWidget />,
  activity: () => <RecentActivityWidget />,
  operations: () => <OperationalSnapshotWidget />,
}

/** Dashboard: the configurable centerpiece of the demo. Widget visibility and date range are session state, changed via "Customize Dashboard". */
export function Dashboard() {
  const { visibleWidgetIds, setVisibleWidgets, dateRange, setDateRange } = useAdminDashboardData()
  const [customizeOpen, setCustomizeOpen] = useState(false)

  const visibleWidgets = DASHBOARD_WIDGETS.filter((widget) => visibleWidgetIds.includes(widget.id))

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-44">
          <label htmlFor="dashboard-date-range-select" className="sr-only">
            Date range
          </label>
          <select
            id="dashboard-date-range-select"
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value as typeof dateRange)}
            className={cn(demoControlStyles, 'h-10')}
          >
            {DATE_RANGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <Button type="button" variant="secondary" size="md" onClick={() => setCustomizeOpen(true)}>
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Customize Dashboard
        </Button>
      </div>

      {visibleWidgets.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {visibleWidgets.map((widget) => (
            <div key={widget.id} className="contents">
              {widgetRenderers[widget.id]()}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
          <AlertTriangle className="size-6 text-ink-400" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-ink-800">No widgets are visible</p>
            <p className="mt-1 text-sm text-ink-500">Use Customize Dashboard to show at least one widget.</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold text-ink-900">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                to={`${basePath}${action.to}`}
                className="flex items-center gap-3 rounded-xl border border-ink-200/80 bg-white p-3.5 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-ink-200/80 bg-white text-accent-600">
                  <Icon className="size-4" aria-hidden="true" strokeWidth={1.9} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink-900">{action.label}</span>
                  <span className="block truncate text-xs text-ink-500">{action.description}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <CustomizeDashboardModal
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        initialVisibleWidgetIds={visibleWidgetIds}
        initialDateRange={dateRange}
        onDone={(ids, range) => {
          setVisibleWidgets(ids)
          setDateRange(range)
        }}
      />
    </div>
  )
}
