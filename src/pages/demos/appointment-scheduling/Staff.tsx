import { useMemo, useState } from 'react'
import { Pencil, Plus, PowerOff } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import { getStaffServices, summarizeWorkingDays } from '../../../data/demos/appointments/types'
import type { Staff as StaffMember, StaffInput } from '../../../data/demos/appointments/types'
import { StaffFormModal } from './StaffFormModal'

const statusOptions = ['Available', 'On Leave', 'Inactive']

function matchesSearch(member: StaffMember, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return member.name.toLowerCase().includes(needle) || member.role.toLowerCase().includes(needle)
}

/** Staff: search, role/status filters, and CRUD. Working hours are edited from the Availability page. */
export function Staff() {
  const { staff, services, availability, addStaff, updateStaff, deactivateStaff } = useAppointmentsData()

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<StaffMember | null>(null)

  const roles = useMemo(() => Array.from(new Set(staff.map((member) => member.role))).sort(), [staff])
  const availabilityByStaffId = useMemo(() => new Map(availability.map((entry) => [entry.staffId, entry])), [availability])

  const filteredStaff = useMemo(() => {
    return staff
      .filter(
        (member) =>
          (roleFilter === 'All' || member.role === roleFilter) &&
          (statusFilter === 'All' || member.status === statusFilter) &&
          matchesSearch(member, searchTerm),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [staff, searchTerm, roleFilter, statusFilter])

  const openAddModal = () => {
    setEditingStaff(null)
    setFormOpen(true)
  }

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: StaffInput) => {
    if (editingStaff) {
      updateStaff(editingStaff.id, values)
    } else {
      addStaff(values)
    }
    setFormOpen(false)
  }

  const confirmDeactivate = () => {
    if (!deactivateTarget) return
    deactivateStaff(deactivateTarget.id)
    setDeactivateTarget(null)
  }

  const columns: DataTableColumn<StaffMember>[] = [
    { key: 'name', header: 'Staff Member', render: (member) => <span className="font-medium text-ink-900">{member.name}</span> },
    { key: 'role', header: 'Role', render: (member) => member.role },
    { key: 'department', header: 'Department', render: (member) => member.department },
    {
      key: 'services',
      header: 'Services',
      render: (member) => (
        <span className="text-xs text-ink-600">{getStaffServices(member.id, services).map((service) => service.name).join(', ') || '—'}</span>
      ),
    },
    {
      key: 'workingDays',
      header: 'Working Days',
      render: (member) => {
        const entry = availabilityByStaffId.get(member.id)
        return <span className="text-xs text-ink-600">{entry ? summarizeWorkingDays(entry.weeklyHours) : '—'}</span>
      },
    },
    { key: 'status', header: 'Status', render: (member) => <StatusBadge status={member.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (member) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(member)}
            aria-label={`Edit ${member.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          {member.status !== 'Inactive' ? (
            <button
              type="button"
              onClick={() => setDeactivateTarget(member)}
              aria-label={`Deactivate ${member.name}`}
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
          {filteredStaff.length} staff member{filteredStaff.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add staff member
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search staff by name or role…"
          aria-label="Search staff"
          className="lg:max-w-sm"
        />
        <FilterDropdown label="Role" value={roleFilter} options={roles} onChange={setRoleFilter} className="lg:w-48" />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="lg:w-40" />
      </div>

      <DataTable
        columns={columns}
        rows={filteredStaff}
        rowKey={(member) => member.id}
        emptyTitle="No staff found"
        emptyMessage="Try a different search term or filter."
      />

      <StaffFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingStaff={editingStaff} />

      <Modal
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate staff member?"
        description={deactivateTarget ? `${deactivateTarget.name} will be marked inactive and hidden from booking.` : undefined}
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
