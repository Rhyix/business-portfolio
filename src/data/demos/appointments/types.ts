/**
 * Entity shapes for the Appointment & Scheduling System demo.
 * Every record produced from these types is fictional sample data — see the
 * DemoNotice component shown throughout the demo shell.
 */

export type CustomerStatus = 'Active' | 'Inactive'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status: CustomerStatus
  createdDate: string
  notes?: string
}

/** Fields supplied by the customer add/edit form. */
export type CustomerInput = Pick<Customer, 'name' | 'email' | 'phone' | 'status' | 'notes'>

export type ServiceStatus = 'Active' | 'Inactive'

export interface Service {
  id: string
  name: string
  category: string
  durationMinutes: number
  price: number
  assignedStaffIds: string[]
  status: ServiceStatus
}

/** Fields supplied by the service add/edit form. */
export type ServiceInput = Pick<Service, 'name' | 'category' | 'durationMinutes' | 'price' | 'assignedStaffIds' | 'status'>

export type StaffStatus = 'Available' | 'On Leave' | 'Inactive'

export interface Staff {
  id: string
  name: string
  role: string
  department: string
  status: StaffStatus
}

/** Fields supplied by the staff add/edit form. */
export type StaffInput = Pick<Staff, 'name' | 'role' | 'department' | 'status'>

/** One weekday's working-hours rule. `dayOfWeek` matches JS Date#getDay (0=Sun..6=Sat). */
export interface DayWorkingHours {
  dayOfWeek: number
  isUnavailable: boolean
  start: string
  end: string
  breakStart?: string
  breakEnd?: string
}

