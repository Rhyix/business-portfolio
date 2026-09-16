import { useId, useState } from 'react'
import { RotateCcw, UserCheck, UserX } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/demo/EmptyState'
import { cn } from '../../../lib/cn'
import { formatDate } from '../../../lib/format'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { Applicant, ApplicantStage } from '../../../data/demos/recruitment/types'

type HiringTab = 'Shortlisted' | 'Hired' | 'Rejected'

const tabs: { key: HiringTab; label: string }[] = [
  { key: 'Shortlisted', label: 'Shortlisted' },
  { key: 'Hired', label: 'Hired' },
  { key: 'Rejected', label: 'Rejected' },
]

type PendingAction =
  | { kind: 'hire' | 'reject'; applicant: Applicant }
  | { kind: 'return'; applicant: Applicant }
  | null

/**
 * Hiring Decisions: a recruitment-only view over Shortlisted / Hired /
 * Rejected candidates. Deliberately not wired into the Integrated Platform —
 * see HiringDecisionEvent in data/demos/recruitment/types.ts for the seam a
 * future stage can use to create Employee records from a hire.
 */
export function Hiring() {
  const { applicants, markHired, rejectApplicant, returnToPipeline } = useRecruitmentData()

  const [activeTab, setActiveTab] = useState<HiringTab>('Shortlisted')
  const [detailApplicantId, setDetailApplicantId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [decisionNotes, setDecisionNotes] = useState('')
  const tabListId = useId()

  const detailApplicant = detailApplicantId ? (applicants.find((applicant) => applicant.id === detailApplicantId) ?? null) : null

  const rowsForTab = (stage: ApplicantStage) => applicants.filter((applicant) => applicant.stage === stage)

  const openDecisionModal = (kind: 'hire' | 'reject', applicant: Applicant) => {
    setDecisionNotes(applicant.decisionNotes ?? '')
    setPendingAction({ kind, applicant })
  }

  const openReturnModal = (applicant: Applicant) => {
    setPendingAction({ kind: 'return', applicant })
  }

  const confirmAction = () => {
    if (!pendingAction) return
    const notes = decisionNotes.trim() || undefined
    if (pendingAction.kind === 'hire') {
      markHired(pendingAction.applicant.id, notes)
    } else if (pendingAction.kind === 'reject') {
      rejectApplicant(pendingAction.applicant.id, notes)
    } else {
      returnToPipeline(pendingAction.applicant.id)
    }
    setPendingAction(null)
    setDetailApplicantId(null)
  }

  const columnsFor = (stage: HiringTab): DataTableColumn<Applicant>[] => {
    const base: DataTableColumn<Applicant>[] = [
      {
        key: 'name',
        header: 'Candidate',
        render: (applicant) => (
          <button
            type="button"
            onClick={() => setDetailApplicantId(applicant.id)}
            className="block text-left font-medium text-ink-900 hover:text-accent-600"
          >
            {applicant.name}
            <span className="block text-xs font-normal text-ink-500">{applicant.positionTitle}</span>
          </button>
        ),
      },
      { key: 'experience', header: 'Experience', render: (applicant) => `${applicant.experienceYears} yrs` },
      { key: 'applied', header: 'Applied', render: (applicant) => formatDate(applicant.appliedDate) },
    ]

    const actions: DataTableColumn<Applicant> = {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (applicant) => (
        <span className="inline-flex items-center gap-1">
          {stage === 'Shortlisted' ? (
            <>
              <button
                type="button"
                onClick={() => openDecisionModal('hire', applicant)}
                aria-label={`Mark ${applicant.name} hired`}
                className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <UserCheck className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => openDecisionModal('reject', applicant)}
                aria-label={`Reject ${applicant.name}`}
                className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
              >
                <UserX className="size-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => openReturnModal(applicant)}
              aria-label={`Return ${applicant.name} to pipeline`}
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          )}
        </span>
      ),
    }

    return [...base, actions]
  }

  const activeRows = rowsForTab(activeTab)

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Hiring decision stage" id={tabListId} className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab
          const count = rowsForTab(tab.key).length
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`${tabListId}-${tab.key}-tab`}
              aria-selected={isActive}
              aria-controls={`${tabListId}-${tab.key}-panel`}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
              )}
            >
              {tab.label}
              <span className={cn('rounded-full px-1.5 py-0.5 text-xs', isActive ? 'bg-white/15' : 'bg-ink-100')}>{count}</span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`${tabListId}-${activeTab}-panel`} aria-labelledby={`${tabListId}-${activeTab}-tab`}>
        {activeRows.length > 0 ? (
          <DataTable columns={columnsFor(activeTab)} rows={activeRows} rowKey={(applicant) => applicant.id} />
        ) : (
          <EmptyState title={`No ${activeTab.toLowerCase()} candidates`} message="Candidates will appear here as they move through the pipeline." />
        )}
      </div>

      <Modal
        open={detailApplicant !== null}
        onClose={() => setDetailApplicantId(null)}
        title="Candidate details"
        description={detailApplicant?.positionTitle}
      >
        {detailApplicant ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink-900">{detailApplicant.name}</p>
              <StatusBadge status={detailApplicant.stage} />
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Experience</dt>
                <dd className="mt-0.5 text-ink-900">{detailApplicant.experienceYears} years</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Applied</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailApplicant.appliedDate)}</dd>
              </div>
            </dl>
            {detailApplicant.decisionNotes ? (
              <div>
                <dt className="text-xs font-medium text-ink-500">Decision notes</dt>
                <p className="mt-1 text-sm text-ink-800">{detailApplicant.decisionNotes}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        title={
          pendingAction?.kind === 'hire'
            ? 'Mark as hired?'
            : pendingAction?.kind === 'reject'
              ? 'Reject candidate?'
              : 'Return to pipeline?'
        }
        description={
          pendingAction?.kind === 'return'
            ? `${pendingAction.applicant.name} will be moved back to Shortlisted for further review.`
            : pendingAction
              ? `${pendingAction.applicant.name} will be marked ${pendingAction.kind === 'hire' ? 'hired' : 'rejected'} for ${pendingAction.applicant.positionTitle}.`
              : undefined
        }
      >
        <div className="space-y-4">
          {pendingAction?.kind !== 'return' ? (
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-ink-500">Decision notes (optional)</span>
              <textarea
                rows={2}
                value={decisionNotes}
                onChange={(event) => setDecisionNotes(event.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors duration-200 placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
              />
            </label>
          ) : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" size="md" onClick={() => setPendingAction(null)}>
              Cancel
            </Button>
            <button
              type="button"
              onClick={confirmAction}
              className={cn(
                'inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-white transition-colors duration-200 ease-out',
                pendingAction?.kind === 'hire'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : pendingAction?.kind === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-ink-900 hover:bg-ink-800',
              )}
            >
              {pendingAction?.kind === 'hire' ? 'Confirm hire' : pendingAction?.kind === 'reject' ? 'Confirm rejection' : 'Return to pipeline'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
