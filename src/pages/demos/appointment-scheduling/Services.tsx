import { useMemo, useState } from 'react'
import { Pencil, Plus, PowerOff } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatCurrency } from '../../../lib/format'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import type { Service, ServiceInput } from '../../../data/demos/appointments/types'
import { ServiceFormModal } from './ServiceFormModal'

const statusOptions = ['Active', 'Inactive']

function matchesSearch(service: Service, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return service.name.toLowerCase().includes(needle) || service.category.toLowerCase().includes(needle)
}

/** Services: search, category/status filters, and CRUD for the demo's bookable service catalogue. */
export function Services() {
  const { services, staff, addService, updateService, deactivateService } = useAppointmentsData()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Service | null>(null)

  const staffNameById = useMemo(() => new Map(staff.map((member) => [member.id, member.name])), [staff])
  const categories = useMemo(() => Array.from(new Set(services.map((service) => service.category))).sort(), [services])

  const filteredServices = useMemo(() => {
    return services
      .filter(
        (service) =>
          (categoryFilter === 'All' || service.category === categoryFilter) &&
          (statusFilter === 'All' || service.status === statusFilter) &&
          matchesSearch(service, searchTerm),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [services, searchTerm, categoryFilter, statusFilter])

  const openAddModal = () => {
    setEditingService(null)
    setFormOpen(true)
  }

  const openEditModal = (service: Service) => {
    setEditingService(service)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: ServiceInput) => {
    if (editingService) {
      updateService(editingService.id, values)
    } else {
      addService(values)
    }
    setFormOpen(false)
  }

  const confirmDeactivate = () => {
    if (!deactivateTarget) return
    deactivateService(deactivateTarget.id)
    setDeactivateTarget(null)
  }

  const columns: DataTableColumn<Service>[] = [
    { key: 'name', header: 'Service', render: (service) => <span className="font-medium text-ink-900">{service.name}</span> },
    { key: 'category', header: 'Category', render: (service) => service.category },
    { key: 'duration', header: 'Duration', render: (service) => `${service.durationMinutes} min` },
    { key: 'price', header: 'Price', render: (service) => <span className="font-medium text-ink-900">{formatCurrency(service.price)}</span> },
    {
      key: 'staff',
      header: 'Assigned Staff',
      render: (service) => (
        <span className="text-xs text-ink-600">
          {service.assignedStaffIds.map((id) => staffNameById.get(id) ?? '—').join(', ') || '—'}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (service) => <StatusBadge status={service.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (service) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(service)}
            aria-label={`Edit ${service.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          {service.status === 'Active' ? (
            <button
              type="button"
              onClick={() => setDeactivateTarget(service)}
              aria-label={`Deactivate ${service.name}`}
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
          {filteredServices.length} service{filteredServices.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add service
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search services by name or category…"
          aria-label="Search services"
          className="lg:max-w-sm"
        />
        <FilterDropdown label="Category" value={categoryFilter} options={categories} onChange={setCategoryFilter} className="lg:w-44" />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="lg:w-40" />
      </div>

      <DataTable
        columns={columns}
        rows={filteredServices}
        rowKey={(service) => service.id}
        emptyTitle="No services found"
        emptyMessage="Try a different search term or filter."
      />

      <ServiceFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingService={editingService} staff={staff} />

      <Modal
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate service?"
        description={deactivateTarget ? `${deactivateTarget.name} will no longer be bookable. Existing appointments are unaffected.` : undefined}
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
