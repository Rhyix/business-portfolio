import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Applicant, ApplicantInput, ApplicantSource, Vacancy } from '../../../data/demos/recruitment/types'

const sourceOptions: ApplicantSource[] = ['Job Board', 'Referral', 'Company Website', 'LinkedIn', 'Agency']

type FieldErrors = Partial<Record<'name' | 'vacancyId' | 'email' | 'phone', string>>

interface ApplicantFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ApplicantInput) => void
  editingApplicant: Applicant | null
  vacancies: Vacancy[]
}

/** Add/edit dialog for a single applicant. No backend — state lives in the shared recruitment store. */
export function ApplicantFormModal({ open, onClose, onSubmit, editingApplicant, vacancies }: ApplicantFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingApplicant ? 'Edit applicant' : 'Add applicant'}
      description={editingApplicant ? `Update details for ${editingApplicant.name}.` : 'Add a new candidate to this demo.'}
    >
      {open ? (
        <ApplicantForm onClose={onClose} onSubmit={onSubmit} editingApplicant={editingApplicant} vacancies={vacancies} />
      ) : null}
    </Modal>
  )
}

interface ApplicantFormFieldsProps {
  onClose: () => void
  onSubmit: (values: ApplicantInput) => void
  editingApplicant: Applicant | null
  vacancies: Vacancy[]
}

function ApplicantForm({ onClose, onSubmit, editingApplicant, vacancies }: ApplicantFormFieldsProps) {
  const [name, setName] = useState(editingApplicant?.name ?? '')
  const [vacancyId, setVacancyId] = useState(editingApplicant?.vacancyId ?? vacancies[0]?.id ?? '')
  const [experienceYears, setExperienceYears] = useState(editingApplicant ? String(editingApplicant.experienceYears) : '0')
  const [experienceSummary, setExperienceSummary] = useState(editingApplicant?.experienceSummary ?? '')
  const [skillsText, setSkillsText] = useState(editingApplicant?.skills.join(', ') ?? '')
  const [education, setEducation] = useState(editingApplicant?.education ?? '')
  const [source, setSource] = useState<ApplicantSource>(editingApplicant?.source ?? 'Job Board')
  const [email, setEmail] = useState(editingApplicant?.email ?? '')
  const [phone, setPhone] = useState(editingApplicant?.phone ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!name.trim()) nextErrors.name = 'Enter the candidate name.'
    if (!vacancyId) nextErrors.vacancyId = 'Select a target position.'
    if (!email.trim()) nextErrors.email = 'Enter an email address.'
    if (!phone.trim()) nextErrors.phone = 'Enter a phone number.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const vacancy = vacancies.find((item) => item.id === vacancyId)

    onSubmit({
      name,
      vacancyId,
      positionTitle: vacancy?.title ?? editingApplicant?.positionTitle ?? '',
      experienceYears: Number(experienceYears) || 0,
      experienceSummary,
      skills: skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
      education,
      source,
      email,
      phone,
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="applicant-name" label="Full name" error={errors.name}>
        <input
          id="applicant-name"
          type="text"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value)
            setErrors((current) => ({ ...current, name: undefined }))
          }}
          aria-invalid={errors.name ? true : undefined}
          className={cn(demoControlStyles, errors.name && 'border-red-300')}
        />
      </FormField>

      <FormField id="applicant-vacancy" label="Target position" error={errors.vacancyId}>
        <select
          id="applicant-vacancy"
          value={vacancyId}
          onChange={(event) => {
            setVacancyId(event.target.value)
            setErrors((current) => ({ ...current, vacancyId: undefined }))
          }}
          aria-invalid={errors.vacancyId ? true : undefined}
          className={cn(demoControlStyles, errors.vacancyId && 'border-red-300')}
        >
          {vacancies.map((vacancy) => (
            <option key={vacancy.id} value={vacancy.id}>
              {vacancy.title} · {vacancy.department}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="applicant-email" label="Email" error={errors.email}>
          <input
            id="applicant-email"
            type="email"
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value)
              setErrors((current) => ({ ...current, email: undefined }))
            }}
            aria-invalid={errors.email ? true : undefined}
            className={cn(demoControlStyles, errors.email && 'border-red-300')}
          />
        </FormField>
        <FormField id="applicant-phone" label="Phone" error={errors.phone}>
          <input
            id="applicant-phone"
            type="tel"
            value={phone}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setPhone(event.target.value)
              setErrors((current) => ({ ...current, phone: undefined }))
            }}
            aria-invalid={errors.phone ? true : undefined}
            className={cn(demoControlStyles, errors.phone && 'border-red-300')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="applicant-experience" label="Years of experience">
          <input
            id="applicant-experience"
            type="number"
            min={0}
            value={experienceYears}
            onChange={(event) => setExperienceYears(event.target.value)}
            className={demoControlStyles}
          />
        </FormField>
        <FormField id="applicant-source" label="Source">
          <select id="applicant-source" value={source} onChange={(event) => setSource(event.target.value as ApplicantSource)} className={demoControlStyles}>
            {sourceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id="applicant-education" label="Education">
        <input id="applicant-education" type="text" value={education} onChange={(event) => setEducation(event.target.value)} className={demoControlStyles} />
      </FormField>

      <FormField id="applicant-summary" label="Experience summary">
        <textarea
          id="applicant-summary"
          rows={3}
          value={experienceSummary}
          onChange={(event) => setExperienceSummary(event.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors duration-200 placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
        />
      </FormField>

      <FormField id="applicant-skills" label="Skills (comma separated)">
        <input id="applicant-skills" type="text" value={skillsText} onChange={(event) => setSkillsText(event.target.value)} className={demoControlStyles} />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingApplicant ? 'Save changes' : 'Add applicant'}
        </Button>
      </div>
    </form>
  )
}
