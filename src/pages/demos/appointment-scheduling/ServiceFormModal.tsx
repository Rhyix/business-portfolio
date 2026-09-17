import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Service, ServiceInput, ServiceStatus, Staff } from '../../../data/demos/appointments/types'

const statusOptions: ServiceStatus[] = ['Active', 'Inactive']

type FieldErrors = Partial<Record<'name' | 'category' | 'durationMinutes' | 'price' | 'assignedStaffIds', string>>

interface ServiceFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ServiceInput) => void
  editingService: Service | null
  staff: Staff[]
}

/** Add/edit dialog for a single service. No backend — state lives in the shared appointments store. */
export function ServiceFormModal({ open, onClose, onSubmit, editingService, staff }: ServiceFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingService ? 'Edit service' : 'Add service'}
      description={editingService ? `Update details for ${editingService.name}.` : 'Offer a new bookable service.'}
    >
      {open ? <ServiceForm onClose={onClose} onSubmit={onSubmit} editingService={editingService} staff={staff} /> : null}
    </Modal>
  )
}

function ServiceForm({
  onClose,
  onSubmit,
  editingService,
  staff,
}: {
  onClose: () => void
  onSubmit: (values: ServiceInput) => void
  editingService: Service | null
  staff: Staff[]
}) {
  const [name, setName] = useState(editingService?.name ?? '')
  const [category, setCategory] = useState(editingService?.category ?? '')
  const [durationMinutes, setDurationMinutes] = useState(editingService ? String(editingService.durationMinutes) : '30')
  const [price, setPrice] = useState(editingService ? String(editingService.price) : '')
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>(editingService?.assignedStaffIds ?? [])
  const [status, setStatus] = useState<ServiceStatus>(editingService?.status ?? 'Active')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange = (setter: (value: string) => void, field: keyof FieldErrors) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const toggleStaff = (staffId: string) => {
    setAssignedStaffIds((current) => (current.includes(staffId) ? current.filter((id) => id !== staffId) : [...current, staffId]))
    setErrors((current) => ({ ...current, assignedStaffIds: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter a service name.'
    if (!category.trim()) nextErrors.category = 'Enter a category.'
    if (!durationMinutes.trim() || Number(durationMinutes) <= 0) nextErrors.durationMinutes = 'Enter a valid duration.'
    if (!price.trim() || Number(price) < 0) nextErrors.price = 'Enter a valid price.'
    if (assignedStaffIds.length === 0) nextErrors.assignedStaffIds = 'Assign at least one staff member.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ name, category, durationMinutes: Number(durationMinutes), price: Number(price), assignedStaffIds, status })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="service-name" label="Service name" error={errors.name}>
        <input
          id="service-name"
          type="text"
          value={name}
          onChange={handleTextChange(setName, 'name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="service-category" label="Category" error={errors.category}>
          <input
            id="service-category"
            type="text"
            value={category}
            onChange={handleTextChange(setCategory, 'category')}
            aria-invalid={errors.category ? true : undefined}
            className={cn(demoControlStyles, errors.category && 'border-red-300')}
          />
        </FormField>
        <FormField id="service-status" label="Status">
          <select id="service-status" value={status} onChange={(event) => setStatus(event.target.value as ServiceStatus)} className={demoControlStyles}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="service-duration" label="Duration (minutes)" error={errors.durationMinutes}>
          <input
            id="service-duration"
            type="number"
            min={5}
            step={5}
            value={durationMinutes}
            onChange={handleTextChange(setDurationMinutes, 'durationMinutes')}
            aria-invalid={errors.durationMinutes ? true : undefined}
            className={cn(demoControlStyles, errors.durationMinutes && 'border-red-300')}
          />
        </FormField>
        <FormField id="service-price" label="Price" error={errors.price}>
          <input
            id="service-price"
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={handleTextChange(setPrice, 'price')}
            aria-invalid={errors.price ? true : undefined}
            className={cn(demoControlStyles, errors.price && 'border-red-300')}
          />
        </FormField>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-ink-800">Assigned staff</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {staff.map((member) => (
            <label key={member.id} className="flex items-center gap-2.5 rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={assignedStaffIds.includes(member.id)}
                onChange={() => toggleStaff(member.id)}
                className="size-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-100"
              />
              {member.name}
            </label>
          ))}
        </div>
        {errors.assignedStaffIds ? <p className="mt-2 text-xs font-medium text-red-600">{errors.assignedStaffIds}</p> : null}
      </fieldset>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingService ? 'Save changes' : 'Add service'}
        </Button>
      </div>
    </form>
  )
}
