import { DollarSign, ShoppingCart, Users, UsersRound, CalendarCheck, Briefcase, ArrowRight } from 'lucide-react'
import { Link } from '../../../lib/router'
import { StatCard } from '../../../components/demo/StatCard'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { useIntegratedData } from '../../../data/demos/integrated/context'
import { formatCurrency, formatDate, formatNumber } from '../../../lib/format'
import { revenueSeries, orderActivitySeries } from '../../../data/demos/business-management/dashboard'
import { departmentHeadcount, attendanceTrend, upcomingEvents } from '../../../data/demos/human-resources/dashboard'
import { basePath } from '../../../data/demos/integrated/navigation'
import type { Order } from '../../../data/demos/integrated/types'

const quickActions = [
  { label: 'Add customer', to: '/customers' },
  { label: 'Create order', to: '/orders' },
  { label: 'Add employee', to: '/employees' },
  { label: 'Review leave', to: '/leave' },
  { label: 'Add product', to: '/products' },
]

const recentOrderColumns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'Order', render: (order) => <span className="font-medium text-ink-900">{order.id}</span> },
  { key: 'customer', header: 'Customer', render: (order) => order.customerName },
  { key: 'total', header: 'Total', render: (order) => formatCurrency(order.total) },
  { key: 'status', header: 'Status', render: (order) => <StatusBadge status={order.status} /> },
]

function SectionHeader({ title, viewAllHref }: { title: string; viewAllHref?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
      {viewAllHref ? (
        <Link
          to={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 transition-colors duration-200 hover:text-accent-700"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}

/**
 * Unified dashboard for the integrated platform: business performance and
 * workforce status side by side, backed by the shared store so it reflects
 * changes made anywhere else in the platform during this demo session.
 */
export function Dashboard() {
  const shared = useIntegratedData()

  const revenue = shared.orders.reduce((sum, order) => sum + order.total, 0)
  const openPositions = shared.jobOpenings
    .filter((job) => job.status === 'Open')
    .reduce((sum, job) => sum + job.openings, 0)

  const latestAttendanceDate = shared.attendanceDates[shared.attendanceDates.length - 1]
  const todaysAttendance = shared.attendanceRecords.filter((record) => record.date === latestAttendanceDate)
  const presentToday = todaysAttendance.filter((record) => record.status === 'Present' || record.status === 'Late')
  const attendanceRate = todaysAttendance.length
    ? Math.round((presentToday.length / todaysAttendance.length) * 100)
    : 0

  const pendingLeave = shared.leaveRequests.filter((request) => request.status === 'Pending')
  const lowStockProducts = shared.products
    .filter((product) => product.stock <= product.reorderLevel)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5)
  const recentOrders = shared.orders.slice(0, 5)

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Revenue" value={formatCurrency(revenue)} icon={DollarSign} />
        <StatCard label="Orders" value={formatNumber(shared.orders.length)} icon={ShoppingCart} />
        <StatCard label="Customers" value={formatNumber(shared.customers.length)} icon={Users} />
        <StatCard label="Employees" value={formatNumber(shared.employees.length)} icon={UsersRound} />
        <StatCard label="Attendance" value={`${attendanceRate}%`} icon={CalendarCheck} />
        <StatCard label="Open Positions" value={formatNumber(openPositions)} icon={Briefcase} />
      </div>

      <div>
        <SectionHeader title="Business performance" />
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="Revenue trend" subtitle="Last 6 months">
            <BarChart data={revenueSeries} formatValue={formatCurrency} />
          </ChartCard>
          <ChartCard title="Order activity" subtitle="Orders per day, this week">
            <BarChart data={orderActivitySeries} formatValue={formatNumber} />
          </ChartCard>
        </div>
        <div className="mt-5">
          <SectionHeader title="Recent orders" viewAllHref={`${basePath}/orders`} />
          <DataTable columns={recentOrderColumns} rows={recentOrders} rowKey={(order) => order.id} />
        </div>
      </div>

      <div>
        <SectionHeader title="Workforce overview" />
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="Headcount by department" subtitle="Current fictional distribution">
            <BarChart data={departmentHeadcount} formatValue={formatNumber} />
          </ChartCard>
          <ChartCard title="Attendance trend" subtitle="Employees present per day, this week">
            <BarChart data={attendanceTrend} formatValue={formatNumber} />
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <SectionHeader title="Pending leave requests" viewAllHref={`${basePath}/leave`} />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            {pendingLeave.length > 0 ? (
              <ul className="divide-y divide-ink-100">
                {pendingLeave.slice(0, 5).map((request) => (
                  <li key={request.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{request.employeeName}</p>
                      <p className="text-xs text-ink-500">
                        {request.type} · {request.days} day{request.days === 1 ? '' : 's'}
                      </p>
                    </div>
                    <StatusBadge status={request.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-ink-500">No pending leave requests.</p>
            )}
          </div>
        </div>

        <div>
          <SectionHeader title="Low-stock & out-of-stock products" viewAllHref={`${basePath}/inventory`} />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            {lowStockProducts.length > 0 ? (
              <ul className="divide-y divide-ink-100">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{product.name}</p>
                      <p className="text-xs text-ink-500">{formatNumber(product.stock)} in stock</p>
                    </div>
                    <StatusBadge status={product.stock === 0 ? 'Out of stock' : 'Low stock'} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-ink-500">All products are at a healthy stock level.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <SectionHeader title="Recent activity" />
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
          <SectionHeader title="Upcoming events" />
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
        <SectionHeader title="Quick actions" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={`${basePath}${action.to}`}
              className="flex items-center justify-center rounded-xl border border-ink-200/80 bg-white px-3.5 py-3 text-center text-sm font-medium text-ink-900 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
