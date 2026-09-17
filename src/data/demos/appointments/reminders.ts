import { initialAppointments } from './appointments'
import { addDaysISO } from './types'
import type { Reminder, ReminderStatus, ReminderType } from './types'

function appointmentById(id: string) {
  const found = initialAppointments.find((appointment) => appointment.id === id)
  if (!found) throw new Error(`Unknown seed appointment id: ${id}`)
  return found
}

interface SeedReminder {
  id: string
  appointmentId: string
  reminderType: ReminderType
  status: ReminderStatus
}

const seeds: SeedReminder[] = [
  { id: 'REM-701', appointmentId: 'APT-5008', reminderType: 'Email', status: 'Sent' },
  { id: 'REM-702', appointmentId: 'APT-5007', reminderType: 'SMS', status: 'Cancelled' },
  { id: 'REM-703', appointmentId: 'APT-5010', reminderType: 'Email', status: 'Sent' },
  { id: 'REM-704', appointmentId: 'APT-5012', reminderType: 'SMS', status: 'Scheduled' },
  { id: 'REM-705', appointmentId: 'APT-5013', reminderType: 'In-App', status: 'Scheduled' },
  { id: 'REM-706', appointmentId: 'APT-5015', reminderType: 'Email', status: 'Scheduled' },
  { id: 'REM-707', appointmentId: 'APT-5017', reminderType: 'SMS', status: 'Scheduled' },
  { id: 'REM-708', appointmentId: 'APT-5020', reminderType: 'Email', status: 'Scheduled' },
]

export const initialReminders: Reminder[] = seeds.map((seed) => {
  const appointment = appointmentById(seed.appointmentId)
  return {
    id: seed.id,
    appointmentId: appointment.id,
    customerId: appointment.customerId,
    customerName: appointment.customerName,
    scheduledFor: addDaysISO(appointment.date, -1),
    reminderType: seed.reminderType,
    status: seed.status,
  }
})
