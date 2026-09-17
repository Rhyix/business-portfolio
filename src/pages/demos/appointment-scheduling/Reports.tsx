import { useMemo } from 'react'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatNumber } from '../../../lib/format'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { addDaysISO, getDayOfWeek, todayISO } from '../../../data/demos/appointments/types'
import type { AppointmentStatus } from '../../../data/demos/appointments/types'

const statusOrder: AppointmentStatus[] = ['Pending', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled', 'No Show']
const statusTone: Record<AppointmentStatus, string> = {
  Pending: 'bg-amber-500',
  Confirmed: 'bg-accent-500',
  Completed: 'bg-emerald-500',
  Rescheduled: 'bg-amber-400',
  Cancelled: 'bg-red-400',
  'No Show': 'bg-red-600',
}

const outcomeOrder: AppointmentStatus[] = ['Completed', 'Cancelled', 'No Show']
const outcomeTone: Record<string, string> = { Completed: 'bg-emerald-500', Cancelled: 'bg-red-400', 'No Show': 'bg-red-600' }

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

/** Reports: appointments by status/service/staff, busiest days, an upcoming-week trend, and a completion/cancellation breakdown. */
export function Reports() {
  const { appointments } = useAppointmentsData()

  const byStatus = useMemo(() => {
    const total = appointments.length || 1
    return statusOrder.map((status) => {
      const count = appointments.filter((appointment) => appointment.status === status).length
      return { label: status, count, percent: Math.round((count / total) * 100), tone: statusTone[status] }
    })
  }, [appointments])

  const byService = useMemo(() => {
    const counts = new Map<string, number>()
    for (const appointment of appointments) counts.set(appointment.serviceName, (counts.get(appointment.serviceName) ?? 0) + 1)
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [appointments])

  const byStaff = useMemo(() => {
    const counts = new Map<string, number>()
    for (const appointment of appointments) counts.set(appointment.staffName, (counts.get(appointment.staffName) ?? 0) + 1)
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [appointments])

  const busiestDays = useMemo(() => {
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts = new Array(7).fill(0)
    for (const appointment of appointments) counts[getDayOfWeek(appointment.date)] += 1
    const mondayFirst = [1, 2, 3, 4, 5, 6, 0]
    return mondayFirst.map((day) => ({ label: dayLabels[day], value: counts[day] }))
  }, [appointments])

  const upcomingWeekTrend = useMemo(() => {
    const today = todayISO()
    return Array.from({ length: 7 }, (_, i) => {
      const dateISO = addDaysISO(today, i)
      const label = new Intl.DateTimeFormat('en-PH', { weekday: 'short' }).format(new Date(`${dateISO}T00:00:00`))
      const value = appointments.filter((appointment) => appointment.date === dateISO && appointment.status !== 'Cancelled').length
      return { label, value }
    })
  }, [appointments])

  const completionBreakdown = useMemo(() => {
    const concluded = appointments.filter((appointment) => outcomeOrder.includes(appointment.status))
    const total = concluded.length || 1
    return outcomeOrder.map((status) => {
      const count = concluded.filter((appointment) => appointment.status === status).length
      return { label: status, count, percent: Math.round((count / total) * 100), tone: outcomeTone[status] }
    })
  }, [appointments])

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Appointments by status" subtitle="Share of all appointments at each status">
          <ProgressBreakdown rows={byStatus} />
        </ChartCard>
        <ChartCard title="Completion & cancellation" subtitle="Outcome share of concluded appointments">
          <ProgressBreakdown rows={completionBreakdown} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Appointments by service" subtitle="Most-booked services">
          <BarChart data={byService} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Appointments by staff" subtitle="Bookings handled per staff member">
          <BarChart data={byStaff} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Busiest days" subtitle="Appointment volume by day of week">
          <BarChart data={busiestDays} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Upcoming week trend" subtitle="Active appointments booked per day, next 7 days">
          <BarChart data={upcomingWeekTrend} formatValue={formatNumber} />
        </ChartCard>
      </div>
    </div>
  )
}
