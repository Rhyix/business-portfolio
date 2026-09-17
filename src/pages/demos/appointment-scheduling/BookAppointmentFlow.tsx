import { useMemo, useState } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { AlertTriangle, Check } from 'lucide-react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import { formatCurrency, formatDate } from '../../../lib/format'
import { EASE_OUT_EXPO } from '../../../lib/motion'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { addDaysISO, formatTimeRange, getAvailableSlots, todayISO } from '../../../data/demos/appointments/types'
import type { PendingBooking } from '../../../data/demos/appointments/types'

const SLOT_INTERVAL_MINUTES = 30

type BookingStep = 'customer' | 'service' | 'staff' | 'date' | 'time' | 'confirm'

const STEP_ORDER: { key: BookingStep; label: string }[] = [
  { key: 'customer', label: 'Customer' },
  { key: 'service', label: 'Service' },
  { key: 'staff', label: 'Staff' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'confirm', label: 'Confirm' },
]

function initialStepFor(prefill: PendingBooking): BookingStep {
  if (!prefill.customerId) return 'customer'
  if (!prefill.serviceId) return 'service'
  if (!prefill.staffId) return 'staff'
  if (!prefill.dateISO) return 'date'
  if (!prefill.time) return 'time'
  return 'confirm'
}

interface BookingWizardProps {
  prefill: PendingBooking
  onClose: () => void
}

