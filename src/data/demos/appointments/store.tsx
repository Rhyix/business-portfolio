import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AppointmentsDataContext } from './context'
import { formatDate } from '../../../lib/format'
import { initialCustomers } from './customers'
import { initialServices } from './services'
import { initialStaff } from './staff'
import { initialAvailability } from './availability'
import { initialAppointments } from './appointments'
import { initialReminders } from './reminders'
import { initialActivity } from './activity'
import type {
  Appointment,
  AppointmentActivityType,
  BookingInput,
  Customer,
  CustomerInput,
  DayWorkingHours,
  PendingBooking,
  Reminder,
  Service,
  ServiceInput,
  Staff,
  StaffAvailability,
  StaffInput,
} from './types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Shared in-memory demo store for the Appointment & Scheduling System. A
 * lightweight custom store (useState + plain updater functions), scoped
 * entirely to this demo — no cross-demo integration yet (see Stage 14 plan).
 */
export function AppointmentsDataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [services, setServices] = useState<Service[]>(initialServices)
  const [staff, setStaff] = useState<Staff[]>(initialStaff)
  const [availability, setAvailability] = useState<StaffAvailability[]>(initialAvailability)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)
  const [activity, setActivity] = useState(initialActivity)
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null)

  const nextCustomerId = useRef(2011)
  const nextServiceId = useRef(309)
  const nextStaffId = useRef(107)
  const nextAppointmentId = useRef(5023)
  const nextActivityId = useRef(8)

  const logActivity = useCallback((type: AppointmentActivityType, message: string) => {
    setActivity((current) => [{ id: `aact-${nextActivityId.current++}`, type, message, timestamp: today() }, ...current].slice(0, 25))
  }, [])

  const addCustomer = useCallback(
    (values: CustomerInput) => {
      const newCustomer: Customer = { id: `CUST-${nextCustomerId.current++}`, ...values, createdDate: today() }
      setCustomers((current) => [newCustomer, ...current])
      logActivity('customer.added', `${newCustomer.name} was added as a new customer.`)
    },
    [logActivity],
  )

  const updateCustomer = useCallback((id: string, values: CustomerInput) => {
    setCustomers((current) => current.map((customer) => (customer.id === id ? { ...customer, ...values } : customer)))
  }, [])

  const deactivateCustomer = useCallback((id: string) => {
    setCustomers((current) => current.map((customer) => (customer.id === id ? { ...customer, status: 'Inactive' } : customer)))
  }, [])

  const addService = useCallback((values: ServiceInput) => {
    const newService: Service = { id: `SVC-${nextServiceId.current++}`, ...values }
    setServices((current) => [newService, ...current])
  }, [])

  const updateService = useCallback((id: string, values: ServiceInput) => {
    setServices((current) => current.map((service) => (service.id === id ? { ...service, ...values } : service)))
  }, [])

  const deactivateService = useCallback((id: string) => {
    setServices((current) => current.map((service) => (service.id === id ? { ...service, status: 'Inactive' } : service)))
  }, [])

  const addStaff = useCallback((values: StaffInput) => {
    const newStaff: Staff = { id: `STF-${nextStaffId.current++}`, ...values }
    const defaultWeeklyHours: DayWorkingHours[] = [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) =>
      dayOfWeek === 0 || dayOfWeek === 6
        ? { dayOfWeek, isUnavailable: true, start: '09:00', end: '17:00' }
        : { dayOfWeek, isUnavailable: false, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    )

    setStaff((current) => [newStaff, ...current])
    setAvailability((current) => [...current, { staffId: newStaff.id, weeklyHours: defaultWeeklyHours, unavailableDates: [] }])
  }, [])

  const updateStaff = useCallback((id: string, values: StaffInput) => {
    setStaff((current) => current.map((member) => (member.id === id ? { ...member, ...values } : member)))
  }, [])

  const deactivateStaff = useCallback((id: string) => {
    setStaff((current) => current.map((member) => (member.id === id ? { ...member, status: 'Inactive' } : member)))
  }, [])

  const updateAvailability = useCallback(
    (staffId: string, weeklyHours: DayWorkingHours[], unavailableDates: string[]) => {
      const staffMember = staff.find((member) => member.id === staffId)
      if (!staffMember) return
      setAvailability((current) => current.map((entry) => (entry.staffId === staffId ? { ...entry, weeklyHours, unavailableDates } : entry)))
      logActivity('staff.schedule_updated', `${staffMember.name}’s working schedule was updated.`)
    },
    [staff, logActivity],
  )

  const confirmBooking = useCallback(
    (input: BookingInput) => {
      const customer = customers.find((item) => item.id === input.customerId)
      const service = services.find((item) => item.id === input.serviceId)
      const staffMember = staff.find((item) => item.id === input.staffId)
      if (!customer || !service || !staffMember) return

      const newAppointment: Appointment = {
        id: `APT-${nextAppointmentId.current++}`,
        customerId: customer.id,
        customerName: customer.name,
        serviceId: service.id,
        serviceName: service.name,
        staffId: staffMember.id,
        staffName: staffMember.name,
        date: input.dateISO,
        time: input.time,
        durationMinutes: service.durationMinutes,
        price: service.price,
        status: 'Pending',
        createdDate: today(),
      }

      setAppointments((current) => [newAppointment, ...current])
      logActivity(
        'appointment.booked',
        `${customer.name} booked ${service.name} with ${staffMember.name} on ${formatDate(input.dateISO)} at ${input.time}.`,
      )
    },
    [customers, services, staff, logActivity],
  )

  const confirmAppointment = useCallback(
    (id: string) => {
      const appointment = appointments.find((item) => item.id === id)
      if (!appointment) return
      setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status: 'Confirmed' } : item)))
      logActivity('appointment.confirmed', `Confirmed ${appointment.customerName}’s ${appointment.serviceName} with ${appointment.staffName}.`)
    },
    [appointments, logActivity],
  )

  const markCompleted = useCallback(
    (id: string) => {
      const appointment = appointments.find((item) => item.id === id)
      if (!appointment) return
      setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status: 'Completed' } : item)))
      logActivity('appointment.completed', `Marked ${appointment.customerName}’s ${appointment.serviceName} as completed.`)
    },
    [appointments, logActivity],
  )

  const markNoShow = useCallback(
    (id: string) => {
      const appointment = appointments.find((item) => item.id === id)
      if (!appointment) return
      setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status: 'No Show' } : item)))
      logActivity('appointment.no_show', `${appointment.customerName} was marked as a no-show for ${appointment.serviceName}.`)
    },
    [appointments, logActivity],
  )

  const cancelAppointment = useCallback(
    (id: string) => {
      const appointment = appointments.find((item) => item.id === id)
      if (!appointment) return
      setAppointments((current) => current.map((item) => (item.id === id ? { ...item, status: 'Cancelled' } : item)))
      logActivity('appointment.cancelled', `${appointment.customerName}’s ${appointment.serviceName} appointment was cancelled.`)
    },
    [appointments, logActivity],
  )

  const rescheduleAppointment = useCallback(
    (id: string, dateISO: string, time: string) => {
      const appointment = appointments.find((item) => item.id === id)
      if (!appointment) return
      setAppointments((current) => current.map((item) => (item.id === id ? { ...item, date: dateISO, time, status: 'Rescheduled' } : item)))
      logActivity('appointment.rescheduled', `${appointment.customerName}’s ${appointment.serviceName} was rescheduled to ${formatDate(dateISO)} at ${time}.`)
    },
    [appointments, logActivity],
  )

  const markReminderSent = useCallback((id: string) => {
    setReminders((current) => current.map((reminder) => (reminder.id === id ? { ...reminder, status: 'Sent' } : reminder)))
  }, [])

  const value = {
    customers,
    services,
    staff,
    availability,
    appointments,
    reminders,
    activity,
    addCustomer,
    updateCustomer,
    deactivateCustomer,
    addService,
    updateService,
    deactivateService,
    addStaff,
    updateStaff,
    deactivateStaff,
    updateAvailability,
    confirmBooking,
    confirmAppointment,
    markCompleted,
    markNoShow,
    cancelAppointment,
    rescheduleAppointment,
    markReminderSent,
    pendingBooking,
    setPendingBooking,
  }

  return <AppointmentsDataContext.Provider value={value}>{children}</AppointmentsDataContext.Provider>
}
