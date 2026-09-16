import { Link } from '../../../lib/router'
import { StatCard } from '../../../components/demo/StatCard'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import { formatDate, formatNumber } from '../../../lib/format'
import {
  applicantFunnel,
  applicationsByPosition,
  quickActions,
  summaryMetrics,
} from '../../../data/demos/recruitment/dashboard'
import { basePath } from '../../../data/demos/recruitment/navigation'
import type { Interview } from '../../../data/demos/recruitment/types'

const interviewColumns: DataTableColumn<Interview>[] = [
  { key: 'candidate', header: 'Candidate', render: (interview) => <span className="font-medium text-ink-900">{interview.candidateName}</span> },
  { key: 'position', header: 'Position', render: (interview) => interview.positionTitle },
  { key: 'date', header: 'Date', render: (interview) => `${formatDate(interview.date)} · ${interview.time}` },
  { key: 'status', header: 'Status', render: (interview) => <StatusBadge status={interview.status} /> },
]

function SectionHeader({ title }: { title: string }) {
  return <h2 className="mb-4 text-sm font-semibold text-ink-900">{title}</h2>
}

/** Dashboard: the landing page of the Recruitment Management System demo. */
export function Dashboard() {
  const shared = useRecruitmentData()

  const openVacancies = shared.vacancies.filter((vacancy) => vacancy.status === 'Open')
  const upcomingInterviews = shared.interviews
    .filter((interview) => interview.status === 'Scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

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
        <ChartCard title="Applicant funnel" subtitle="Candidates by stage, current openings">
          <BarChart data={applicantFunnel} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Applications by position" subtitle="Top open roles by candidate volume">
          <BarChart data={applicationsByPosition} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Upcoming interviews" />
          <DataTable
            columns={interviewColumns}
            rows={upcomingInterviews}
            rowKey={(interview) => interview.id}
            emptyTitle="No interviews scheduled"
            emptyMessage="Scheduled interviews will appear here."
          />
        </div>

        <div>
          <SectionHeader title="Open positions" />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            <ul className="divide-y divide-ink-100">
              {openVacancies.slice(0, 5).map((vacancy) => (
                <li key={vacancy.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{vacancy.title}</p>
                    <p className="text-xs text-ink-500">{vacancy.department}</p>
                  </div>
                  <StatusBadge status={vacancy.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Recent hiring activity" />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            <ul className="divide-y divide-ink-100">
              {shared.activity.slice(0, 6).map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <p className="text-sm text-ink-800">{item.message}</p>
                  <span className="shrink-0 text-xs text-ink-400">{formatDate(item.timestamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionHeader title="Quick actions" />
          <div className="grid gap-3">
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
    </div>
  )
}
