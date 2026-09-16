import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Customer, CustomerStatus } from '../../../data/demos/business-management/types'

export interface CustomerFormValues {
  name: string
  email: string
  phone: string
  company: string
  status: CustomerStatus
}

const emptyValues: CustomerFormValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'Lead',
}

const statusOptions: CustomerStatus[] = ['Active', 'Lead', 'Inactive']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = Partial<Record<keyof CustomerFormValues, string>>

interface CustomerFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: CustomerFormValues) => void
  editingCustomer: Customer | null
}

/**
 * Add/edit dialog for a single customer record. No backend — state lives in
 * the parent page. The form fields live in a child component that Modal only
 * mounts while open, so each open cycle starts from fresh initial values
 * without needing an effect to resynchronise them.
 */
export function CustomerFormModal({
  open,
  onClose,
  onSubmit,
  editingCustomer,
}: CustomerFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingCustomer ? 'Edit customer' : 'Add customer'}
      description={
        editingCustomer
          ? `Update details for ${editingCustomer.name}.`
          : 'Create a new demo customer record.'
      }
    >
      {open ? (
        <CustomerForm onClose={onClose} onSubmit={onSubmit} editingCustomer={editingCustomer} />
      ) : null}
    </Modal>
  )
}

interface CustomerFormFieldsProps {
  onClose: () => void
  onSubmit: (values: CustomerFormValues) => void
  editingCustomer: Customer | null
}

function CustomerForm({ onClose, onSubmit, editingCustomer }: CustomerFormFieldsProps) {
  const [values, setValues] = useState<CustomerFormValues>(() =>
    editingCustomer
      ? {
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          company: editingCustomer.company,
          status: editingCustomer.status,
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleChange =
    (field: keyof CustomerFormValues) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Enter a name.'
    if (!values.email.trim()) {
      nextErrors.email = 'Enter an email address.'
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!values.phone.trim()) nextErrors.phone = 'Enter a phone number.'
    if (!values.company.trim()) nextErrors.company = 'Enter a company name.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit(values)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="customer-name" label="Name" error={errors.name}>
        <input
          id="customer-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleChange('name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <FormField id="customer-email" label="Email" error={errors.email}>
        <input
          id="customer-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange('email')}
          aria-invalid={errors.email ? true : undefined}
          className={cn(demoControlStyles, errors.email && 'border-red-300')}
        />
      </FormField>

      <FormField id="customer-phone" label="Phone" error={errors.phone}>
        <input
          id="customer-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange('phone')}
          aria-invalid={errors.phone ? true : undefined}
          className={cn(demoControlStyles, errors.phone && 'border-red-300')}
        />
      </FormField>

      <FormField id="customer-company" label="Company" error={errors.company}>
        <input
          id="customer-company"
          name="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={handleChange('company')}
          aria-invalid={errors.company ? true : undefined}
          className={cn(demoControlStyles, errors.company && 'border-red-300')}
        />
      </FormField>

      <FormField id="customer-status" label="Status">
        <select
          id="customer-status"
          name="status"
          value={values.status}
          onChange={handleChange('status')}
          className={demoControlStyles}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
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
