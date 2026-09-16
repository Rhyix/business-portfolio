import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Warehouse, WarehouseInput, WarehouseStatus } from '../../../data/demos/inventory/types'

const statusOptions: WarehouseStatus[] = ['Active', 'Inactive']

type FieldErrors = Partial<Record<'name' | 'location' | 'manager' | 'capacity', string>>

interface WarehouseFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: WarehouseInput) => void
  editingWarehouse: Warehouse | null
}

/** Add/edit dialog for a single warehouse. No backend — state lives in the shared inventory store. */
export function WarehouseFormModal({ open, onClose, onSubmit, editingWarehouse }: WarehouseFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingWarehouse ? 'Edit warehouse' : 'Add warehouse'}
      description={editingWarehouse ? `Update details for ${editingWarehouse.name}.` : 'Register a new storage location.'}
    >
      {open ? <WarehouseForm onClose={onClose} onSubmit={onSubmit} editingWarehouse={editingWarehouse} /> : null}
    </Modal>
  )
}

function WarehouseForm({
  onClose,
  onSubmit,
  editingWarehouse,
}: {
  onClose: () => void
  onSubmit: (values: WarehouseInput) => void
  editingWarehouse: Warehouse | null
}) {
  const [name, setName] = useState(editingWarehouse?.name ?? '')
  const [location, setLocation] = useState(editingWarehouse?.location ?? '')
  const [manager, setManager] = useState(editingWarehouse?.manager ?? '')
  const [capacity, setCapacity] = useState(editingWarehouse ? String(editingWarehouse.capacity) : '')
  const [status, setStatus] = useState<WarehouseStatus>(editingWarehouse?.status ?? 'Active')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange = (setter: (value: string) => void, field: keyof FieldErrors) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter a warehouse name.'
    if (!location.trim()) nextErrors.location = 'Enter a location.'
    if (!manager.trim()) nextErrors.manager = 'Enter a manager name.'
    if (!capacity.trim() || Number(capacity) <= 0) nextErrors.capacity = 'Enter a valid capacity.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ name, location, manager, capacity: Number(capacity), status })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="warehouse-name" label="Warehouse name" error={errors.name}>
        <input
          id="warehouse-name"
          type="text"
          value={name}
          onChange={handleTextChange(setName, 'name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <FormField id="warehouse-location" label="Location" error={errors.location}>
        <input
          id="warehouse-location"
          type="text"
          value={location}
          onChange={handleTextChange(setLocation, 'location')}
          aria-invalid={errors.location ? true : undefined}
          className={cn(demoControlStyles, errors.location && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="warehouse-manager" label="Manager" error={errors.manager}>
          <input
            id="warehouse-manager"
            type="text"
            value={manager}
            onChange={handleTextChange(setManager, 'manager')}
            aria-invalid={errors.manager ? true : undefined}
            className={cn(demoControlStyles, errors.manager && 'border-red-300')}
          />
        </FormField>
        <FormField id="warehouse-capacity" label="Capacity (units)" error={errors.capacity}>
          <input
            id="warehouse-capacity"
            type="number"
            min={1}
            value={capacity}
            onChange={handleTextChange(setCapacity, 'capacity')}
            aria-invalid={errors.capacity ? true : undefined}
            className={cn(demoControlStyles, errors.capacity && 'border-red-300')}
          />
        </FormField>
      </div>

      <FormField id="warehouse-status" label="Status">
        <select id="warehouse-status" value={status} onChange={(event) => setStatus(event.target.value as WarehouseStatus)} className={demoControlStyles}>
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
          {editingWarehouse ? 'Save changes' : 'Add warehouse'}
        </Button>
      </div>
    </form>
  )
}
