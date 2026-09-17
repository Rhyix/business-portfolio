import { useState } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatDate } from '../../../lib/format'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { formatTimeRange } from '../../../data/demos/appointments/types'
import { RescheduleModal } from './RescheduleModal'

interface AppointmentDetailModalProps {
  appointmentId: string | null
  onClose: () => void
}

const ACTIVE_STATUSES = new Set(['Pending', 'Confirmed', 'Rescheduled'])

/** Shared appointment detail dialog: view details and act on status (confirm, reschedule, complete, no-show, cancel). */
export function AppointmentDetailModal({ appointmentId, onClose }: AppointmentDetailModalProps) {
  const { appointments, confirmAppointment, markCompleted, markNoShow, cancelAppointment } = useAppointmentsData()
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false)

  const appointment = appointmentId ? (appointments.find((item) => item.id === appointmentId) ?? null) : null
  const isActive = appointment ? ACTIVE_STATUSES.has(appointment.status) : false

  const handleCancel = () => {
    if (!appointment) return
    cancelAppointment(appointment.id)
    setCancelConfirmOpen(false)
    onClose()
  }

  return (
    <>
      <Modal
        open={appointment !== null}
        onClose={onClose}
        title={appointment ? `${appointment.serviceName}` : 'Appointment'}
        description={appointment ? `${appointment.id} · ${appointment.customerName}` : undefined}
        className="max-w-lg"
      >
        {appointment ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <StatusBadge status={appointment.status} />
              <span className="text-sm font-medium text-ink-900">{formatCurrency(appointment.price)}</span>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Customer</dt>
                <dd className="mt-0.5 text-ink-900">{appointment.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Staff</dt>
                <dd className="mt-0.5 text-ink-900">{appointment.staffName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Date</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(appointment.date)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Time</dt>
                <dd className="mt-0.5 text-ink-900">{formatTimeRange(appointment.time, appointment.durationMinutes)}</dd>
              </div>
            </dl>

            {appointment.notes ? <p className="rounded-lg bg-ink-50/60 p-3 text-sm text-ink-600">{appointment.notes}</p> : null}

            {isActive ? (
              <div className="flex flex-wrap justify-end gap-2 border-t border-ink-200/80 pt-4">
                {appointment.status === 'Pending' ? (
                  <Button type="button" variant="secondary" size="md" onClick={() => confirmAppointment(appointment.id)}>
                    Confirm
                  </Button>
                ) : null}
                {appointment.status === 'Confirmed' || appointment.status === 'Rescheduled' ? (
                  <>
                    <Button type="button" variant="secondary" size="md" onClick={() => markNoShow(appointment.id)}>
                      Mark no-show
                    </Button>
                    <Button type="button" variant="secondary" size="md" onClick={() => markCompleted(appointment.id)}>
                      Mark completed
                    </Button>
                  </>
                ) : null}
                <Button type="button" variant="secondary" size="md" onClick={() => setRescheduleOpen(true)}>
                  Reschedule
                </Button>
                <button
                  type="button"
                  onClick={() => setCancelConfirmOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-red-200 px-5 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
                >
                  Cancel appointment
                </button>
              </div>
            ) : (
              <p className="border-t border-ink-200/80 pt-4 text-xs text-ink-500">This appointment is {appointment.status.toLowerCase()} and can no longer be changed.</p>
            )}
          </div>
        ) : null}
      </Modal>

      <RescheduleModal open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} appointment={appointment} />

      <Modal
        open={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        title="Cancel this appointment?"
        description={appointment ? `${appointment.customerName}’s ${appointment.serviceName} on ${formatDate(appointment.date)} will be cancelled.` : undefined}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setCancelConfirmOpen(false)}>
            Keep appointment
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Cancel appointment
          </button>
        </div>
      </Modal>
    </>
  )
}
