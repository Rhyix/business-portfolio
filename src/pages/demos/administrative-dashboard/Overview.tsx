import { StatCard } from '../../../components/demo/StatCard'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatDate, formatNumber } from '../../../lib/format'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import { overviewMetrics, performanceTrendByRange } from '../../../data/demos/admin-dashboard/dashboard'
import { approvalsByStatus, averagePerformance, totalHeadcount, totalOpenRequests } from '../../../data/demos/admin-dashboard/types'

function SectionHeader({ title }: { title: string }) {
  return <h2 className="mb-4 text-sm font-semibold text-ink-900">{title}</h2>
}

/**
 * Overview: a fixed, always-complete management review — every section
 * always renders, with no widget-visibility toggles. Distinct from the
 * configurable root Dashboard by design (see Stage 15 plan section B).
 */
export function Overview() {
  const { departments, approvals, activity } = useAdminDashboardData()

  const statusBreakdown = approvalsByStatus(approvals)
  const approvalTotal = approvals.length || 1

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div>
        <SectionHeader title="Business performance" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewMetrics.map((metric) => (
            <StatCard key={metric.label} label={metric.label} value={metric.value} icon={metric.icon} delta={metric.delta} />
          ))}
        </div>
      </div>

      <ChartCard title="Performance trend" subtitle="Illustrative trend, this month">
        <BarChart data={performanceTrendByRange['This Month']} formatValue={formatNumber} />
      </ChartCard>

      <div>
        <SectionHeader title="Workforce snapshot" />
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-ink-200/80 bg-white p-4">
            <p className="text-xs font-medium text-ink-500">Total headcount</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{formatNumber(totalHeadcount(departments))}</p>
          </div>
          <div className="rounded-xl border border-ink-200/80 bg-white p-4">
            <p className="text-xs font-medium text-ink-500">Open requests</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{formatNumber(totalOpenRequests(departments))}</p>
          </div>
          <div className="rounded-xl border border-ink-200/80 bg-white p-4">
            <p className="text-xs font-medium text-ink-500">Average performance</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{averagePerformance(departments)}%</p>
          </div>
        </div>
        <ul className="mt-4 divide-y divide-ink-100 rounded-xl border border-ink-200/80 bg-white">
          {departments.map((department) => (
            <li key={department.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900">{department.name}</p>
                <p className="text-xs text-ink-500">
                  {formatNumber(department.headcount)} staff · {department.openRequests} open requests
                </p>
              </div>
              <StatusBadge status={department.status} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SectionHeader title="Approval status" />
        <div className="space-y-4 rounded-xl border border-ink-200/80 bg-white p-4">
          {statusBreakdown.map((row) => (
            <div key={row.status}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-ink-700">{row.status}</span>
                <span className="text-ink-500">
                  {row.count} · {Math.round((row.count / approvalTotal) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-ink-100">
                <div
                  className={
                    row.status === 'Approved' ? 'h-2 rounded-full bg-emerald-500' : row.status === 'Rejected' ? 'h-2 rounded-full bg-red-400' : 'h-2 rounded-full bg-amber-500'
                  }
                  style={{ width: `${Math.max(Math.round((row.count / approvalTotal) * 100), 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Recent activity" />
        <div className="rounded-xl border border-ink-200/80 bg-white">
          <ul className="divide-y divide-ink-100">
            {activity.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <p className="text-sm text-ink-800">{item.message}</p>
                <span className="shrink-0 text-xs text-ink-400">{formatDate(item.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
