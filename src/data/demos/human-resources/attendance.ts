import { employees } from './employees'
import type { AttendanceRecord, AttendanceStatus } from './types'

/** Dates with recorded attendance in this demo, most recent last. */
export const attendanceDates = ['2026-09-14', '2026-09-15', '2026-09-16']

function statusFor(employeeIndex: number, dateIndex: number, employeeStatus: string): AttendanceStatus {
  if (employeeStatus === 'On Leave') return 'On Leave'
  if (employeeStatus === 'Inactive') return 'Absent'

  const seed = (employeeIndex * 3 + dateIndex * 5) % 11
  if (seed === 9) return 'Absent'
  if (seed === 5 || seed === 7) return 'Late'
  return 'Present'
}

function checkInFor(status: AttendanceStatus, employeeIndex: number): string | null {
  if (status === 'Absent' || status === 'On Leave') return null
  const minute = (employeeIndex * 7) % 30
  const hour = status === 'Late' ? 9 : 8
  const displayMinute = status === 'Late' ? 5 + minute : 45 + (minute % 15)
  return `${hour}:${String(displayMinute % 60).padStart(2, '0')} AM`
}

function checkOutFor(status: AttendanceStatus, employeeIndex: number): string | null {
  if (status === 'Absent' || status === 'On Leave') return null
  const minute = (employeeIndex * 11) % 40
  return `5:${String(15 + (minute % 40)).padStart(2, '0')} PM`
}

/**
 * Attendance log across a short window of demo dates, generated from the
 * shared employee directory so names stay consistent across pages.
 */
export const attendanceRecords: AttendanceRecord[] = attendanceDates.flatMap((date, dateIndex) =>
  employees.map((employee, employeeIndex) => {
    const status = statusFor(employeeIndex, dateIndex, employee.status)

    return {
      id: `ATT-${dateIndex}-${employee.id}`,
      employeeName: employee.name,
      department: employee.department,
      date,
      checkIn: checkInFor(status, employeeIndex),
      checkOut: checkOutFor(status, employeeIndex),
      status,
    }
  }),
)
