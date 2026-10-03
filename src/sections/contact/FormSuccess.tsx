import { CircleCheckBig } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { IconFrame } from '../../components/ui/IconFrame'
import { company } from '../../data/company'

interface FormSuccessProps {
  name: string
  onReset: () => void
}

/**
 * Shown only once the delivery provider has confirmed it accepted the enquiry
 * — never on validation alone. The wording is deliberately limited to what
 * that confirmation actually proves: the enquiry was submitted and accepted
 * for delivery. It promises no reply time, since nothing here can know one.
 */
export function FormSuccess({ name, onReset }: FormSuccessProps) {
  const firstName = name.trim().split(' ')[0]

  return (
    <div
      role="status"
      className="rounded-xl border border-ink-200/80 bg-white p-8 shadow-card sm:p-10"
    >
      <IconFrame icon={CircleCheckBig} size="lg" />
      <h3 className="mt-5 text-lg font-semibold text-ink-900">
        Thanks{firstName ? `, ${firstName}` : ''} — your enquiry was submitted.
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-500">
        It has been accepted for delivery to{' '}
        <a
          href={`mailto:${company.email}`}
          className="font-medium text-accent-700 underline-offset-4 hover:underline"
        >
          {company.email}
        </a>
        , and we will read it there. If you need to add anything, reply to that address and your
        notes will land alongside this enquiry.
      </p>
      <Button variant="secondary" size="sm" className="mt-7" onClick={onReset}>
        Submit Another Enquiry
      </Button>
    </div>
  )
}
