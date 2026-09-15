import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { projectTypes } from '../../data/contact'
import { cn } from '../../lib/cn'
import { FormField } from './FormField'
import { FormSuccess } from './FormSuccess'

interface ContactFormValues {
  name: string
  email: string
  organisation: string
  projectType: string
  message: string
}

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>

const emptyValues: ContactFormValues = {
  name: '',
  email: '',
  organisation: '',
  projectType: '',
  message: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const controlStyles =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors duration-200 placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none'

/** Shared aria wiring and error styling for form controls. */
function fieldState(field: keyof ContactFormValues, error?: string, className?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `contact-${field}-error` : undefined,
    className: cn(controlStyles, className, error ? 'border-red-300' : undefined),
  }
}

function validate(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {}

  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!values.email.trim()) {
    errors.email = 'Enter your email address.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.projectType) errors.projectType = 'Choose a project type.'
  if (!values.message.trim()) errors.message = 'Tell us what you need.'

  return errors
}

/** Contact form with browser-side validation only (see the handleSubmit TODO). */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(emptyValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    const firstInvalidField = Object.keys(nextErrors)[0]
    if (firstInvalidField) {
      document.getElementById(`contact-${firstInvalidField}`)?.focus()
      return
    }

    // TODO: send `values` to a backend or email service, then clear
    // formDeliveryNotice in src/data/contact.ts so the notice disappears.
    setSubmitted(true)
  }

  const handleReset = () => {
    setValues(emptyValues)
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    return <FormSuccess name={values.name} onReset={handleReset} />
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-ink-200/80 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={values.name}
            onChange={handleChange}
            {...fieldState('name', errors.name, 'h-11')}
          />
        </FormField>

        <FormField id="contact-email" label="Email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={handleChange}
            {...fieldState('email', errors.email, 'h-11')}
          />
        </FormField>

        <FormField
          id="contact-organisation"
          label="Company / organisation"
          error={errors.organisation}
        >
          <input
            id="contact-organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            value={values.organisation}
            onChange={handleChange}
            {...fieldState('organisation', errors.organisation, 'h-11')}
          />
        </FormField>

        <FormField id="contact-projectType" label="Project type" error={errors.projectType}>
          <select
            id="contact-projectType"
            name="projectType"
            value={values.projectType}
            onChange={handleChange}
            {...fieldState('projectType', errors.projectType, 'h-11')}
          >
            <option value="">Select a project type</option>
            {projectTypes.map((projectType) => (
              <option key={projectType} value={projectType}>
                {projectType}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="contact-message"
          label="Message"
          error={errors.message}
          className="sm:col-span-2"
        >
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="Describe the system you need and the process it should support."
            value={values.message}
            onChange={handleChange}
            {...fieldState('message', errors.message)}
          />
        </FormField>
      </div>

      <div className="mt-7 flex justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Send enquiry
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}