function BookingWizard({ prefill, onClose }: BookingWizardProps) {
  const { customers, services, staff, availability, appointments, confirmBooking } = useAppointmentsData()
  const prefersReducedMotion = useReducedMotion()

  const [step, setStep] = useState<BookingStep>(initialStepFor(prefill))
  const [customerId, setCustomerId] = useState<string | null>(prefill.customerId ?? null)
  const [serviceId, setServiceId] = useState<string | null>(prefill.serviceId ?? null)
  const [staffId, setStaffId] = useState<string | null>(prefill.staffId ?? null)
  const [dateISO, setDateISO] = useState<string | null>(prefill.dateISO ?? null)
  const [time, setTime] = useState<string | null>(prefill.time ?? null)
  const [slotTakenError, setSlotTakenError] = useState(false)

  const activeCustomers = useMemo(() => customers.filter((customer) => customer.status === 'Active'), [customers])
  const activeServices = useMemo(() => services.filter((service) => service.status === 'Active'), [services])

  const selectedCustomer = customers.find((customer) => customer.id === customerId) ?? null
  const selectedService = services.find((service) => service.id === serviceId) ?? null
  const selectedStaff = staff.find((member) => member.id === staffId) ?? null

  const eligibleStaff = useMemo(
    () => staff.filter((member) => member.status !== 'Inactive' && selectedService?.assignedStaffIds.includes(member.id)),
    [staff, selectedService],
  )

  const upcomingDateChips = useMemo(() => Array.from({ length: 14 }, (_, i) => addDaysISO(todayISO(), i)), [])

  const availableSlots = useMemo(() => {
    if (!staffId || !dateISO || !selectedService) return []
    return getAvailableSlots({
      staffId,
      dateISO,
      serviceDurationMinutes: selectedService.durationMinutes,
      slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
      availability,
      appointments,
    })
  }, [staffId, dateISO, selectedService, availability, appointments])

  const stepIndex = STEP_ORDER.findIndex((entry) => entry.key === step)

  const canAdvanceFrom: Record<BookingStep, boolean> = {
    customer: customerId !== null,
    service: serviceId !== null,
    staff: staffId !== null,
    date: dateISO !== null,
    time: time !== null,
    confirm: false,
  }

  const goToStep = (target: BookingStep) => {
    setSlotTakenError(false)
    setStep(target)
  }

  const goNext = () => {
    if (!canAdvanceFrom[step]) return
    const nextIndex = Math.min(stepIndex + 1, STEP_ORDER.length - 1)
    goToStep(STEP_ORDER[nextIndex].key)
  }

  const goBack = () => {
    const previousIndex = Math.max(stepIndex - 1, 0)
    goToStep(STEP_ORDER[previousIndex].key)
  }

  const handleSelectService = (id: string) => {
    setServiceId(id)
    setStaffId(null)
    setTime(null)
  }

  const handleSelectStaff = (id: string) => {
    setStaffId(id)
    setTime(null)
  }

  const handleSelectDate = (value: string) => {
    setDateISO(value)
    setTime(null)
  }

  const handleConfirm = () => {
    if (!customerId || !serviceId || !staffId || !dateISO || !time || !selectedService) return

    const freshSlots = getAvailableSlots({
      staffId,
      dateISO,
      serviceDurationMinutes: selectedService.durationMinutes,
      slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
      availability,
      appointments,
    })

    if (!freshSlots.includes(time)) {
      setSlotTakenError(true)
      setStep('time')
      return
    }

    confirmBooking({ customerId, serviceId, staffId, dateISO, time })
    onClose()
  }

  const fadeTransition = { duration: prefersReducedMotion ? 0.01 : 0.2, ease: EASE_OUT_EXPO }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between text-xs font-medium text-ink-500">
          <span>
            Step {stepIndex + 1} of {STEP_ORDER.length}: {STEP_ORDER[stepIndex].label}
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-ink-100">
          <div
            className="h-1.5 rounded-full bg-accent-600 transition-[width] duration-300"
            style={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }}
          />
        </div>
      </div>

      <m.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={fadeTransition}>
        {step === 'customer' ? (
          <FormField id="booking-customer" label="Select customer">
            <select
              id="booking-customer"
              value={customerId ?? ''}
              onChange={(event) => setCustomerId(event.target.value || null)}
              className={demoControlStyles}
            >
              <option value="">Choose a customer…</option>
              {activeCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} — {customer.email}
                </option>
              ))}
            </select>
          </FormField>
        ) : null}

        {step === 'service' ? (
          <div>
            <p className="mb-2 text-sm font-medium text-ink-800">Select service</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {activeServices.map((service) => {
                const isSelected = service.id === serviceId
                return (
                  <button
                    key={service.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectService(service.id)}
                    className={cn(
                      'rounded-xl border p-3.5 text-left transition-colors duration-200',
                      isSelected ? 'border-accent-400 bg-accent-50/60' : 'border-ink-200 bg-white hover:border-accent-200',
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink-900">{service.name}</span>
                      {isSelected ? <Check className="size-4 shrink-0 text-accent-600" aria-hidden="true" /> : null}
                    </span>
                    <span className="mt-1 block text-xs text-ink-500">
                      {service.durationMinutes} min · {formatCurrency(service.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        {step === 'staff' ? (
          <div>
            <p className="mb-2 text-sm font-medium text-ink-800">Select staff</p>
            {eligibleStaff.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {eligibleStaff.map((member) => {
                  const isSelected = member.id === staffId
                  return (
                    <button
                      key={member.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectStaff(member.id)}
                      className={cn(
                        'rounded-xl border p-3.5 text-left transition-colors duration-200',
                        isSelected ? 'border-accent-400 bg-accent-50/60' : 'border-ink-200 bg-white hover:border-accent-200',
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-ink-900">{member.name}</span>
                        {isSelected ? <Check className="size-4 shrink-0 text-accent-600" aria-hidden="true" /> : null}
                      </span>
                      <span className="mt-1 block text-xs text-ink-500">{member.role}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-ink-500">No staff currently offer this service.</p>
            )}
          </div>
        ) : null}

        {step === 'date' ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink-800">Select date</p>
            <div className="flex flex-wrap gap-2">
              {upcomingDateChips.map((chip) => {
                const isSelected = chip === dateISO
                return (
                  <button
                    key={chip}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectDate(chip)}
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
            <FormField id="booking-date-custom" label="Or pick another date">
              <input
                id="booking-date-custom"
                type="date"
                min={todayISO()}
                value={dateISO ?? ''}
                onChange={(event) => handleSelectDate(event.target.value)}
                className={demoControlStyles}
              />
            </FormField>
          </div>
        ) : null}

        {step === 'time' ? (
          <div>
            <p className="mb-2 text-sm font-medium text-ink-800">
              Available times {dateISO ? `on ${formatDate(dateISO)}` : ''}
            </p>
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
              <p className="text-sm text-ink-500">No available slots for this staff member on this date. Try a different date.</p>
            )}
          </div>
        ) : null}

        {step === 'confirm' ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-ink-800">Confirm appointment</p>
            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-ink-200/80 bg-ink-50/50 p-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Customer</dt>
                <dd className="mt-0.5 text-ink-900">{selectedCustomer?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Service</dt>
                <dd className="mt-0.5 text-ink-900">{selectedService?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Staff</dt>
                <dd className="mt-0.5 text-ink-900">{selectedStaff?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Date</dt>
                <dd className="mt-0.5 text-ink-900">{dateISO ? formatDate(dateISO) : '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Time</dt>
                <dd className="mt-0.5 text-ink-900">
                  {time && selectedService ? formatTimeRange(time, selectedService.durationMinutes) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Price</dt>
                <dd className="mt-0.5 text-ink-900">{selectedService ? formatCurrency(selectedService.price) : '—'}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </m.div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-200/80 pt-4">
        <Button type="button" variant="secondary" size="md" onClick={stepIndex === 0 ? onClose : goBack}>
          {stepIndex === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step === 'confirm' ? (
          <Button type="button" size="md" onClick={handleConfirm}>
            Confirm appointment
          </Button>
        ) : (
          <Button type="button" size="md" onClick={goNext} disabled={!canAdvanceFrom[step]}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Mounted once at the shell level, opened from any "Book Appointment" entry
 * point (Dashboard quick action, Appointments page, Calendar's "+" on a
 * day/slot) by setting shared `pendingBooking` context state — no useEffect
 * involved, following the established cross-page handoff pattern.
 */
export function BookAppointmentFlow() {
  const { pendingBooking, setPendingBooking } = useAppointmentsData()

  return (
    <Modal open={pendingBooking !== null} onClose={() => setPendingBooking(null)} title="Book appointment" className="max-w-2xl">
      {pendingBooking ? <BookingWizard prefill={pendingBooking} onClose={() => setPendingBooking(null)} /> : null}
    </Modal>
  )
}
