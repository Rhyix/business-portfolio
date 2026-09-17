import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import { formatDate } from '../../../lib/format'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { addDaysISO, getAvailableSlots, todayISO } from '../../../data/demos/appointments/types'
import type { Appointment } from '../../../data/demos/appointments/types'

const SLOT_INTERVAL_MINUTES = 30

interface RescheduleModalProps {
  open: boolean
  onClose: () => void
  appointment: Appointment | null
}

/** Moves an appointment to a new date/time, re-checking availability for the same staff member and service duration. */
export function RescheduleModal({ open, onClose, appointment }: RescheduleModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Reschedule appointment" description={appointment ? `${appointment.customerName} · ${appointment.serviceName}` : undefined}>
      {open && appointment ? <RescheduleForm appointment={appointment} onClose={onClose} /> : null}
    </Modal>
  )
}

function RescheduleForm({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const { availability, appointments, rescheduleAppointment } = useAppointmentsData()
  const [dateISO, setDateISO] = useState(appointment.date)
  const [time, setTime] = useState<string | null>(null)
  const [slotTakenError, setSlotTakenError] = useState(false)

  const dateChips = useMemo(() => Array.from({ length: 14 }, (_, i) => addDaysISO(todayISO(), i)), [])

  const availableSlots = useMemo(
    () =>
      getAvailableSlots({
        staffId: appointment.staffId,
        dateISO,
        serviceDurationMinutes: appointment.durationMinutes,
        slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
        availability,
        appointments,
        excludeAppointmentId: appointment.id,
      }),
    [appointment, dateISO, availability, appointments],
  )

  const handleDateChange = (value: string) => {
    setDateISO(value)
    setTime(null)
    setSlotTakenError(false)
  }

  const handleConfirm = () => {
    if (!time) return
    const freshSlots = getAvailableSlots({
      staffId: appointment.staffId,
      dateISO,
      serviceDurationMinutes: appointment.durationMinutes,
      slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
      availability,
      appointments,
      excludeAppointmentId: appointment.id,
    })
    if (!freshSlots.includes(time)) {
      setSlotTakenError(true)
      return
    }
    rescheduleAppointment(appointment.id, dateISO, time)
    onClose()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {dateChips.map((chip) => {
          const isSelected = chip === dateISO
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleDateChange(chip)}
              className={cn(
                'rounded-full border px-3.5 py-2 text-xs font-medium transition-colors duration-200',
                isSelected ? 'border-accent-400 bg-accent-600 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-accent-200',
              )}
            >
              {formatDate(chip)}
            </button>
          )
        })}
      </div>

      <FormField id="reschedule-date-custom" label="Or pick another date">
        <input
          id="reschedule-date-custom"
          type="date"
          min={todayISO()}
          value={dateISO}
          onChange={(event) => handleDateChange(event.target.value)}
          className={demoControlStyles}
        />
      </FormField>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">Available times on {formatDate(dateISO)}</p>
        {slotTakenError ? (
          <p className="mb-3 flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />
            That time was just booked by someone else. Please choose another time.
          </p>
        ) : null}
        {availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availableSlots.map((slot) => {
              const isSelected = slot === time
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setTime(slot)
                    setSlotTakenError(false)
                  }}
                  className={cn(
                    'rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors duration-200',
                    isSelected ? 'border-accent-400 bg-accent-600 text-white' : 'border-ink-200 bg-white text-ink-700 hover:border-accent-200',
                  )}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-ink-500">No available slots on this date. Try a different date.</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" size="md" onClick={handleConfirm} disabled={!time}>
          Confirm new time
        </Button>
      </div>
    </div>
  )
}
