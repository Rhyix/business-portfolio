import { useId, useMemo, useState } from 'react'
import { ArrowRight, Briefcase, Clock } from 'lucide-react'
import { m, useReducedMotion } from 'motion/react'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { cn } from '../../../lib/cn'
import { formatDate } from '../../../lib/format'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { Applicant, ApplicantStage } from '../../../data/demos/recruitment/types'
import { IntegrationPanel } from './IntegrationPanel'

const stageOrder: ApplicantStage[] = ['Applied', 'Screening', 'Interview', 'Assessment', 'Shortlisted', 'Hired', 'Rejected']

const nextStage: Partial<Record<ApplicantStage, ApplicantStage>> = {
  Applied: 'Screening',
  Screening: 'Interview',
  Interview: 'Assessment',
  Assessment: 'Shortlisted',
}

interface PendingStageChange {
  applicant: Applicant
  stage: 'Hired' | 'Rejected'
}

interface CandidateCardProps {
  applicant: Applicant
  onOpen: (applicant: Applicant) => void
  onAdvance: (applicant: Applicant) => void
}

function CandidateCard({ applicant, onOpen, onAdvance }: CandidateCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <m.div
      layout={!prefersReducedMotion}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
      className="rounded-xl border border-ink-200/80 bg-white p-3.5 shadow-soft"
    >
      <button type="button" onClick={() => onOpen(applicant)} className="block w-full text-left">
        <p className="truncate text-sm font-medium text-ink-900">{applicant.name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink-500">
          <Briefcase className="size-3 shrink-0" aria-hidden="true" />
          {applicant.positionTitle}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-400">
          <Clock className="size-3 shrink-0" aria-hidden="true" />
          {applicant.experienceYears} yrs · {formatDate(applicant.appliedDate)}
        </p>
      </button>
      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusBadge status={applicant.stage} />
        {nextStage[applicant.stage] ? (
          <button
            type="button"
            onClick={() => onAdvance(applicant)}
            aria-label={`Advance ${applicant.name} to ${nextStage[applicant.stage]}`}
            className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40 hover:text-accent-700"
          >
            Advance
            <ArrowRight className="size-3" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </m.div>
  )
}

/**
 * Candidate Pipeline: the flagship recruitment view. A desktop/tablet kanban
 * board (contained horizontal scroll, no drag-and-drop) and a mobile
 * stage-tabs alternative, sharing the same click-based stage-change flow.
 */
export function Pipeline() {
  const { applicants, updateApplicantStage, markHired, rejectApplicant } = useRecruitmentData()

  const [activeStage, setActiveStage] = useState<ApplicantStage>('Applied')
  const [detailApplicantId, setDetailApplicantId] = useState<string | null>(null)
  const [pendingStageChange, setPendingStageChange] = useState<PendingStageChange | null>(null)
  const [decisionNotes, setDecisionNotes] = useState('')

  const tabListId = useId()

  const grouped = useMemo(() => {
    const map = new Map<ApplicantStage, Applicant[]>(stageOrder.map((stage) => [stage, []]))
    for (const applicant of applicants) {
      map.get(applicant.stage)?.push(applicant)
    }
    return map
  }, [applicants])

  const detailApplicant = detailApplicantId ? (applicants.find((applicant) => applicant.id === detailApplicantId) ?? null) : null

  const handleStageSelect = (applicant: Applicant, stage: ApplicantStage) => {
    if (stage === applicant.stage) return
    if (stage === 'Hired' || stage === 'Rejected') {
      setDecisionNotes('')
      setPendingStageChange({ applicant, stage })
    } else {
      updateApplicantStage(applicant.id, stage)
      setDetailApplicantId(null)
    }
  }

  const handleAdvance = (applicant: Applicant) => {
    const stage = nextStage[applicant.stage]
    if (!stage) return
    updateApplicantStage(applicant.id, stage)
  }

  const confirmStageChange = () => {
    if (!pendingStageChange) return
    const notes = decisionNotes.trim() || undefined
    if (pendingStageChange.stage === 'Hired') {
      markHired(pendingStageChange.applicant.id, notes)
    } else {
      rejectApplicant(pendingStageChange.applicant.id, notes)
    }
    setPendingStageChange(null)
    setDetailApplicantId(null)
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-500">
            {applicants.length} candidate{applicants.length === 1 ? '' : 's'} across the pipeline
          </p>
          <p className="text-xs text-ink-400">Click a candidate to view details or change stage — no drag-and-drop required.</p>
        </div>

        <div className="hidden gap-4 overflow-x-auto pb-2 md:flex" style={{ scrollbarGutter: 'stable' }}>
          {stageOrder.map((stage) => {
            const candidates = grouped.get(stage) ?? []
            return (
              <div key={stage} className="w-72 shrink-0 rounded-2xl border border-ink-200/80 bg-ink-50/50 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold text-ink-900">{stage}</h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-ink-500">{candidates.length}</span>
                </div>
                <div className="space-y-2.5">
                  {candidates.length > 0 ? (
                    candidates.map((applicant) => (
                      <CandidateCard
                        key={applicant.id}
                        applicant={applicant}
                        onOpen={() => setDetailApplicantId(applicant.id)}
                        onAdvance={handleAdvance}
                      />
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-ink-200 p-4 text-center text-xs text-ink-400">No candidates</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="md:hidden">
          <div
            role="tablist"
            aria-label="Pipeline stage"
            id={tabListId}
            className="flex gap-2 overflow-x-auto pb-2"
          >
            {stageOrder.map((stage) => {
              const isActive = stage === activeStage
              const count = grouped.get(stage)?.length ?? 0
              return (
                <button
                  key={stage}
                  type="button"
                  role="tab"
                  id={`${tabListId}-${stage}-tab`}
                  aria-selected={isActive}
                  aria-controls={`${tabListId}-${stage}-panel`}
                  onClick={() => setActiveStage(stage)}
                  className={cn(
                    'shrink-0 rounded-lg px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200',
                    isActive ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
                  )}
                >
                  {stage} <span className="ml-1 text-xs opacity-70">{count}</span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`${tabListId}-${activeStage}-panel`}
            aria-labelledby={`${tabListId}-${activeStage}-tab`}
            className="mt-3 space-y-2.5"
          >
            {(grouped.get(activeStage) ?? []).length > 0 ? (
              (grouped.get(activeStage) ?? []).map((applicant) => (
                <CandidateCard
                  key={applicant.id}
                  applicant={applicant}
                  onOpen={() => setDetailApplicantId(applicant.id)}
                  onAdvance={handleAdvance}
                />
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400">
                No candidates in this stage.
              </p>
            )}
          </div>
        </div>

        <Modal
          open={detailApplicant !== null}
          onClose={() => setDetailApplicantId(null)}
          title={detailApplicant?.name ?? 'Candidate'}
          description={detailApplicant?.positionTitle}
        >
          {detailApplicant ? (
            <div className="space-y-4">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs font-medium text-ink-500">Experience</dt>
                  <dd className="mt-0.5 text-ink-900">{detailApplicant.experienceYears} years</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-500">Applied</dt>
                  <dd className="mt-0.5 text-ink-900">{formatDate(detailApplicant.appliedDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-500">Source</dt>
                  <dd className="mt-0.5 text-ink-900">{detailApplicant.source}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-ink-500">Current stage</dt>
                  <dd className="mt-1">
                    <StatusBadge status={detailApplicant.stage} />
                  </dd>
                </div>
              </dl>

              <label className="block text-sm">
                <span className="mb-1.5 block text-xs font-medium text-ink-500">Move to stage</span>
                <select
                  value={detailApplicant.stage}
                  onChange={(event) => handleStageSelect(detailApplicant, event.target.value as ApplicantStage)}
                  className={demoControlStyles}
                >
                  {stageOrder.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>

              <IntegrationPanel applicant={detailApplicant} />
            </div>
          ) : null}
        </Modal>

        <Modal
          open={pendingStageChange !== null}
          onClose={() => setPendingStageChange(null)}
          title={pendingStageChange?.stage === 'Hired' ? 'Mark as hired?' : 'Reject candidate?'}
          description={
            pendingStageChange
              ? `${pendingStageChange.applicant.name} will be marked ${pendingStageChange.stage.toLowerCase()} for ${pendingStageChange.applicant.positionTitle}.`
              : undefined
          }
        >
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-ink-500">Decision notes (optional)</span>
              <textarea
                rows={2}
                value={decisionNotes}
                onChange={(event) => setDecisionNotes(event.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors duration-200 placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
              />
            </label>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" size="md" onClick={() => setPendingStageChange(null)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={confirmStageChange}
                className={cn(
                  'inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-white transition-colors duration-200 ease-out',
                  pendingStageChange?.stage === 'Hired' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700',
                )}
              >
                {pendingStageChange?.stage === 'Hired' ? 'Confirm hire' : 'Confirm rejection'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}
