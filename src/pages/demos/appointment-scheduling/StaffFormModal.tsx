import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Staff, StaffInput, StaffStatus } from '../../../data/demos/appointments/types'

const statusOptions: StaffStatus[] = ['Available', 'On Leave', 'Inactive']

type FieldErrors = Partial<Record<'name' | 'role' | 'department', string>>

interface StaffFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: StaffInput) => void
  editingStaff: Staff | null
}

/** Add/edit dialog for a single staff member. No backend — state lives in the shared appointments store. */
export function StaffFormModal({ open, onClose, onSubmit, editingStaff }: StaffFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingStaff ? 'Edit staff member' : 'Add staff member'}
      description={editingStaff ? `Update details for ${editingStaff.name}.` : 'Register a new staff member. Set their weekly schedule from Availability.'}
    >
      {open ? <StaffForm onClose={onClose} onSubmit={onSubmit} editingStaff={editingStaff} /> : null}
    </Modal>
  )
}

function StaffForm({
  onClose,
  onSubmit,
  editingStaff,
}: {
  onClose: () => void
  onSubmit: (values: StaffInput) => void
  editingStaff: Staff | null
}) {
  const [name, setName] = useState(editingStaff?.name ?? '')
  const [role, setRole] = useState(editingStaff?.role ?? '')
  const [department, setDepartment] = useState(editingStaff?.department ?? '')
  const [status, setStatus] = useState<StaffStatus>(editingStaff?.status ?? 'Available')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange = (setter: (value: string) => void, field: keyof FieldErrors) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter a staff name.'
    if (!role.trim()) nextErrors.role = 'Enter a role.'
    if (!department.trim()) nextErrors.department = 'Enter a department.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ name, role, department, status })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="staff-name" label="Staff name" error={errors.name}>
        <input
          id="staff-name"
          type="text"
          value={name}
          onChange={handleTextChange(setName, 'name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="staff-role" label="Role" error={errors.role}>
          <input
            id="staff-role"
            type="text"
            value={role}
            onChange={handleTextChange(setRole, 'role')}
            aria-invalid={errors.role ? true : undefined}
            className={cn(demoControlStyles, errors.role && 'border-red-300')}
          />
        </FormField>
        <FormField id="staff-department" label="Department" error={errors.department}>
          <input
            id="staff-department"
            type="text"
            value={department}
            onChange={handleTextChange(setDepartment, 'department')}
            aria-invalid={errors.department ? true : undefined}
            className={cn(demoControlStyles, errors.department && 'border-red-300')}
          />
        </FormField>
      </div>

      <FormField id="staff-status" label="Status">
        <select id="staff-status" value={status} onChange={(event) => setStatus(event.target.value as StaffStatus)} className={demoControlStyles}>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingStaff ? 'Save changes' : 'Add staff member'}
        </Button>
      </div>
    </form>
  )
}
