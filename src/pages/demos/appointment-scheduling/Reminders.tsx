import { useMemo, useState } from 'react'
import { Send } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatDate } from '../../../lib/format'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import type { Reminder } from '../../../data/demos/appointments/types'

const typeOptions = ['Email', 'SMS', 'In-App']
const statusOptions = ['Scheduled', 'Sent', 'Cancelled']

/** Reminders: demo-only scheduled notices for upcoming appointments. "Mark as sent" simulates delivery — nothing is actually sent. */
export function Reminders() {
  const { reminders, markReminderSent } = useAppointmentsData()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredReminders = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase()
    return reminders
      .filter(
        (reminder) =>
          (typeFilter === 'All' || reminder.reminderType === typeFilter) &&
          (statusFilter === 'All' || reminder.status === statusFilter) &&
          (!needle || reminder.customerName.toLowerCase().includes(needle) || reminder.appointmentId.toLowerCase().includes(needle)),
      )
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
  }, [reminders, searchTerm, typeFilter, statusFilter])

  const columns: DataTableColumn<Reminder>[] = [
    { key: 'appointment', header: 'Appointment', render: (reminder) => <span className="font-medium text-ink-900">{reminder.appointmentId}</span> },
    { key: 'customer', header: 'Customer', render: (reminder) => reminder.customerName },
    { key: 'scheduledFor', header: 'Scheduled For', render: (reminder) => formatDate(reminder.scheduledFor) },
    { key: 'type', header: 'Reminder Type', render: (reminder) => reminder.reminderType },
    { key: 'status', header: 'Status', render: (reminder) => <StatusBadge status={reminder.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (reminder) =>
        reminder.status === 'Scheduled' ? (
          <button
            type="button"
            onClick={() => markReminderSent(reminder.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40 hover:text-accent-700"
          >
            <Send className="size-3.5" aria-hidden="true" />
            Mark as sent
          </button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-5">
      <DemoNotice variant="inline" />
      <p className="text-xs text-ink-500">
        Reminders in this demo are simulated records only — no real email or SMS is ever sent, including when marked as sent.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer or appointment…"
          aria-label="Search reminders"
          className="lg:max-w-sm"
        />
        <FilterDropdown label="Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} className="lg:w-40" />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="lg:w-40" />
      </div>

      <DataTable
        columns={columns}
        rows={filteredReminders}
        rowKey={(reminder) => reminder.id}
        emptyTitle="No reminders found"
        emptyMessage="Try a different search term or filter."
      />
    </div>
  )
}
