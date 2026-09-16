import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { useIntegratedData } from '../../../data/demos/integrated/context'
import { formatCurrency, formatNumber } from '../../../lib/format'
import { revenueSeries, orderActivitySeries } from '../../../data/demos/business-management/dashboard'
import { departmentHeadcount, attendanceTrend } from '../../../data/demos/human-resources/dashboard'
import type { CustomerStatus, OrderStatus } from '../../../data/demos/business-management/types'
import type { ApplicantStatus, EmployeeStatus, LeaveType } from '../../../data/demos/human-resources/types'

const ORDER_STATUS_ORDER: OrderStatus[] = ['Completed', 'Processing', 'Pending', 'Cancelled']
const CUSTOMER_STATUS_ORDER: CustomerStatus[] = ['Active', 'Lead', 'Inactive']
const LEAVE_TYPE_ORDER: LeaveType[] = ['Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Personal Leave']
const EMPLOYMENT_STATUS_ORDER: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive']
const PIPELINE_ORDER: ApplicantStatus[] = ['Applied', 'Screening', 'Interview', 'Shortlisted', 'Hired', 'Rejected']

const tone: Record<string, string> = {
  Completed: 'bg-emerald-500',
  Active: 'bg-emerald-500',
  Hired: 'bg-emerald-500',
  Processing: 'bg-accent-500',
  Interview: 'bg-accent-500',
  'On Leave': 'bg-accent-500',
  Lead: 'bg-accent-500',
  Pending: 'bg-amber-500',
  Screening: 'bg-amber-500',
  'Sick Leave': 'bg-amber-500',
  'Emergency Leave': 'bg-red-400',
  Cancelled: 'bg-red-400',
  Rejected: 'bg-red-400',
  Inactive: 'bg-ink-300',
  Applied: 'bg-ink-300',
  'Vacation Leave': 'bg-accent-600',
  'Personal Leave': 'bg-ink-300',
  Shortlisted: 'bg-accent-600',
}

interface BreakdownRow {
  label: string
  count: number
  percent: number
}

function breakdown<T extends string>(values: T[], order: T[]): BreakdownRow[] {
  const total = values.length || 1
  return order.map((label) => {
    const count = values.filter((value) => value === label).length
    return { label, count, percent: Math.round((count / total) * 100) }
  })
}

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
              className={`h-2 rounded-full ${tone[row.label] ?? 'bg-ink-300'}`}
              style={{ width: `${Math.max(row.percent, 2)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Integrated reports: business analytics (revenue, orders, customers) and
 * workforce analytics (headcount, attendance, leave, recruitment) in one
 * place, computed live from the shared store.
 */
export function Reports() {
  const shared = useIntegratedData()

  const totalRevenue = shared.orders.reduce((sum, order) => sum + order.total, 0)
  const orderStatusBreakdown = breakdown(
    shared.orders.map((order) => order.status),
    ORDER_STATUS_ORDER,
  )
  const customerStatusBreakdown = breakdown(
    shared.customers.map((customer) => customer.status),
    CUSTOMER_STATUS_ORDER,
  )
  const leaveUsageBreakdown = breakdown(
    shared.leaveRequests.map((request) => request.type),
    LEAVE_TYPE_ORDER,
  )
  const employmentStatusBreakdown = breakdown(
    shared.employees.map((employee) => employee.status),
    EMPLOYMENT_STATUS_ORDER,
  )
  const pipelineBreakdown = breakdown(
    shared.applicants.map((applicant) => applicant.status),
    PIPELINE_ORDER,
  )

  return (
    <div className="space-y-10">
      <DemoNotice variant="inline" />

      <div>
        <h2 className="mb-4 text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">Business</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="Revenue" subtitle={`${formatCurrency(totalRevenue)} across ${formatNumber(shared.orders.length)} orders`}>
            <BarChart data={revenueSeries} formatValue={formatCurrency} />
          </ChartCard>
          <ChartCard title="Order activity" subtitle="Orders per day, this week">
            <BarChart data={orderActivitySeries} formatValue={formatNumber} />
          </ChartCard>
          <ChartCard title="Orders by status" subtitle="Live from the shared store">
            <ProgressBreakdown rows={orderStatusBreakdown} />
          </ChartCard>
          <ChartCard title="Customers by status" subtitle="Live from the shared store">
            <ProgressBreakdown rows={customerStatusBreakdown} />
          </ChartCard>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">Workforce</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="Headcount by department" subtitle="Current fictional distribution">
            <BarChart data={departmentHeadcount} formatValue={formatNumber} />
          </ChartCard>
          <ChartCard title="Attendance trend" subtitle="Employees present per day, this week">
            <BarChart data={attendanceTrend} formatValue={formatNumber} />
          </ChartCard>
          <ChartCard title="Leave usage" subtitle="By leave type, live from the shared store">
            <ProgressBreakdown rows={leaveUsageBreakdown} />
          </ChartCard>
          <ChartCard title="Employment status" subtitle="Across the demo workforce">
            <ProgressBreakdown rows={employmentStatusBreakdown} />
          </ChartCard>
        </div>
        <div className="mt-5">
          <ChartCard title="Recruitment pipeline" subtitle="Applicants by stage, live from the shared store">
            <ProgressBreakdown rows={pipelineBreakdown} />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
