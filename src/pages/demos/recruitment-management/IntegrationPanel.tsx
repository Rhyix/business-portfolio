import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { Link } from '../../../lib/router'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import { basePath as integratedBasePath } from '../../../data/demos/integrated/navigation'
import type { Applicant } from '../../../data/demos/recruitment/types'

interface IntegrationPanelProps {
  applicant: Applicant
}

/**
 * Explicit, user-triggered bridge from a Hired applicant to an Employee
 * record in the Integrated Business Management Platform. Reused wherever a
 * Hired candidate's detail is shown (Applicants, Candidate Pipeline, Hiring
 * Decisions) so the sync affordance and its states stay identical everywhere.
 * Renders nothing until the candidate is Hired — see
 * data/demos/recruitment/store.tsx for the NotSynced/Ready/Synced states.
 */
export function IntegrationPanel({ applicant }: IntegrationPanelProps) {
  const { getIntegrationStatus, getIntegrationEmployeeId, syncApplicantToPlatform } = useRecruitmentData()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const status = getIntegrationStatus(applicant.id)
  if (status === 'NotSynced') return null

  const employeeId = getIntegrationEmployeeId(applicant.id)

  const handleConfirm = () => {
    const result = syncApplicantToPlatform(applicant.id)
    setConfirmOpen(false)
    if (!result.ok) {
      setError(result.error)
      setAnnouncement('')
      return
    }
    setError(null)
    setAnnouncement(`${applicant.name} was added to the Integrated Platform.`)
  }

  return (
    <div className="rounded-xl border border-ink-200/80 bg-ink-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900">Integrated Platform</p>
          <p className="mt-0.5 text-xs text-ink-500">
            {status === 'Synced'
              ? employeeId
                ? `Added to Integrated Platform · Employee ID ${employeeId}`
                : 'Added to Integrated Platform'
              : 'Ready to add to Employee records'}
          </p>
        </div>

        {status === 'Ready' ? (
          <Button type="button" size="sm" onClick={() => setConfirmOpen(true)}>
            Add to Integrated Platform
          </Button>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <Check className="size-3.5" aria-hidden="true" />
            Synced
          </span>
        )}
      </div>

      {status === 'Synced' ? (
        <Link
          to={integratedBasePath}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
        >
          Open Integrated Platform
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
      <p role="status" className="sr-only">
        {announcement}
      </p>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Add to Integrated Platform?"
        description={`${applicant.name} will be created as a new employee record in the Integrated Business Management Platform.`}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button type="button" size="md" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  )
}
