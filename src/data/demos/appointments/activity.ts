import { addDaysISO, todayISO } from './types'
import type { AppointmentActivityItem } from './types'

export const initialActivity: AppointmentActivityItem[] = [
  { id: 'aact-1', type: 'appointment.completed', message: 'Marked the appointment with Enrico Villanueva for Equipment Installation as completed.', timestamp: addDaysISO(todayISO(), -1) },
  { id: 'aact-2', type: 'appointment.cancelled', message: 'Patricia Gomez cancelled her Emergency Maintenance appointment with Jonathan Cruz.', timestamp: addDaysISO(todayISO(), -2) },
  { id: 'aact-3', type: 'appointment.completed', message: 'Marked the appointment with Samantha Uy for Initial Consultation as completed.', timestamp: addDaysISO(todayISO(), -2) },
  { id: 'aact-4', type: 'appointment.no_show', message: 'Bea Lozano was marked as a no-show for her Follow-up Session.', timestamp: addDaysISO(todayISO(), -3) },
  { id: 'aact-5', type: 'appointment.rescheduled', message: 'Camille Dizon’s Initial Consultation was rescheduled to a later date.', timestamp: addDaysISO(todayISO(), -1) },
  { id: 'aact-6', type: 'appointment.confirmed', message: 'Confirmed Liza Fernandez’s Initial Consultation with Maria Santos.', timestamp: addDaysISO(todayISO(), -1) },
  { id: 'aact-7', type: 'staff.schedule_updated', message: 'Paolo Mercado’s schedule was updated to reflect upcoming leave.', timestamp: addDaysISO(todayISO(), -2) },
]
