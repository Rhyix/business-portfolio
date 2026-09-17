import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { formatNumber } from '../../../lib/format'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import { performanceTrendByRange } from '../../../data/demos/admin-dashboard/dashboard'
import { approvalsByStatus, kpisByStatus } from '../../../data/demos/admin-dashboard/types'
import type { ApprovalStatus, KpiStatus } from '../../../data/demos/admin-dashboard/types'
import { toCsv, downloadCsv } from './exportCsv'

const kpiStatusTone: Record<KpiStatus, string> = {
  'On Track': 'bg-emerald-500',
  Attention: 'bg-amber-500',
  'Below Target': 'bg-red-500',
}

const approvalStatusTone: Record<ApprovalStatus, string> = {
  Pending: 'bg-amber-500',
  Approved: 'bg-emerald-500',
  Rejected: 'bg-red-400',
}

function ProgressBreakdown({ rows }: { rows: { label: string; count: number; percent: number; tone: string }[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-700">{row.label}</span>
            <span className="text-ink-500">
              {row.count} · {row.percent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-ink-100">
            <div className={`h-2 rounded-full ${row.tone}`} style={{ width: `${Math.max(row.percent, 2)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Reports: KPI performance, department comparison, approval activity, operational activity and a trend overview. */
export function Reports() {
  const { kpis, departments, approvals, records, dateRange } = useAdminDashboardData()
  const [exportedNotice, setExportedNotice] = useState(false)

  const kpiBreakdown = useMemo(() => {
    const total = kpis.length || 1
    return kpisByStatus(kpis).map((row) => ({ label: row.status, count: row.count, percent: Math.round((row.count / total) * 100), tone: kpiStatusTone[row.status] }))
  }, [kpis])

  const approvalBreakdown = useMemo(() => {
    const total = approvals.length || 1
    return approvalsByStatus(approvals).map((row) => ({ label: row.status, count: row.count, percent: Math.round((row.count / total) * 100), tone: approvalStatusTone[row.status] }))
  }, [approvals])

  const departmentComparison = useMemo(() => departments.map((department) => ({ label: department.name, value: department.performance })), [departments])

  const recordsByCategory = useMemo(() => {
    const counts = new Map<string, number>()
    for (const record of records) counts.set(record.category, (counts.get(record.category) ?? 0) + 1)
    return Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
  }, [records])

  const handleExport = () => {
    const csv = toCsv(kpis, [
      { header: 'Metric', value: (kpi) => kpi.metric },
      { header: 'Category', value: (kpi) => kpi.category },
      { header: 'Current Value', value: (kpi) => kpi.currentValue },
      { header: 'Target', value: (kpi) => kpi.target },
      { header: 'Status', value: (kpi) => kpi.status },
    ])
    downloadCsv('administrative-dashboard-kpi-report.csv', csv)
    setExportedNotice(true)
    window.setTimeout(() => setExportedNotice(false), 2500)
  }

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="flex flex-wrap items-center justify-end gap-3">
        {exportedNotice ? (
          <span role="status" className="text-xs font-medium text-emerald-600">
            Report prepared for export.
          </span>
        ) : null}
        <Button type="button" variant="secondary" size="md" onClick={handleExport}>
          <Download className="size-4" aria-hidden="true" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="KPI performance" subtitle="Share of KPIs at each status">
          <ProgressBreakdown rows={kpiBreakdown} />
        </ChartCard>
        <ChartCard title="Approval activity" subtitle="Share of requests at each status">
          <ProgressBreakdown rows={approvalBreakdown} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Department comparison" subtitle="Performance score by department">
          <BarChart data={departmentComparison} formatValue={(value) => `${value}%`} />
        </ChartCard>
        <ChartCard title="Operational activity" subtitle="Data records by category">
          <BarChart data={recordsByCategory} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <ChartCard title="Trend overview" subtitle={`Illustrative trend for ${dateRange}`}>
        <BarChart data={performanceTrendByRange[dateRange]} formatValue={formatNumber} />
      </ChartCard>
    </div>
  )
}
