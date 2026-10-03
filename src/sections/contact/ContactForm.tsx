import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Send, TriangleAlert } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { company } from '../../data/company'
import { projectTypes } from '../../data/contact'
import { cn } from '../../lib/cn'
import { fadeSwap } from '../../lib/motion'
import { submitEnquiry } from '../../lib/submitEnquiry'
import type { EnquiryFailure } from '../../lib/submitEnquiry'
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

/** idle → submitting → success, or back to idle with an error to show. */
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const emptyValues: ContactFormValues = {
  name: '',
  email: '',
  organisation: '',
  projectType: '',
  message: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * What the visitor reads when delivery fails. Each line says what happened and
 * what to do next; none of them expose the provider, its response or the
 * configuration. The address below is the same one the form delivers to, so a
 * failed enquiry still has somewhere to go.
 */
const failureMessages: Record<EnquiryFailure, string> = {
  'missing-config': 'This form is not connected for delivery yet, so your enquiry was not sent.',
  network: 'We could not reach the delivery service — your enquiry was not sent.',
  rejected: 'The delivery service could not accept this enquiry, so it was not sent.',
  malformed: 'We could not confirm your enquiry was sent, so please assume it was not.',
  unexpected: 'Something went wrong and your enquiry was not sent.',
}

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

/**
 * Contact form wired to real delivery through `submitEnquiry`.
 *
 * The success panel is shown only after the provider confirms it accepted the
 * enquiry. Every other outcome keeps the visitor on the form with their
 * answers intact, so a retry costs nothing and nothing ever claims to have
 * been sent when it was not.
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(emptyValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [failure, setFailure] = useState<EnquiryFailure | null>(null)
  // Kept separately so the fields can be cleared on success while the
  // confirmation still greets the visitor by name.
  const [submittedName, setSubmittedName] = useState('')
  // Hidden field. Anything here means a bot filled it in; the provider is what
  // acts on that, not this component.
  const [botcheck, setBotcheck] = useState('')
  const prefersReducedMotion = useReducedMotion()

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    const nextErrors = validate(values)
    setErrors(nextErrors)

    const firstInvalidField = Object.keys(nextErrors)[0]
    if (firstInvalidField) {
      document.getElementById(`contact-${firstInvalidField}`)?.focus()
      return
    }

    setStatus('submitting')
    setFailure(null)

    const result = await submitEnquiry(values, botcheck)

    if (!result.ok) {
      // Values stay exactly as typed so the visitor can simply press send again.
      setFailure(result.reason)
      setStatus('error')
      return
    }

    setSubmittedName(values.name)
    setValues(emptyValues)
    setErrors({})
    setBotcheck('')
    setStatus('success')
  }

  const handleReset = () => {
    setValues(emptyValues)
    setErrors({})
    setFailure(null)
    setSubmittedName('')
    setStatus('idle')
  }

  const isSubmitting = status === 'submitting'

  const content =
    status === 'success' ? (
      <FormSuccess name={submittedName} onReset={handleReset} />
    ) : (
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isSubmitting || undefined}
        className="relative rounded-xl border border-ink-200/80 bg-white p-6 shadow-card sm:p-8"
      >
        {/* Honeypot. Off-screen rather than display:none so a bot reading the
            DOM still finds it, hidden from assistive tech and out of the tab
            order so nobody else ever meets it. */}
        <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
          <label htmlFor="contact-botcheck">Leave this field empty</label>
          <input
            id="contact-botcheck"
            name="botcheck"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={botcheck}
            onChange={(event) => setBotcheck(event.target.value)}
          />
        </div>

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

        {failure ? (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-red-900">
              {failureMessages[failure]} Please try again, or email us directly at{' '}
              <a
                href={`mailto:${company.email}`}
                className="font-medium underline underline-offset-4"
              >
                {company.email}
              </a>
              .
            </p>
          </div>
        ) : null}

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? 'Sending…' : 'Send Enquiry'}
            <Send className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </form>
    )

  if (prefersReducedMotion) {
    return content
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <m.div
        key={status === 'success' ? 'success' : 'form'}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeSwap()}
      >
        {content}
      </m.div>
    </AnimatePresence>
  )
}
