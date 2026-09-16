import { useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2, UserRound } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import { initialCustomers } from '../../../data/demos/business-management/customers'
import type { Customer, CustomerStatus } from '../../../data/demos/business-management/types'
import { useOptionalIntegratedData } from '../../../data/demos/integrated/context'
import { CustomerFormModal } from './CustomerFormModal'
import type { CustomerFormValues } from './CustomerFormModal'

const PAGE_SIZE = 8
const STATUS_OPTIONS: CustomerStatus[] = ['Active', 'Lead', 'Inactive']

function matchesSearch(customer: Customer, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    customer.name.toLowerCase().includes(needle) ||
    customer.email.toLowerCase().includes(needle) ||
    customer.company.toLowerCase().includes(needle)
  )
}

/**
 * Customer management page: search, filter, pagination and CRUD-style
 * interactions. Uses the shared integrated-platform store when rendered
 * inside it (via IntegratedDataProvider); otherwise falls back to local
 * state seeded from the same demo data, so this single component serves
 * both the standalone BMS demo and the integrated platform.
 */
export function Customers() {
  const shared = useOptionalIntegratedData()
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(initialCustomers)
  const customers = shared ? shared.customers : localCustomers
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const nextIdRef = useRef(1015)

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        (statusFilter === 'All' || customer.status === statusFilter) &&
        matchesSearch(customer, searchTerm),
    )
  }, [customers, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredCustomers.slice(pageStart, pageStart + PAGE_SIZE)

  const updateSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }

  const updateStatusFilter = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const openAddModal = () => {
    setEditingCustomer(null)
    setFormOpen(true)
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: CustomerFormValues) => {
    if (editingCustomer) {
      if (shared) {
        shared.updateCustomer(editingCustomer.id, values)
      } else {
        setLocalCustomers((current) =>
          current.map((customer) =>
            customer.id === editingCustomer.id ? { ...customer, ...values } : customer,
          ),
        )
      }
    } else if (shared) {
      shared.addCustomer(values)
    } else {
      const newCustomer: Customer = {
        id: `CUS-${nextIdRef.current}`,
        ...values,
        orders: 0,
        joined: new Date().toISOString().slice(0, 10),
      }
      nextIdRef.current += 1
      setLocalCustomers((current) => [newCustomer, ...current])
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (shared) {
      shared.deleteCustomer(deleteTarget.id)
    } else {
      setLocalCustomers((current) => current.filter((customer) => customer.id !== deleteTarget.id))
    }
    setDeleteTarget(null)
  }

  const columns: DataTableColumn<Customer>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (customer) => (
        <button
          type="button"
          onClick={() => setDetailCustomer(customer)}
          className="text-left"
        >
          <span className="block font-medium text-ink-900 hover:text-accent-700 hover:underline">
            {customer.name}
          </span>
          <span className="block text-xs text-ink-500">{customer.email}</span>
        </button>
      ),
    },
    { key: 'company', header: 'Company', render: (customer) => customer.company },
    { key: 'phone', header: 'Phone', render: (customer) => customer.phone },
    { key: 'status', header: 'Status', render: (customer) => <StatusBadge status={customer.status} /> },
    { key: 'orders', header: 'Orders', render: (customer) => customer.orders },
    { key: 'joined', header: 'Joined', render: (customer) => formatDate(customer.joined) },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (customer) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              openEditModal(customer)
            }}
            aria-label={`Edit ${customer.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setDeleteTarget(customer)
            }}
            aria-label={`Delete ${customer.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={updateSearch}
          placeholder="Search customers by name, email or company…"
          aria-label="Search customers"
          className="sm:max-w-sm"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={updateStatusFilter}
          className="sm:w-48"
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(customer) => customer.id}
        emptyTitle="No customers found"
        emptyMessage="Try a different search term or status filter."
      />

      {filteredCustomers.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredCustomers.length)} of{' '}
            {filteredCustomers.length}
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

      <CustomerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingCustomer={editingCustomer}
      />

      <Modal
        open={detailCustomer !== null}
        onClose={() => setDetailCustomer(null)}
        title="Customer details"
        description={detailCustomer?.id}
      >
        {detailCustomer ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-ink-100 text-ink-600">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{detailCustomer.name}</p>
                <p className="truncate text-xs text-ink-500">{detailCustomer.company}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Email</dt>
                <dd className="mt-0.5 text-ink-900">{detailCustomer.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Phone</dt>
                <dd className="mt-0.5 text-ink-900">{detailCustomer.phone}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={detailCustomer.status} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Orders</dt>
                <dd className="mt-0.5 text-ink-900">{detailCustomer.orders}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Joined</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailCustomer.joined)}</dd>
              </div>
            </dl>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  const customer = detailCustomer
                  setDetailCustomer(null)
                  openEditModal(customer)
                }}
              >
                Edit customer
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete customer?"
        description={
          deleteTarget
            ? `${deleteTarget.name} will be removed from this demo workspace. This cannot be undone.`
            : undefined
        }
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
