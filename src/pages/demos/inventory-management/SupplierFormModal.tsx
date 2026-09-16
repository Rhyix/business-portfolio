import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Supplier, SupplierInput, SupplierStatus } from '../../../data/demos/inventory/types'

const statusOptions: SupplierStatus[] = ['Active', 'Inactive']

type FieldErrors = Partial<Record<'name' | 'contactName' | 'email' | 'phone' | 'category', string>>

interface SupplierFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: SupplierInput) => void
  editingSupplier: Supplier | null
}

/** Add/edit dialog for a single supplier. No backend — state lives in the shared inventory store. */
export function SupplierFormModal({ open, onClose, onSubmit, editingSupplier }: SupplierFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingSupplier ? 'Edit supplier' : 'Add supplier'}
      description={editingSupplier ? `Update details for ${editingSupplier.name}.` : 'Register a new supplier.'}
    >
      {open ? <SupplierForm onClose={onClose} onSubmit={onSubmit} editingSupplier={editingSupplier} /> : null}
    </Modal>
  )
}

function SupplierForm({
  onClose,
  onSubmit,
  editingSupplier,
}: {
  onClose: () => void
  onSubmit: (values: SupplierInput) => void
  editingSupplier: Supplier | null
}) {
  const [name, setName] = useState(editingSupplier?.name ?? '')
  const [contactName, setContactName] = useState(editingSupplier?.contactName ?? '')
  const [email, setEmail] = useState(editingSupplier?.email ?? '')
  const [phone, setPhone] = useState(editingSupplier?.phone ?? '')
  const [category, setCategory] = useState(editingSupplier?.category ?? '')
  const [status, setStatus] = useState<SupplierStatus>(editingSupplier?.status ?? 'Active')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange = (setter: (value: string) => void, field: keyof FieldErrors) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter a supplier name.'
    if (!contactName.trim()) nextErrors.contactName = 'Enter a contact name.'
    if (!email.trim()) nextErrors.email = 'Enter an email address.'
    if (!phone.trim()) nextErrors.phone = 'Enter a phone number.'
    if (!category.trim()) nextErrors.category = 'Enter a category.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({ name, contactName, email, phone, category, status })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="supplier-name" label="Supplier name" error={errors.name}>
        <input
          id="supplier-name"
          type="text"
          value={name}
          onChange={handleTextChange(setName, 'name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="supplier-contact" label="Contact name" error={errors.contactName}>
          <input
            id="supplier-contact"
            type="text"
            value={contactName}
            onChange={handleTextChange(setContactName, 'contactName')}
            aria-invalid={errors.contactName ? true : undefined}
            className={cn(demoControlStyles, errors.contactName && 'border-red-300')}
          />
        </FormField>
        <FormField id="supplier-category" label="Category" error={errors.category}>
          <input
            id="supplier-category"
            type="text"
            value={category}
            onChange={handleTextChange(setCategory, 'category')}
            aria-invalid={errors.category ? true : undefined}
            className={cn(demoControlStyles, errors.category && 'border-red-300')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="supplier-email" label="Email" error={errors.email}>
          <input
            id="supplier-email"
            type="email"
            value={email}
            onChange={handleTextChange(setEmail, 'email')}
            aria-invalid={errors.email ? true : undefined}
            className={cn(demoControlStyles, errors.email && 'border-red-300')}
          />
        </FormField>
        <FormField id="supplier-phone" label="Phone" error={errors.phone}>
          <input
            id="supplier-phone"
            type="tel"
            value={phone}
            onChange={handleTextChange(setPhone, 'phone')}
            aria-invalid={errors.phone ? true : undefined}
            className={cn(demoControlStyles, errors.phone && 'border-red-300')}
          />
        </FormField>
      </div>

      <FormField id="supplier-status" label="Status">
        <select id="supplier-status" value={status} onChange={(event) => setStatus(event.target.value as SupplierStatus)} className={demoControlStyles}>
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
          {editingSupplier ? 'Save changes' : 'Add supplier'}
        </Button>
      </div>
    </form>
  )
}
