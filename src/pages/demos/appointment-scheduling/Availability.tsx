import { useId, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import { cn } from '../../../lib/cn'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import type { DayWorkingHours, Staff, StaffAvailability } from '../../../data/demos/appointments/types'

const DAY_ROWS: { dayOfWeek: number; label: string }[] = [
  { dayOfWeek: 1, label: 'Monday' },
  { dayOfWeek: 2, label: 'Tuesday' },
  { dayOfWeek: 3, label: 'Wednesday' },
  { dayOfWeek: 4, label: 'Thursday' },
  { dayOfWeek: 5, label: 'Friday' },
  { dayOfWeek: 6, label: 'Saturday' },
  { dayOfWeek: 0, label: 'Sunday' },
]

function findDay(weeklyHours: DayWorkingHours[], dayOfWeek: number): DayWorkingHours {
  return weeklyHours.find((entry) => entry.dayOfWeek === dayOfWeek) ?? { dayOfWeek, isUnavailable: true, start: '09:00', end: '17:00' }
}

interface WeeklyScheduleEditorProps {
  staffMember: Staff
  initialAvailability: StaffAvailability
  onSave: (weeklyHours: DayWorkingHours[], unavailableDates: string[]) => void
}

/**
 * Local, uncontrolled-per-staff editor: remounted (via the `key` prop on the
 * parent's selected staff id) whenever the selected staff changes, so it
 * always starts from that staff's current saved schedule with no effect
 * needed to keep local state in sync.
 */
function WeeklyScheduleEditor({ staffMember, initialAvailability, onSave }: WeeklyScheduleEditorProps) {
  const [weeklyHours, setWeeklyHours] = useState<DayWorkingHours[]>(initialAvailability.weeklyHours)
  const [unavailableDates, setUnavailableDates] = useState<string[]>(initialAvailability.unavailableDates)
  const [newDate, setNewDate] = useState('')
  const [savedNotice, setSavedNotice] = useState(false)
  const newDateId = useId()

  const updateDay = (dayOfWeek: number, patch: Partial<DayWorkingHours>) => {
    setWeeklyHours((current) => {
      const existing = current.some((entry) => entry.dayOfWeek === dayOfWeek)
      if (!existing) return [...current, { ...findDay(current, dayOfWeek), ...patch }]
      return current.map((entry) => (entry.dayOfWeek === dayOfWeek ? { ...entry, ...patch } : entry))
    })
    setSavedNotice(false)
  }

  const addUnavailableDate = () => {
    if (!newDate || unavailableDates.includes(newDate)) return
    setUnavailableDates((current) => [...current, newDate].sort())
    setNewDate('')
    setSavedNotice(false)
  }

  const removeUnavailableDate = (date: string) => {
    setUnavailableDates((current) => current.filter((entry) => entry !== date))
    setSavedNotice(false)
  }

  const handleSave = () => {
    onSave(weeklyHours, unavailableDates)
    setSavedNotice(true)
    window.setTimeout(() => setSavedNotice(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-ink-800">Weekly schedule</p>
        <div className="space-y-2">
          {DAY_ROWS.map((row) => {
            const day = findDay(weeklyHours, row.dayOfWeek)
            return (
              <div
                key={row.dayOfWeek}
                className="flex flex-col gap-3 rounded-xl border border-ink-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center justify-between gap-3 sm:w-40 sm:shrink-0">
                  <span className="text-sm font-medium text-ink-900">{row.label}</span>
                  <label className="flex items-center gap-2 text-xs text-ink-500">
                    <input
                      type="checkbox"
                      checked={day.isUnavailable}
                      onChange={(event) => updateDay(row.dayOfWeek, { isUnavailable: event.target.checked })}
                      className="size-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-100"
                    />
                    Unavailable
                  </label>
                </div>

                {!day.isUnavailable ? (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-ink-700">
                    <label className="sr-only" htmlFor={`${row.label}-start`}>
                      {row.label} start time
                    </label>
                    <input
                      id={`${row.label}-start`}
                      type="time"
                      value={day.start}
                      onChange={(event) => updateDay(row.dayOfWeek, { start: event.target.value })}
                      className={cn(demoControlStyles, 'h-10 w-32')}
                    />
                    <span className="text-ink-400">–</span>
                    <label className="sr-only" htmlFor={`${row.label}-end`}>
                      {row.label} end time
                    </label>
                    <input
                      id={`${row.label}-end`}
                      type="time"
                      value={day.end}
                      onChange={(event) => updateDay(row.dayOfWeek, { end: event.target.value })}
                      className={cn(demoControlStyles, 'h-10 w-32')}
                    />
                    <span className="ml-2 text-xs text-ink-500">Break</span>
                    <label className="sr-only" htmlFor={`${row.label}-break-start`}>
                      {row.label} break start
                    </label>
                    <input
                      id={`${row.label}-break-start`}
                      type="time"
                      value={day.breakStart ?? ''}
                      onChange={(event) => updateDay(row.dayOfWeek, { breakStart: event.target.value || undefined })}
                      className={cn(demoControlStyles, 'h-10 w-28')}
                    />
                    <span className="text-ink-400">–</span>
                    <label className="sr-only" htmlFor={`${row.label}-break-end`}>
                      {row.label} break end
                    </label>
                    <input
                      id={`${row.label}-break-end`}
                      type="time"
                      value={day.breakEnd ?? ''}
                      onChange={(event) => updateDay(row.dayOfWeek, { breakEnd: event.target.value || undefined })}
                      className={cn(demoControlStyles, 'h-10 w-28')}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-ink-400">Not working this day</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-ink-800">Unavailable dates</p>
        <p className="text-xs text-ink-500">Specific dates {staffMember.name} is unavailable, e.g. holidays or approved leave.</p>

        {unavailableDates.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {unavailableDates.map((date) => (
              <li key={date} className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50/60 py-1.5 pr-1.5 pl-3 text-xs text-ink-700">
                {formatDate(date)}
                <button
                  type="button"
                  onClick={() => removeUnavailableDate(date)}
                  aria-label={`Remove ${formatDate(date)} from unavailable dates`}
                  className="inline-flex size-6 items-center justify-center rounded-full text-ink-400 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-700"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-500">No unavailable dates on file.</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={newDateId} className="sr-only">
            Add unavailable date
          </label>
          <input id={newDateId} type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} className={cn(demoControlStyles, 'h-10 w-48')} />
          <Button type="button" variant="secondary" size="md" onClick={addUnavailableDate} disabled={!newDate}>
            <Plus className="size-4" aria-hidden="true" />
            Add date
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-ink-200/80 pt-4">
        {savedNotice ? (
          <span role="status" className="text-xs font-medium text-emerald-600">
            Saved (demo only)
          </span>
        ) : null}
        <Button type="button" size="md" onClick={handleSave}>
          Save schedule
        </Button>
      </div>
    </div>
  )
}

/** Availability: a clean weekly-schedule editor per staff member, plus specific unavailable dates. Not a recurring-calendar editor. */
export function Availability() {
  const { staff, availability, updateAvailability } = useAppointmentsData()
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id ?? '')
  const staffSelectId = useId()

  const selectedStaffMember = staff.find((member) => member.id === selectedStaffId)
  const selectedAvailability = availability.find((entry) => entry.staffId === selectedStaffId)

  return (
    <div className="max-w-3xl space-y-6">
      <DemoNotice variant="inline" />

      <FormField id={staffSelectId} label="Staff member">
        <select id={staffSelectId} value={selectedStaffId} onChange={(event) => setSelectedStaffId(event.target.value)} className={demoControlStyles}>
          {staff.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} — {member.role}
            </option>
          ))}
        </select>
      </FormField>

      {selectedStaffMember && selectedAvailability ? (
        <WeeklyScheduleEditor
          key={selectedStaffId}
          staffMember={selectedStaffMember}
          initialAvailability={selectedAvailability}
          onSave={(weeklyHours, unavailableDates) => updateAvailability(selectedStaffId, weeklyHours, unavailableDates)}
        />
      ) : (
        <p className="text-sm text-ink-500">No staff members yet.</p>
      )}
    </div>
  )
}
