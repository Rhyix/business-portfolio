import { useMemo, useState } from 'react'
import { Eye, Pencil, Plus, PowerOff } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { getCustomerAppointments, getCustomerLastVisit } from '../../../data/demos/appointments/types'
import type { Customer, CustomerInput } from '../../../data/demos/appointments/types'
import { CustomerFormModal } from './CustomerFormModal'

const statusOptions = ['Active', 'Inactive']

function matchesSearch(customer: Customer, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return customer.name.toLowerCase().includes(needle) || customer.email.toLowerCase().includes(needle)
}

/** Customers: search, status filter, and CRUD, with a details view of each customer's appointment history. */
export function Customers() {
  const { customers, appointments, addCustomer, updateCustomer, deactivateCustomer } = useAppointmentsData()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Customer | null>(null)
  const [detailCustomerId, setDetailCustomerId] = useState<string | null>(null)

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => (statusFilter === 'All' || customer.status === statusFilter) && matchesSearch(customer, searchTerm))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [customers, searchTerm, statusFilter])

  const detailCustomer = detailCustomerId ? (customers.find((customer) => customer.id === detailCustomerId) ?? null) : null
  const detailAppointments = detailCustomer ? getCustomerAppointments(detailCustomer.id, appointments) : []

  const openAddModal = () => {
    setEditingCustomer(null)
    setFormOpen(true)
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: CustomerInput) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, values)
    } else {
      addCustomer(values)
    }
    setFormOpen(false)
  }

  const confirmDeactivate = () => {
    if (!deactivateTarget) return
    deactivateCustomer(deactivateTarget.id)
    setDeactivateTarget(null)
  }

  const columns: DataTableColumn<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      render: (customer) => (
        <button type="button" onClick={() => setDetailCustomerId(customer.id)} className="block text-left font-medium text-ink-900 hover:text-accent-600">
          {customer.name}
        </button>
      ),
    },
    { key: 'email', header: 'Email', render: (customer) => customer.email },
    { key: 'phone', header: 'Phone', render: (customer) => customer.phone },
    { key: 'appointments', header: 'Appointments', render: (customer) => getCustomerAppointments(customer.id, appointments).length },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      render: (customer) => {
        const lastVisit = getCustomerLastVisit(customer.id, appointments)
        return lastVisit ? formatDate(lastVisit) : '—'
      },
    },
    { key: 'status', header: 'Status', render: (customer) => <StatusBadge status={customer.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (customer) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDetailCustomerId(customer.id)}
            aria-label={`View ${customer.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Eye className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => openEditModal(customer)}
            aria-label={`Edit ${customer.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          {customer.status === 'Active' ? (
            <button
              type="button"
              onClick={() => setDeactivateTarget(customer)}
              aria-label={`Deactivate ${customer.name}`}
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <PowerOff className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredCustomers.length} customer{filteredCustomers.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add customer
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search customers by name or email…"
          aria-label="Search customers"
          className="lg:max-w-sm"
        />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="lg:w-44" />
      </div>

      <DataTable
        columns={columns}
        rows={filteredCustomers}
        rowKey={(customer) => customer.id}
        emptyTitle="No customers found"
        emptyMessage="Try a different search term or filter."
      />

      <CustomerFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingCustomer={editingCustomer} />

      <Modal
        open={detailCustomer !== null}
        onClose={() => setDetailCustomerId(null)}
        title={detailCustomer?.name ?? 'Customer'}
        description={detailCustomer ? `${detailCustomer.email} · ${detailCustomer.phone}` : undefined}
        className="max-w-xl"
      >
        {detailCustomer ? (
          <div className="space-y-4">
            {detailCustomer.notes ? <p className="text-sm text-ink-600">{detailCustomer.notes}</p> : null}
            <div>
              <p className="mb-2 text-sm font-medium text-ink-800">Appointment history</p>
              {detailAppointments.length > 0 ? (
                <ul className="divide-y divide-ink-100 rounded-xl border border-ink-200/80">
                  {detailAppointments.map((appointment) => (
                    <li key={appointment.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink-900">{appointment.serviceName}</p>
                        <p className="text-xs text-ink-500">
                          {formatDate(appointment.date)} at {appointment.time} · {appointment.staffName}
                        </p>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-500">No appointments yet.</p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate customer?"
        description={deactivateTarget ? `${deactivateTarget.name} will be marked inactive. Existing appointment history is unaffected.` : undefined}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setDeactivateTarget(null)}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={confirmDeactivate}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Deactivate
          </button>
        </div>
      </Modal>
    </div>
  )
}
