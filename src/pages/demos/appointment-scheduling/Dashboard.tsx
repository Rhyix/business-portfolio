import { useMemo } from 'react'
import { Link } from '../../../lib/router'
import { StatCard } from '../../../components/demo/StatCard'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatDate, formatNumber } from '../../../lib/format'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { busiestStaff, mostBookedServices, quickActions, summaryMetrics, weeklyTrend } from '../../../data/demos/appointments/dashboard'
import { basePath } from '../../../data/demos/appointments/navigation'
import { getDayAppointments, todayISO } from '../../../data/demos/appointments/types'
import type { AppointmentStatus } from '../../../data/demos/appointments/types'

const statusOrder: AppointmentStatus[] = ['Pending', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled', 'No Show']

function SectionHeader({ title }: { title: string }) {
  return <h2 className="mb-4 text-sm font-semibold text-ink-900">{title}</h2>
}

/** Dashboard: the landing page of the Appointment & Scheduling System demo. */
export function Dashboard() {
  const { appointments, activity, setPendingBooking } = useAppointmentsData()

  const todayAppointments = useMemo(() => getDayAppointments(todayISO(), appointments), [appointments])
  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.date > todayISO() && appointment.status !== 'Cancelled')
        .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
        .slice(0, 5),
    [appointments],
  )

  const statusCounts = useMemo(() => {
    return statusOrder.map((status) => ({ status, count: appointments.filter((appointment) => appointment.status === status).length }))
  }, [appointments])

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <StatCard key={metric.label} label={metric.label} value={formatNumber(metric.value)} icon={metric.icon} delta={metric.delta} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Today's schedule" />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            {todayAppointments.length > 0 ? (
              <ul className="divide-y divide-ink-100">
                {todayAppointments.map((appointment) => (
                  <li key={appointment.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">
                        {appointment.time} · {appointment.customerName}
                      </p>
                      <p className="text-xs text-ink-500">
                        {appointment.serviceName} with {appointment.staffName}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-ink-500">Nothing scheduled for today.</p>
            )}
          </div>
        </div>

        <div>
          <SectionHeader title="Status breakdown" />
          <div className="rounded-xl border border-ink-200/80 bg-white p-4">
            <ul className="space-y-2.5">
              {statusCounts.map(({ status, count }) => (
                <li key={status} className="flex items-center justify-between gap-3">
                  <StatusBadge status={status} />
                  <span className="text-sm font-medium text-ink-900">{formatNumber(count)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Upcoming appointments" />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            {upcomingAppointments.length > 0 ? (
              <ul className="divide-y divide-ink-100">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{appointment.customerName}</p>
                      <p className="text-xs text-ink-500">
                        {formatDate(appointment.date)} at {appointment.time} · {appointment.serviceName}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-ink-500">No upcoming appointments.</p>
            )}
          </div>
        </div>

        <div>
          <SectionHeader title="Quick actions" />
          <div className="grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              if (action.label === 'Book appointment') {
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => setPendingBooking({})}
                    className="flex items-center gap-3 rounded-xl border border-ink-200/80 bg-white p-3.5 text-left transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-ink-200/80 bg-white text-accent-600">
                      <Icon className="size-4" aria-hidden="true" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-ink-900">{action.label}</span>
                      <span className="block truncate text-xs text-ink-500">{action.description}</span>
                    </span>
                  </button>
                )
              }
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

      <div className="grid gap-5 lg:grid-cols-3">
        <ChartCard title="Weekly trend" subtitle="Appointments booked per day, this week">
          <BarChart data={weeklyTrend} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Busiest staff" subtitle="Appointments handled, this month">
          <BarChart data={busiestStaff} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Most-booked services" subtitle="Bookings by service, this month">
          <BarChart data={mostBookedServices} formatValue={formatNumber} />
        </ChartCard>
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
