import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatDate } from '../../../lib/format'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'

/** Activity: the full unified feed — KPI, approval, department, data and dashboard-customization actions, newest first. */
export function Activity() {
  const { activity } = useAdminDashboardData()

  return (
    <div className="space-y-5">
      <DemoNotice variant="inline" />

      <div className="rounded-xl border border-ink-200/80 bg-white">
        <ul className="divide-y divide-ink-100">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3.5">
              <p className="text-sm text-ink-800">{item.message}</p>
              <span className="shrink-0 text-xs text-ink-400">{formatDate(item.timestamp)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
