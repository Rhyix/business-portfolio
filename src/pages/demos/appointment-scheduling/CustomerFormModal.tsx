import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Customer, CustomerInput, CustomerStatus } from '../../../data/demos/appointments/types'

const statusOptions: CustomerStatus[] = ['Active', 'Inactive']

type FieldErrors = Partial<Record<'name' | 'email' | 'phone', string>>

interface CustomerFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: CustomerInput) => void
  editingCustomer: Customer | null
}

/** Add/edit dialog for a single customer. No backend — state lives in the shared appointments store. */
export function CustomerFormModal({ open, onClose, onSubmit, editingCustomer }: CustomerFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingCustomer ? 'Edit customer' : 'Add customer'}
      description={editingCustomer ? `Update details for ${editingCustomer.name}.` : 'Register a new customer record.'}
    >
      {open ? <CustomerForm onClose={onClose} onSubmit={onSubmit} editingCustomer={editingCustomer} /> : null}
    </Modal>
  )
}

function CustomerForm({
  onClose,
  onSubmit,
  editingCustomer,
}: {
  onClose: () => void
  onSubmit: (values: CustomerInput) => void
  editingCustomer: Customer | null
}) {
  const [name, setName] = useState(editingCustomer?.name ?? '')
  const [email, setEmail] = useState(editingCustomer?.email ?? '')
  const [phone, setPhone] = useState(editingCustomer?.phone ?? '')
  const [status, setStatus] = useState<CustomerStatus>(editingCustomer?.status ?? 'Active')
  const [notes, setNotes] = useState(editingCustomer?.notes ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange = (setter: (value: string) => void, field: keyof FieldErrors) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter a customer name.'
    if (!email.trim() || !email.includes('@')) nextErrors.email = 'Enter a valid email address.'
    if (!phone.trim()) nextErrors.phone = 'Enter a phone number.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ name, email, phone, status, notes: notes.trim() || undefined })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="customer-name" label="Customer name" error={errors.name}>
        <input
          id="customer-name"
          type="text"
          value={name}
          onChange={handleTextChange(setName, 'name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="customer-email" label="Email" error={errors.email}>
          <input
            id="customer-email"
            type="email"
            value={email}
            onChange={handleTextChange(setEmail, 'email')}
            aria-invalid={errors.email ? true : undefined}
            className={cn(demoControlStyles, errors.email && 'border-red-300')}
          />
        </FormField>
        <FormField id="customer-phone" label="Phone" error={errors.phone}>
          <input
            id="customer-phone"
            type="tel"
            value={phone}
            onChange={handleTextChange(setPhone, 'phone')}
            aria-invalid={errors.phone ? true : undefined}
            className={cn(demoControlStyles, errors.phone && 'border-red-300')}
          />
        </FormField>
      </div>

      <FormField id="customer-status" label="Status">
        <select id="customer-status" value={status} onChange={(event) => setStatus(event.target.value as CustomerStatus)} className={demoControlStyles}>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="customer-notes" label="Notes (optional)">
        <textarea
          id="customer-notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={cn(demoControlStyles, 'h-auto py-2.5')}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingCustomer ? 'Save changes' : 'Add customer'}
        </Button>
      </div>
    </form>
  )
}
