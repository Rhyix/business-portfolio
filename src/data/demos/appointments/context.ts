import { createContext, useContext } from 'react'
import type {
  Appointment,
  AppointmentActivityItem,
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

export interface AppointmentsDataContextValue {
  customers: Customer[]
  services: Service[]
  staff: Staff[]
  availability: StaffAvailability[]
  appointments: Appointment[]
  reminders: Reminder[]
  activity: AppointmentActivityItem[]

  addCustomer: (values: CustomerInput) => void
  updateCustomer: (id: string, values: CustomerInput) => void
  deactivateCustomer: (id: string) => void

  addService: (values: ServiceInput) => void
  updateService: (id: string, values: ServiceInput) => void
  deactivateService: (id: string) => void

  addStaff: (values: StaffInput) => void
  updateStaff: (id: string, values: StaffInput) => void
  deactivateStaff: (id: string) => void

  /** Replaces a staff member's weekly working hours and unavailable dates. */
  updateAvailability: (staffId: string, weeklyHours: DayWorkingHours[], unavailableDates: string[]) => void

  /** Creates a new appointment from the booking flow, as Pending. */
  confirmBooking: (input: BookingInput) => void
  /** Pending -> Confirmed. */
  confirmAppointment: (id: string) => void
  /** Confirmed/Rescheduled -> Completed. */
  markCompleted: (id: string) => void
  /** Confirmed/Rescheduled -> No Show. */
  markNoShow: (id: string) => void
  /** Any active status -> Cancelled. */
  cancelAppointment: (id: string) => void
  /** Moves an appointment to a new date/time and marks it Rescheduled. */
  rescheduleAppointment: (id: string, dateISO: string, time: string) => void

  /** Demo-only — simulates a reminder being sent; never sends a real email/SMS. */
  markReminderSent: (id: string) => void

  /** Set by any "Book Appointment" entry point; read once by BookAppointmentFlow, which is mounted once at the shell level. */
  pendingBooking: PendingBooking | null
  setPendingBooking: (value: PendingBooking | null) => void
}

export const AppointmentsDataContext = createContext<AppointmentsDataContextValue | null>(null)

/** Reads the appointment-scheduling demo's shared store. Must be used within AppointmentsDataProvider. */
export function useAppointmentsData(): AppointmentsDataContextValue {
  const context = useContext(AppointmentsDataContext)
  if (!context) throw new Error('useAppointmentsData must be used within an AppointmentsDataProvider')
  return context
}
