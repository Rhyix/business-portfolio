import { useMemo, useState } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { EmptyState } from '../../../components/demo/EmptyState'
import { Modal } from '../../../components/demo/Modal'
import { cn } from '../../../lib/cn'
import { formatDate } from '../../../lib/format'
import { EASE_OUT_EXPO } from '../../../lib/motion'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { addDaysISO, buildMonthGrid, getDayAppointments, getWeekDays, todayISO } from '../../../data/demos/appointments/types'
import type { Appointment } from '../../../data/demos/appointments/types'
import { AppointmentDetailModal } from './AppointmentDetailModal'

type CalendarView = 'day' | 'week' | 'month'

const VIEW_OPTIONS: { key: CalendarView; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]

function shiftMonthStart(dateISO: string, delta: number): string {
  const date = new Date(`${dateISO}T00:00:00`)
  const shifted = new Date(date.getFullYear(), date.getMonth() + delta, 1)
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, '0')}-01`
}

function AppointmentChip({ appointment, onClick }: { appointment: Appointment; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-1 rounded-lg border border-ink-200/80 bg-white px-3 py-2.5 text-left transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink-900">{appointment.time}</span>
        <StatusBadge status={appointment.status} />
      </span>
      <span className="truncate text-xs text-ink-600">
        {appointment.customerName} · {appointment.serviceName} · {appointment.staffName}
      </span>
    </button>
  )
}

function MonthAppointmentPill({ appointment, onClick }: { appointment: Appointment; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${appointment.time} ${appointment.customerName}, ${appointment.serviceName}, ${appointment.status}`}
      className="block w-full truncate rounded-md border border-ink-200/80 bg-white px-1.5 py-1 text-left text-[0.7rem] text-ink-700 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40"
    >
      <span className="font-medium text-ink-900">{appointment.time}</span> {appointment.customerName}
    </button>
  )
}

