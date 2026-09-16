import { Link } from '../../../lib/router'
import { StatCard } from '../../../components/demo/StatCard'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatDate, formatNumber } from '../../../lib/format'
import {
  attendanceTrend,
  departmentHeadcount,
  quickActions,
  recentActivity,
  summaryMetrics,
  upcomingEvents,
} from '../../../data/demos/human-resources/dashboard'
import { basePath } from '../../../data/demos/human-resources/navigation'

/** Dashboard: the landing page of the Human Resource Management System demo. */
export function Dashboard() {
  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={formatNumber(metric.value)}
            icon={metric.icon}
            delta={metric.delta}
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Headcount by department" subtitle="Current fictional distribution">
          <BarChart data={departmentHeadcount} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Attendance trend" subtitle="Employees present per day, this week">
          <BarChart data={attendanceTrend} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink-900">Recent HR activity</h2>
          </div>
          <div className="rounded-xl border border-ink-200/80 bg-white">
            <ul className="divide-y divide-ink-100">
              {recentActivity.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <p className="text-sm text-ink-800">{item.message}</p>
                  <span className="shrink-0 text-xs text-ink-400">{formatDate(item.timestamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink-900">Upcoming events</h2>
          </div>
          <div className="rounded-xl border border-ink-200/80 bg-white">
            <ul className="divide-y divide-ink-100">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-ink-900">{event.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {formatDate(event.date)} · {event.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink-900">Quick actions</h2>
        </div>
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
    </div>
  )
}