export interface StaffAvailability {
  staffId: string
  /** One entry per day of the week, always present (even for unavailable days). */
  weeklyHours: DayWorkingHours[]
  /** Specific calendar dates this staff member is unavailable, e.g. holidays or leave. */
  unavailableDates: string[]
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show' | 'Rescheduled'

export interface Appointment {
  id: string
  customerId: string
  customerName: string
  serviceId: string
  serviceName: string
  staffId: string
  staffName: string
  date: string
  time: string
  /** Snapshot from the Service at booking time — a later Service edit must not rewrite booking history. */
  durationMinutes: number
  /** Snapshot from the Service at booking time, same reasoning as durationMinutes. */
  price: number
  status: AppointmentStatus
  notes?: string
  createdDate: string
}

/** Fields supplied when confirming a new booking (see the BookAppointmentFlow). */
export interface BookingInput {
  customerId: string
  serviceId: string
  staffId: string
  dateISO: string
  time: string
}

export type ReminderType = 'Email' | 'SMS' | 'In-App'
export type ReminderStatus = 'Scheduled' | 'Sent' | 'Cancelled'

export interface Reminder {
  id: string
  appointmentId: string
  customerId: string
  customerName: string
  scheduledFor: string
  reminderType: ReminderType
  status: ReminderStatus
}

export type AppointmentActivityType =
  | 'appointment.booked'
  | 'appointment.confirmed'
  | 'appointment.cancelled'
  | 'appointment.rescheduled'
  | 'appointment.completed'
  | 'appointment.no_show'
  | 'customer.added'
  | 'staff.schedule_updated'
  | 'reminder.sent'

export interface AppointmentActivityItem {
  id: string
  type: AppointmentActivityType
  message: string
  timestamp: string
}

/**
 * Cross-page booking handoff: set by "Book Appointment" entry points
 * (Dashboard quick action, Appointments page, Calendar's "+" on a day/slot),
 * read once by the BookAppointmentFlow to pre-fill whatever is already known.
 */
export interface PendingBooking {
  customerId?: string
  serviceId?: string
  staffId?: string
  dateISO?: string
  time?: string
}

// ---------------------------------------------------------------------------
// Time helpers — 24h "HH:mm" strings, matching the codebase's plain-ISO-string
// date convention. No AM/PM formatter: HRMS's Attendance page already
// displays raw "HH:mm" check-in/out times with no formatting, so times here
// follow the same precedent.
// ---------------------------------------------------------------------------

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function formatTimeRange(time: string, durationMinutes: number): string {
  return `${time}–${minutesToTime(timeToMinutes(time) + durationMinutes)}`
}

// ---------------------------------------------------------------------------
// Calendar date helpers. Deliberately local-date-component arithmetic (not
// toISOString, which converts to UTC and can shift a calendar cell to the
// wrong day depending on the viewer's timezone offset) — correctness here
// matters more than matching the store's simpler toISOString-based today().
// ---------------------------------------------------------------------------

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function addDaysISO(dateISO: string, days: number): string {
  const date = new Date(`${dateISO}T00:00:00`)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function getDayOfWeek(dateISO: string): number {
  return new Date(`${dateISO}T00:00:00`).getDay()
}

// ---------------------------------------------------------------------------
// Availability algorithm — the demo's key derived-not-stored workflow.
// Available slots = staff working hours MINUS the break period MINUS any
// existing (non-cancelled, non-no-show) appointment for that staff and date,
// stepped in slotIntervalMinutes increments across the requested service's
// duration. Deliberately simple: no recurring-availability engine, just one
// pass over a single day's appointments.
// ---------------------------------------------------------------------------

export function getAvailableSlots(params: {
  staffId: string
  dateISO: string
  serviceDurationMinutes: number
  slotIntervalMinutes: number
  availability: StaffAvailability[]
  appointments: Appointment[]
  /** Exclude this appointment's own slot from the busy set — used when rescheduling. */
  excludeAppointmentId?: string
}): string[] {
  const { staffId, dateISO, serviceDurationMinutes, slotIntervalMinutes, availability, appointments, excludeAppointmentId } = params

  const staffAvailability = availability.find((entry) => entry.staffId === staffId)
  if (!staffAvailability) return []
  if (staffAvailability.unavailableDates.includes(dateISO)) return []

  const dayHours = staffAvailability.weeklyHours.find((hours) => hours.dayOfWeek === getDayOfWeek(dateISO))
  if (!dayHours || dayHours.isUnavailable) return []

  const busy: [number, number][] = appointments
    .filter(
      (appointment) =>
        appointment.staffId === staffId &&
        appointment.date === dateISO &&
        appointment.status !== 'Cancelled' &&
        appointment.status !== 'No Show' &&
        appointment.id !== excludeAppointmentId,
    )
    .map((appointment): [number, number] => [timeToMinutes(appointment.time), timeToMinutes(appointment.time) + appointment.durationMinutes])

  if (dayHours.breakStart && dayHours.breakEnd) {
    busy.push([timeToMinutes(dayHours.breakStart), timeToMinutes(dayHours.breakEnd)])
  }

  const startMin = timeToMinutes(dayHours.start)
  const endMin = timeToMinutes(dayHours.end)
  const slots: string[] = []

  for (let start = startMin; start + serviceDurationMinutes <= endMin; start += slotIntervalMinutes) {
    const candidateEnd = start + serviceDurationMinutes
    const overlapsBusyPeriod = busy.some(([busyStart, busyEnd]) => start < busyEnd && candidateEnd > busyStart)
    if (!overlapsBusyPeriod) slots.push(minutesToTime(start))
  }

  return slots
}

// ---------------------------------------------------------------------------
// Other derived values — never stored, always computed from the source
// arrays, so nothing can drift out of sync with a booking/status change.
// ---------------------------------------------------------------------------

export function getCustomerAppointments(customerId: string, appointments: Appointment[]): Appointment[] {
  return appointments.filter((appointment) => appointment.customerId === customerId)
}

export function getCustomerLastVisit(customerId: string, appointments: Appointment[]): string | null {
  const completedDates = appointments
    .filter((appointment) => appointment.customerId === customerId && appointment.status === 'Completed')
    .map((appointment) => appointment.date)
    .sort()
  return completedDates.length > 0 ? completedDates[completedDates.length - 1] : null
}

export function getStaffServices(staffId: string, services: Service[]): Service[] {
  return services.filter((service) => service.assignedStaffIds.includes(staffId))
}

const WEEKDAY_LABELS_MON_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const WEEKDAY_LABELS_BY_DAY_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function summarizeWorkingDays(weeklyHours: DayWorkingHours[]): string {
  const workingLabels = new Set(
    weeklyHours.filter((hours) => !hours.isUnavailable).map((hours) => WEEKDAY_LABELS_BY_DAY_OF_WEEK[hours.dayOfWeek]),
  )
  const ordered = WEEKDAY_LABELS_MON_FIRST.filter((label) => workingLabels.has(label))
  return ordered.length > 0 ? ordered.join(', ') : 'Unavailable'
}

// ---------------------------------------------------------------------------
// Calendar view builders — pure native-Date math, no calendar library. See
// the Stage 14 plan section B/C for why native Date/Intl is sufficient here.
// ---------------------------------------------------------------------------

export interface CalendarCell {
  dateISO: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  appointments: Appointment[]
}

export function groupAppointmentsByDate(appointments: Appointment[]): Map<string, Appointment[]> {
  const byDate = new Map<string, Appointment[]>()
  for (const appointment of appointments) {
    const existing = byDate.get(appointment.date)
    if (existing) existing.push(appointment)
    else byDate.set(appointment.date, [appointment])
  }
  for (const list of byDate.values()) {
    list.sort((a, b) => a.time.localeCompare(b.time))
  }
  return byDate
}

/** Builds a Monday-start month grid, sized to the 4–6 weeks the month actually needs. */
export function buildMonthGrid(year: number, month: number, appointments: Appointment[]): CalendarCell[][] {
  const byDate = groupAppointmentsByDate(appointments)
  const todayIso = todayISO()

  const firstOfMonth = new Date(year, month, 1)
  const leadingOffset = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((leadingOffset + daysInMonth) / 7) * 7

  const cells: CalendarCell[] = []
  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(year, month, 1 - leadingOffset + i)
    const dateISO = toISODate(cellDate)
    cells.push({
      dateISO,
      dayNumber: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === month,
      isToday: dateISO === todayIso,
      appointments: byDate.get(dateISO) ?? [],
    })
  }

  const weeks: CalendarCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

/** The 7 ISO dates (Monday–Sunday) of the week containing `dateISO`. */
export function getWeekDays(dateISO: string): string[] {
  const offset = (getDayOfWeek(dateISO) + 6) % 7
  return Array.from({ length: 7 }, (_, i) => addDaysISO(dateISO, i - offset))
}

export function getDayAppointments(dateISO: string, appointments: Appointment[]): Appointment[] {
  return appointments.filter((appointment) => appointment.date === dateISO).sort((a, b) => a.time.localeCompare(b.time))
}