/** Calendar: the centerpiece of the demo. Day/Week/Month views built entirely from native Date math — see the Stage 14 plan for why no calendar library is needed. */
export function Calendar() {
  const { appointments, setPendingBooking } = useAppointmentsData()
  const prefersReducedMotion = useReducedMotion()

  const [view, setView] = useState<CalendarView>('day')
  const [focusDate, setFocusDate] = useState(todayISO())
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [overflowDate, setOverflowDate] = useState<string | null>(null)

  const goToday = () => setFocusDate(todayISO())

  const goPrevious = () => {
    if (view === 'day') setFocusDate((current) => addDaysISO(current, -1))
    else if (view === 'week') setFocusDate((current) => addDaysISO(current, -7))
    else setFocusDate((current) => shiftMonthStart(current, -1))
  }

  const goNext = () => {
    if (view === 'day') setFocusDate((current) => addDaysISO(current, 1))
    else if (view === 'week') setFocusDate((current) => addDaysISO(current, 7))
    else setFocusDate((current) => shiftMonthStart(current, 1))
  }

  const dateStripDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysISO(focusDate, i - 3)), [focusDate])
  const dayAppointments = useMemo(() => getDayAppointments(focusDate, appointments), [focusDate, appointments])
  const weekDays = useMemo(() => getWeekDays(focusDate), [focusDate])

  const monthDate = new Date(`${focusDate}T00:00:00`)
  const monthGrid = useMemo(
    () => buildMonthGrid(monthDate.getFullYear(), monthDate.getMonth(), appointments),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focusDate, appointments],
  )
  const monthLabel = new Intl.DateTimeFormat('en-PH', { month: 'long', year: 'numeric' }).format(monthDate)

  const overflowAppointments = overflowDate ? getDayAppointments(overflowDate, appointments) : []

  const fadeTransition = { duration: prefersReducedMotion ? 0.01 : 0.2, ease: EASE_OUT_EXPO }

  return (
    <div className="space-y-5">
      <DemoNotice variant="inline" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Calendar view" className="flex gap-1 rounded-lg border border-ink-200 bg-white p-1">
          {VIEW_OPTIONS.map((option) => {
            const isActive = option.key === view
            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setView(option.key)}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-200',
                  isActive ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 transition-colors duration-200 hover:bg-ink-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
          <Button type="button" size="sm" onClick={() => setPendingBooking({})}>
            <Plus className="size-4" aria-hidden="true" />
            Book appointment
          </Button>
        </div>
      </div>

      <m.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={fadeTransition}>
        {view === 'day' ? (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dateStripDays.map((day) => {
                const isSelected = day === focusDate
                const isToday = day === todayISO()
                const date = new Date(`${day}T00:00:00`)
                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={isSelected}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => setFocusDate(day)}
                    className={cn(
                      'flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3.5 py-2 transition-colors duration-200',
                      isSelected ? 'border-accent-400 bg-accent-600 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-accent-200',
                    )}
                  >
                    <span className="text-[0.65rem] font-medium tracking-wide uppercase opacity-80">
                      {new Intl.DateTimeFormat('en-PH', { weekday: 'short' }).format(date)}
                    </span>
                    <span className="text-sm font-semibold">{date.getDate()}</span>
                    {isToday ? <span className="text-[0.6rem] font-medium opacity-80">Today</span> : null}
                  </button>
                )
              })}
            </div>

            <h2 className="text-sm font-semibold text-ink-900">{formatDate(focusDate)}</h2>

            {dayAppointments.length > 0 ? (
              <ul className="space-y-2">
                {dayAppointments.map((appointment) => (
                  <li key={appointment.id}>
                    <AppointmentChip appointment={appointment} onClick={() => setSelectedAppointmentId(appointment.id)} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No appointments" message="Nothing scheduled for this day yet." />
            )}
          </div>
        ) : null}

        {view === 'week' ? (
          <div className="overflow-x-auto pb-1">
            <div className="grid min-w-[900px] grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const columnAppointments = getDayAppointments(day, appointments)
                const isToday = day === todayISO()
                const date = new Date(`${day}T00:00:00`)
                return (
                  <div key={day} className="space-y-2">
                    <div className={cn('rounded-lg border px-2.5 py-2 text-center', isToday ? 'border-accent-300 bg-accent-50/60' : 'border-ink-200/80 bg-white')}>
                      <p className="text-[0.65rem] font-medium tracking-wide text-ink-500 uppercase">
                        {new Intl.DateTimeFormat('en-PH', { weekday: 'short' }).format(date)}
                      </p>
                      <p className="text-sm font-semibold text-ink-900">{date.getDate()}</p>
                    </div>
                    <div className="space-y-1.5">
                      {columnAppointments.length > 0 ? (
                        columnAppointments.map((appointment) => (
                          <MonthAppointmentPill key={appointment.id} appointment={appointment} onClick={() => setSelectedAppointmentId(appointment.id)} />
                        ))
                      ) : (
                        <p className="px-1 text-[0.7rem] text-ink-400">No appointments</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        {view === 'month' ? (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-ink-900">{monthLabel}</h2>
            <div className="overflow-x-auto pb-1">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-ink-200/80 bg-ink-200/80 text-center text-[0.65rem] font-medium tracking-wide text-ink-500 uppercase">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
                    <div key={label} className="bg-ink-50/70 py-2">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-lg border border-t-0 border-ink-200/80 bg-ink-200/80">
                  {monthGrid.flat().map((cell) => {
                    const visiblePills = cell.appointments.slice(0, 2)
                    const overflowCount = cell.appointments.length - visiblePills.length
                    return (
                      <div
                        key={cell.dateISO}
                        className={cn('min-h-28 space-y-1 bg-white p-1.5', !cell.isCurrentMonth && 'bg-ink-50/40')}
                      >
                        <span
                          className={cn(
                            'inline-flex size-6 items-center justify-center rounded-full text-xs font-medium',
                            cell.isToday ? 'bg-accent-600 text-white' : cell.isCurrentMonth ? 'text-ink-900' : 'text-ink-400',
                          )}
                        >
                          {cell.dayNumber}
                        </span>
                        <div className="space-y-1">
                          {visiblePills.map((appointment) => (
                            <MonthAppointmentPill key={appointment.id} appointment={appointment} onClick={() => setSelectedAppointmentId(appointment.id)} />
                          ))}
                          {overflowCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => setOverflowDate(cell.dateISO)}
                              className="block w-full rounded-md px-1.5 py-0.5 text-left text-[0.7rem] font-medium text-accent-700 hover:underline"
                            >
                              +{overflowCount} more
                            </button>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </m.div>

      <AppointmentDetailModal appointmentId={selectedAppointmentId} onClose={() => setSelectedAppointmentId(null)} />

      <Modal
        open={overflowDate !== null}
        onClose={() => setOverflowDate(null)}
        title={overflowDate ? formatDate(overflowDate) : 'Appointments'}
        description="All appointments on this date."
      >
        <ul className="space-y-2">
          {overflowAppointments.map((appointment) => (
            <li key={appointment.id}>
              <AppointmentChip
                appointment={appointment}
                onClick={() => {
                  setSelectedAppointmentId(appointment.id)
                  setOverflowDate(null)
                }}
              />
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}
