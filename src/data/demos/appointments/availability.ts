import { addDaysISO, todayISO } from './types'
import type { DayWorkingHours, StaffAvailability } from './types'

function hours(dayOfWeek: number, start: string, end: string, breakStart?: string, breakEnd?: string): DayWorkingHours {
  return { dayOfWeek, isUnavailable: false, start, end, breakStart, breakEnd }
}

function unavailable(dayOfWeek: number): DayWorkingHours {
  return { dayOfWeek, isUnavailable: true, start: '09:00', end: '17:00' }
}

/** A short block of unavailable dates a few days out, illustrating Paolo Mercado's "On Leave" status. */
const paoloLeaveDates = [3, 4, 5, 6, 7].map((offset) => addDaysISO(todayISO(), offset))

export const initialAvailability: StaffAvailability[] = [
  {
    staffId: 'STF-101',
    weeklyHours: [
      unavailable(0),
      hours(1, '09:00', '17:00', '12:00', '13:00'),
      hours(2, '09:00', '17:00', '12:00', '13:00'),
      hours(3, '09:00', '17:00', '12:00', '13:00'),
      hours(4, '09:00', '17:00', '12:00', '13:00'),
      hours(5, '09:00', '17:00', '12:00', '13:00'),
      unavailable(6),
    ],
    unavailableDates: [addDaysISO(todayISO(), 12)],
  },
  {
    staffId: 'STF-102',
    weeklyHours: [
      unavailable(0),
      hours(1, '08:00', '16:00', '12:00', '12:30'),
      hours(2, '08:00', '16:00', '12:00', '12:30'),
      unavailable(3),
      hours(4, '08:00', '16:00', '12:00', '12:30'),
      hours(5, '08:00', '16:00', '12:00', '12:30'),
      unavailable(6),
    ],
    unavailableDates: [],
  },
  {
    staffId: 'STF-103',
    weeklyHours: [
      unavailable(0),
      hours(1, '09:00', '13:00'),
      unavailable(2),
      hours(3, '09:00', '13:00'),
      unavailable(4),
      hours(5, '09:00', '13:00'),
      unavailable(6),
    ],
    unavailableDates: [],
  },
  {
    staffId: 'STF-104',
    weeklyHours: [
      unavailable(0),
      hours(1, '09:00', '17:00', '12:00', '13:00'),
      hours(2, '09:00', '17:00', '12:00', '13:00'),
      hours(3, '09:00', '17:00', '12:00', '13:00'),
      hours(4, '09:00', '17:00', '12:00', '13:00'),
      hours(5, '09:00', '17:00', '12:00', '13:00'),
      hours(6, '09:00', '13:00'),
    ],
    unavailableDates: paoloLeaveDates,
  },
  {
    staffId: 'STF-105',
    weeklyHours: [
      unavailable(0),
      unavailable(1),
      hours(2, '10:00', '18:00', '13:00', '14:00'),
      hours(3, '10:00', '18:00', '13:00', '14:00'),
      hours(4, '10:00', '18:00', '13:00', '14:00'),
      unavailable(5),
      unavailable(6),
    ],
    unavailableDates: [],
  },
  {
    staffId: 'STF-106',
    weeklyHours: [
      unavailable(0),
      hours(1, '08:00', '16:00'),
      hours(2, '08:00', '16:00'),
      hours(3, '08:00', '16:00'),
      hours(4, '08:00', '16:00'),
      hours(5, '08:00', '16:00'),
      unavailable(6),
    ],
    unavailableDates: [],
  },
]
