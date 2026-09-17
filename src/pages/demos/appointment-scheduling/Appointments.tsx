import { useId, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Button } from '../../../components/ui/Button'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { formatDate } from '../../../lib/format'
import { cn } from '../../../lib/cn'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import type { Appointment } from '../../../data/demos/appointments/types'
import { AppointmentDetailModal } from './AppointmentDetailModal'

const PAGE_SIZE = 10
const statusOptions = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show', 'Rescheduled']

type SortKey = 'date-desc' | 'date-asc'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'date-desc', label: 'Sort: Newest first' },
  { value: 'date-asc', label: 'Sort: Soonest first' },
]

function matchesSearch(appointment: Appointment, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    appointment.customerName.toLowerCase().includes(needle) ||
    appointment.id.toLowerCase().includes(needle) ||
    appointment.serviceName.toLowerCase().includes(needle)
  )
}

/** Appointments: search, date/staff/service/status filters, sorting, pagination, and status actions via the detail modal. */
export function Appointments() {
  const { appointments, staff, services, setPendingBooking } = useAppointmentsData()

  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [staffFilter, setStaffFilter] = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('date-desc')
  const [page, setPage] = useState(1)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)

  const sortSelectId = useId()
  const dateFilterId = useId()

  const staffNames = useMemo(() => staff.map((member) => member.name), [staff])
  const serviceNames = useMemo(() => services.map((service) => service.name), [services])

  const filteredAppointments = useMemo(() => {
    const filtered = appointments.filter(
      (appointment) =>
        (!dateFilter || appointment.date === dateFilter) &&
        (staffFilter === 'All' || appointment.staffName === staffFilter) &&
        (serviceFilter === 'All' || appointment.serviceName === serviceFilter) &&
        (statusFilter === 'All' || appointment.status === statusFilter) &&
        matchesSearch(appointment, searchTerm),
    )

    const sorted = [...filtered]
    sorted.sort((a, b) => {
      const key = (item: Appointment) => `${item.date}T${item.time}`
      return sortKey === 'date-asc' ? key(a).localeCompare(key(b)) : key(b).localeCompare(key(a))
    })
    return sorted
  }, [appointments, searchTerm, dateFilter, staffFilter, serviceFilter, statusFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredAppointments.slice(pageStart, pageStart + PAGE_SIZE)

  const resetToFirstPage = () => setPage(1)

  const columns: DataTableColumn<Appointment>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (appointment) => (
        <button
          type="button"
          onClick={() => setSelectedAppointmentId(appointment.id)}
          className="block text-left font-medium text-ink-900 hover:text-accent-600"
        >
          {appointment.id}
        </button>
      ),
    },
    { key: 'customer', header: 'Customer', render: (appointment) => appointment.customerName },
    { key: 'service', header: 'Service', render: (appointment) => appointment.serviceName },
    { key: 'staff', header: 'Staff', render: (appointment) => appointment.staffName },
    { key: 'date', header: 'Date', render: (appointment) => formatDate(appointment.date) },
    { key: 'time', header: 'Time', render: (appointment) => appointment.time },
    { key: 'duration', header: 'Duration', render: (appointment) => `${appointment.durationMinutes} min` },
    { key: 'status', header: 'Status', render: (appointment) => <StatusBadge status={appointment.status} /> },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredAppointments.length} appointment{filteredAppointments.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={() => setPendingBooking({})}>
          <Plus className="size-4" aria-hidden="true" />
          Book appointment
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value)
            resetToFirstPage()
          }}
          placeholder="Search by customer, service or ID…"
          aria-label="Search appointments"
          className="lg:max-w-sm"
        />
        <div className="lg:w-44">
          <label htmlFor={dateFilterId} className="sr-only">
            Filter by date
          </label>
          <input
            id={dateFilterId}
            type="date"
            value={dateFilter}
            onChange={(event) => {
              setDateFilter(event.target.value)
              resetToFirstPage()
            }}
            className={cn(demoControlStyles, 'h-10')}
          />
        </div>
        <FilterDropdown
          label="Staff"
          value={staffFilter}
          options={staffNames}
          onChange={(value) => {
            setStaffFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-44"
        />
        <FilterDropdown
          label="Service"
          value={serviceFilter}
          options={serviceNames}
          onChange={(value) => {
            setServiceFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-48"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={(value) => {
            setStatusFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-40"
        />
        <div className="relative lg:w-48">
          <label htmlFor={sortSelectId} className="sr-only">
            Sort appointments
          </label>
          <select
            id={sortSelectId}
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="h-10 w-full appearance-none rounded-lg border border-ink-200 bg-white py-2 pr-9 pl-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(appointment) => appointment.id}
        onRowClick={(appointment) => setSelectedAppointmentId(appointment.id)}
        emptyTitle="No appointments found"
        emptyMessage="Try a different search term or filter."
      />

      {filteredAppointments.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredAppointments.length)} of {filteredAppointments.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="text-xs font-medium text-ink-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <AppointmentDetailModal appointmentId={selectedAppointmentId} onClose={() => setSelectedAppointmentId(null)} />
    </div>
  )
}
