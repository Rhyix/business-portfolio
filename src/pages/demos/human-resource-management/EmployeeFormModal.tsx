import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Employee, EmployeeStatus, EmploymentType } from '../../../data/demos/human-resources/types'

export interface EmployeeFormValues {
  name: string
  department: string
  position: string
  employmentType: EmploymentType
  status: EmployeeStatus
  email: string
  phone: string
}

const emptyValues: EmployeeFormValues = {
  name: '',
  department: '',
  position: '',
  employmentType: 'Full-time',
  status: 'Active',
  email: '',
  phone: '',
}

const employmentTypeOptions: EmploymentType[] = ['Full-time', 'Part-time', 'Contract']
const statusOptions: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = Partial<Record<keyof EmployeeFormValues, string>>

interface EmployeeFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: EmployeeFormValues) => void
  editingEmployee: Employee | null
}

/**
 * Add/edit dialog for a single employee record. No backend — state lives in
 * the parent page. The form fields live in a child component that Modal only
 * mounts while open, so each open cycle starts from fresh initial values
 * without needing an effect to resynchronise them.
 */
export function EmployeeFormModal({ open, onClose, onSubmit, editingEmployee }: EmployeeFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingEmployee ? 'Edit employee' : 'Add employee'}
      description={
        editingEmployee
          ? `Update details for ${editingEmployee.name}.`
          : 'Create a new demo employee record.'
      }
    >
      {open ? (
        <EmployeeForm onClose={onClose} onSubmit={onSubmit} editingEmployee={editingEmployee} />
      ) : null}
    </Modal>
  )
}

interface EmployeeFormFieldsProps {
  onClose: () => void
  onSubmit: (values: EmployeeFormValues) => void
  editingEmployee: Employee | null
}

function EmployeeForm({ onClose, onSubmit, editingEmployee }: EmployeeFormFieldsProps) {
  const [values, setValues] = useState<EmployeeFormValues>(() =>
    editingEmployee
      ? {
          name: editingEmployee.name,
          department: editingEmployee.department,
          position: editingEmployee.position,
          employmentType: editingEmployee.employmentType,
          status: editingEmployee.status,
          email: editingEmployee.email,
          phone: editingEmployee.phone,
        }
      : emptyValues,
  )
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange =
    (field: 'name' | 'department' | 'position' | 'email' | 'phone') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const handleEmploymentTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((current) => ({ ...current, employmentType: event.target.value as EmploymentType }))
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((current) => ({ ...current, status: event.target.value as EmployeeStatus }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!values.name.trim()) nextErrors.name = 'Enter a name.'
    if (!values.department.trim()) nextErrors.department = 'Enter a department.'
    if (!values.position.trim()) nextErrors.position = 'Enter a position.'
    if (!values.email.trim()) {
      nextErrors.email = 'Enter an email address.'
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!values.phone.trim()) nextErrors.phone = 'Enter a phone number.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit(values)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="employee-name" label="Name" error={errors.name}>
        <input
          id="employee-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={handleTextChange('name')}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="employee-department" label="Department" error={errors.department}>
          <input
            id="employee-department"
            name="department"
            type="text"
            value={values.department}
            onChange={handleTextChange('department')}
            aria-invalid={errors.department ? true : undefined}
            className={cn(demoControlStyles, errors.department && 'border-red-300')}
          />
        </FormField>

        <FormField id="employee-position" label="Position" error={errors.position}>
          <input
            id="employee-position"
            name="position"
            type="text"
            value={values.position}
            onChange={handleTextChange('position')}
            aria-invalid={errors.position ? true : undefined}
            className={cn(demoControlStyles, errors.position && 'border-red-300')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="employee-type" label="Employment type">
          <select
            id="employee-type"
            name="employmentType"
            value={values.employmentType}
            onChange={handleEmploymentTypeChange}
            className={demoControlStyles}
          >
            {employmentTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>

        <FormField id="employee-status" label="Status">
          <select
            id="employee-status"
            name="status"
            value={values.status}
            onChange={handleStatusChange}
            className={demoControlStyles}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id="employee-email" label="Email" error={errors.email}>
        <input
          id="employee-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleTextChange('email')}
          aria-invalid={errors.email ? true : undefined}
          className={cn(demoControlStyles, errors.email && 'border-red-300')}
        />
      </FormField>

      <FormField id="employee-phone" label="Phone" error={errors.phone}>
        <input
          id="employee-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={handleTextChange('phone')}
          aria-invalid={errors.phone ? true : undefined}
          className={cn(demoControlStyles, errors.phone && 'border-red-300')}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingEmployee ? 'Save changes' : 'Add employee'}
        </Button>
      </div>
    </form>
  )
}
