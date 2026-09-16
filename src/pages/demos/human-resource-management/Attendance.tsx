import { useId, useMemo, useState } from 'react'
import { CalendarCheck, CalendarX, Clock, UserX } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { StatCard } from '../../../components/demo/StatCard'
import { formatDate } from '../../../lib/format'
import { attendanceDates, attendanceRecords } from '../../../data/demos/human-resources/attendance'
import type { AttendanceRecord, AttendanceStatus } from '../../../data/demos/human-resources/types'

const STATUS_OPTIONS: AttendanceStatus[] = ['Present', 'Late', 'Absent', 'On Leave']

const columns: DataTableColumn<AttendanceRecord>[] = [
  { key: 'employee', header: 'Employee', render: (record) => <span className="font-medium text-ink-900">{record.employeeName}</span> },
  { key: 'department', header: 'Department', render: (record) => record.department },
  { key: 'date', header: 'Date', render: (record) => formatDate(record.date) },
  { key: 'checkIn', header: 'Check In', render: (record) => record.checkIn ?? '—' },
  { key: 'checkOut', header: 'Check Out', render: (record) => record.checkOut ?? '—' },
  { key: 'status', header: 'Status', render: (record) => <StatusBadge status={record.status} /> },
]

/** Attendance page: date selector, department/status filters and a daily summary. */
export function Attendance() {
  const latestDate = attendanceDates[attendanceDates.length - 1]
  const [selectedDate, setSelectedDate] = useState(latestDate)
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const dateSelectId = useId()

  const dayRecords = useMemo(
    () => attendanceRecords.filter((record) => record.date === selectedDate),
    [selectedDate],
  )

  const departments = useMemo(
    () => Array.from(new Set(dayRecords.map((record) => record.department))).sort(),
    [dayRecords],
  )

  const summary = useMemo(
    () =>
      dayRecords.reduce(
        (totals, record) => {
          totals[record.status] += 1
          return totals
        },
        { Present: 0, Late: 0, Absent: 0, 'On Leave': 0 } as Record<AttendanceStatus, number>,
      ),
    [dayRecords],
  )

  const filteredRecords = useMemo(() => {
    return dayRecords.filter(
      (record) =>
        (departmentFilter === 'All' || record.department === departmentFilter) &&
        (statusFilter === 'All' || record.status === statusFilter),
    )
  }, [dayRecords, departmentFilter, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xs">
          <label htmlFor={dateSelectId} className="mb-1.5 block text-xs font-medium text-ink-600">
            Date
          </label>
          <select
            id={dateSelectId}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
          >
            {attendanceDates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Present" value={String(summary.Present)} icon={CalendarCheck} />
        <StatCard label="Late" value={String(summary.Late)} icon={Clock} />
        <StatCard label="Absent" value={String(summary.Absent)} icon={UserX} />
        <StatCard label="On Leave" value={String(summary['On Leave'])} icon={CalendarX} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <FilterDropdown
          label="Department"
          value={departmentFilter}
          options={departments}
          onChange={setDepartmentFilter}
          className="sm:w-48"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
          className="sm:w-48"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filteredRecords}
        rowKey={(record) => record.id}
        emptyTitle="No attendance records found"
        emptyMessage="Try a different department or status filter."
      />
    </div>
  )
}
