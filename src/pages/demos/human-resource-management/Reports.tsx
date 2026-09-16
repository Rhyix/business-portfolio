import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatNumber } from '../../../lib/format'
import { attendanceTrend, departmentHeadcount } from '../../../data/demos/human-resources/dashboard'
import { employees } from '../../../data/demos/human-resources/employees'
import { leaveRequests } from '../../../data/demos/human-resources/leave'
import { applicants } from '../../../data/demos/human-resources/recruitment'
import type { ApplicantStatus, EmployeeStatus, LeaveType } from '../../../data/demos/human-resources/types'

const LEAVE_TYPE_ORDER: LeaveType[] = ['Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Personal Leave']
const EMPLOYMENT_STATUS_ORDER: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive']
const APPLICANT_PIPELINE_ORDER: ApplicantStatus[] = [
  'Applied',
  'Screening',
  'Interview',
  'Shortlisted',
  'Hired',
  'Rejected',
]

const progressTone: Record<string, string> = {
  'Vacation Leave': 'bg-accent-500',
  'Sick Leave': 'bg-amber-500',
  'Emergency Leave': 'bg-red-400',
  'Personal Leave': 'bg-ink-300',
  Active: 'bg-emerald-500',
  'On Leave': 'bg-accent-500',
  Inactive: 'bg-ink-300',
  Applied: 'bg-ink-300',
  Screening: 'bg-amber-500',
  Interview: 'bg-accent-500',
  Shortlisted: 'bg-accent-600',
  Hired: 'bg-emerald-500',
  Rejected: 'bg-red-400',
}

interface BreakdownRow {
  label: string
  count: number
  percent: number
}

function breakdown<T extends string>(keys: T[], order: T[]): BreakdownRow[] {
  const total = keys.length || 1
  return order.map((label) => {
    const count = keys.filter((key) => key === label).length
    return { label, count, percent: Math.round((count / total) * 100) }
  })
}

const leaveUsage = breakdown(
  leaveRequests.map((request) => request.type),
  LEAVE_TYPE_ORDER,
)
const employmentStatus = breakdown(
  employees.map((employee) => employee.status),
  EMPLOYMENT_STATUS_ORDER,
)
const recruitmentPipeline = breakdown(
  applicants.map((applicant) => applicant.status),
  APPLICANT_PIPELINE_ORDER,
)

function ProgressBreakdown({ rows }: { rows: BreakdownRow[] }) {
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
            <div
              className={`h-2 rounded-full ${progressTone[row.label] ?? 'bg-ink-300'}`}
              style={{ width: `${Math.max(row.percent, 2)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** HR reports page: a handful of simple, polished visualisations built on the same demo HR data. */
export function Reports() {
  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Headcount by department" subtitle="Current fictional distribution">
          <BarChart data={departmentHeadcount} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Attendance trend" subtitle="Employees present per day, this week">
          <BarChart data={attendanceTrend} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Leave usage" subtitle="By leave type, current period">
          <ProgressBreakdown rows={leaveUsage} />
        </ChartCard>
        <ChartCard title="Employment status" subtitle="Across the demo workforce">
          <ProgressBreakdown rows={employmentStatus} />
        </ChartCard>
      </div>

      <ChartCard title="Recruitment pipeline" subtitle="Applicants by stage, current openings">
        <ProgressBreakdown rows={recruitmentPipeline} />
      </ChartCard>
    </div>
  )
}
