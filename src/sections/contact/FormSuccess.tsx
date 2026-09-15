import { CircleCheckBig } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { IconFrame } from '../../components/ui/IconFrame'
import { company } from '../../data/company'
import { formDeliveryNotice } from '../../data/contact'

interface FormSuccessProps {
  name: string
  onReset: () => void
}

/**
 * Confirmation shown once client-side validation passes.
 * The form has no backend yet, so the copy points the visitor at the real email
 * address instead of implying the message was sent.
 */
export function FormSuccess({ name, onReset }: FormSuccessProps) {
  const firstName = name.trim().split(' ')[0]

  return (
    <div className="rounded-2xl border border-ink-200/80 bg-white p-8 shadow-card sm:p-10">
      <IconFrame icon={CircleCheckBig} size="lg" />
      <h3 className="mt-5 text-lg font-semibold text-ink-900">
        Thanks{firstName ? `, ${firstName}` : ''} — your details are complete.
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-500">
        {formDeliveryNotice ? `${formDeliveryNotice} ` : ''}
        Send the same details to{' '}
        <a
          href={`mailto:${company.email}`}
          className="font-medium text-accent-700 underline-offset-4 hover:underline"
        >
          {company.email}
        </a>{' '}
        and we will take it from there.
      </p>
      <Button variant="secondary" size="sm" className="mt-7" onClick={onReset}>
        Submit another enquiry
      </Button>
    </div>
  )
}