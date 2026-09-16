import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { EmploymentType, Vacancy, VacancyStatus } from '../../../data/demos/recruitment/types'
import type { VacancyInput } from '../../../data/demos/recruitment/types'

const emptyValues: VacancyInput = {
  title: '',
  department: '',
  employmentType: 'Full-time',
  location: '',
  description: '',
  requirements: [],
  status: 'Draft',
}

const employmentTypeOptions: EmploymentType[] = ['Full-time', 'Part-time', 'Contract']
const statusOptions: VacancyStatus[] = ['Draft', 'Open', 'Paused', 'Closed']

type FieldErrors = Partial<Record<'title' | 'department' | 'location', string>>

interface VacancyFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: VacancyInput) => void
  editingVacancy: Vacancy | null
}

/** Add/edit dialog for a single job vacancy. No backend — state lives in the shared recruitment store. */
export function VacancyFormModal({ open, onClose, onSubmit, editingVacancy }: VacancyFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingVacancy ? 'Edit vacancy' : 'Create vacancy'}
      description={editingVacancy ? `Update details for ${editingVacancy.title}.` : 'Post a new demo job opening.'}
    >
      {open ? <VacancyForm onClose={onClose} onSubmit={onSubmit} editingVacancy={editingVacancy} /> : null}
    </Modal>
  )
}

interface VacancyFormFieldsProps {
  onClose: () => void
  onSubmit: (values: VacancyInput) => void
  editingVacancy: Vacancy | null
}

function VacancyForm({ onClose, onSubmit, editingVacancy }: VacancyFormFieldsProps) {
  const [values, setValues] = useState<VacancyInput>(() =>
    editingVacancy
      ? {
          title: editingVacancy.title,
          department: editingVacancy.department,
          employmentType: editingVacancy.employmentType,
          location: editingVacancy.location,
          description: editingVacancy.description,
          requirements: editingVacancy.requirements,
          status: editingVacancy.status,
        }
      : emptyValues,
  )
  const [requirementsText, setRequirementsText] = useState(() => editingVacancy?.requirements.join('\n') ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange =
    (field: 'title' | 'department' | 'location' | 'description') => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const handleEmploymentTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((current) => ({ ...current, employmentType: event.target.value as EmploymentType }))
  }

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValues((current) => ({ ...current, status: event.target.value as VacancyStatus }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!values.title.trim()) nextErrors.title = 'Enter a job title.'
    if (!values.department.trim()) nextErrors.department = 'Enter a department.'
    if (!values.location.trim()) nextErrors.location = 'Enter a location.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      ...values,
      requirements: requirementsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="vacancy-title" label="Job title" error={errors.title}>
        <input
          id="vacancy-title"
          type="text"
          value={values.title}
          onChange={handleTextChange('title')}
          aria-invalid={errors.title ? true : undefined}
          className={cn(demoControlStyles, errors.title && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="vacancy-department" label="Department" error={errors.department}>
          <input
            id="vacancy-department"
            type="text"
            value={values.department}
            onChange={handleTextChange('department')}
            aria-invalid={errors.department ? true : undefined}
            className={cn(demoControlStyles, errors.department && 'border-red-300')}
          />
        </FormField>
        <FormField id="vacancy-location" label="Location" error={errors.location}>
          <input
            id="vacancy-location"
            type="text"
            value={values.location}
            onChange={handleTextChange('location')}
            aria-invalid={errors.location ? true : undefined}
            className={cn(demoControlStyles, errors.location && 'border-red-300')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="vacancy-type" label="Employment type">
          <select id="vacancy-type" value={values.employmentType} onChange={handleEmploymentTypeChange} className={demoControlStyles}>
            {employmentTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="vacancy-status" label="Status">
          <select id="vacancy-status" value={values.status} onChange={handleStatusChange} className={demoControlStyles}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id="vacancy-description" label="Description">
        <textarea
          id="vacancy-description"
          rows={3}
          value={values.description}
          onChange={handleTextChange('description')}
          className={cn(
            'w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors duration-200 placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none',
          )}
        />
      </FormField>

      <FormField id="vacancy-requirements" label="Requirements (one per line)">
        <textarea
          id="vacancy-requirements"
          rows={3}
          value={requirementsText}
          onChange={(event) => setRequirementsText(event.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors duration-200 placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingVacancy ? 'Save changes' : 'Create vacancy'}
        </Button>
      </div>
    </form>
  )
}
