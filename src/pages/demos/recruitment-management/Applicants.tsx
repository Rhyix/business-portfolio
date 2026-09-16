import { useId, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, GraduationCap, Mail, Pencil, Phone, Plus, UserRound } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { cn } from '../../../lib/cn'
import { formatDate } from '../../../lib/format'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { Applicant, ApplicantInput, ApplicantStage } from '../../../data/demos/recruitment/types'
import { ApplicantFormModal } from './ApplicantFormModal'

const PAGE_SIZE = 8

const stageOptions: ApplicantStage[] = ['Applied', 'Screening', 'Interview', 'Assessment', 'Shortlisted', 'Hired', 'Rejected']

type SortKey = 'newest' | 'name' | 'experience'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Sort: Newest first' },
  { value: 'name', label: 'Sort: Name A–Z' },
  { value: 'experience', label: 'Sort: Most experienced' },
]

function matchesSearch(applicant: Applicant, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    applicant.name.toLowerCase().includes(needle) ||
    applicant.positionTitle.toLowerCase().includes(needle) ||
    applicant.id.toLowerCase().includes(needle) ||
    applicant.email.toLowerCase().includes(needle)
  )
}

interface PendingStageChange {
  applicant: Applicant
  stage: 'Hired' | 'Rejected'
}

/** Applicants: search, position/stage/source filters, sort, pagination, rich detail view, edit and stage-change. */
export function Applicants() {
  const {
    applicants,
    vacancies,
    interviews,
    assessments,
    evaluations,
    addApplicant,
    updateApplicant,
    updateApplicantStage,
    markHired,
    rejectApplicant,
  } = useRecruitmentData()

  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('All')
  const [stageFilter, setStageFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null)
  const [detailApplicantId, setDetailApplicantId] = useState<string | null>(null)
  const [pendingStageChange, setPendingStageChange] = useState<PendingStageChange | null>(null)
  const [decisionNotes, setDecisionNotes] = useState('')

  const sortSelectId = useId()

  const positions = useMemo(() => Array.from(new Set(applicants.map((applicant) => applicant.positionTitle))).sort(), [applicants])
  const sources = useMemo(() => Array.from(new Set(applicants.map((applicant) => applicant.source))).sort(), [applicants])

  const filteredApplicants = useMemo(() => {
    const filtered = applicants.filter(
      (applicant) =>
        (positionFilter === 'All' || applicant.positionTitle === positionFilter) &&
        (stageFilter === 'All' || applicant.stage === stageFilter) &&
        (sourceFilter === 'All' || applicant.source === sourceFilter) &&
        matchesSearch(applicant, searchTerm),
    )

    const sorted = [...filtered]
    if (sortKey === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortKey === 'experience') {
      sorted.sort((a, b) => b.experienceYears - a.experienceYears)
    } else {
      sorted.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    }
    return sorted
  }, [applicants, searchTerm, positionFilter, stageFilter, sourceFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredApplicants.slice(pageStart, pageStart + PAGE_SIZE)

  const detailApplicant = detailApplicantId ? (applicants.find((applicant) => applicant.id === detailApplicantId) ?? null) : null

  const resetToFirstPage = () => setPage(1)

  const openAddModal = () => {
    setEditingApplicant(null)
    setFormOpen(true)
  }

  const openEditModal = (applicant: Applicant) => {
    setEditingApplicant(applicant)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: ApplicantInput) => {
    if (editingApplicant) {
      updateApplicant(editingApplicant.id, values)
    } else {
      addApplicant(values)
    }
    setFormOpen(false)
  }

  const handleStageSelect = (applicant: Applicant, stage: ApplicantStage) => {
    if (stage === applicant.stage) return
    if (stage === 'Hired' || stage === 'Rejected') {
      setDecisionNotes('')
      setPendingStageChange({ applicant, stage })
    } else {
      updateApplicantStage(applicant.id, stage)
    }
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
  }

  const applicantInterviews = detailApplicant ? interviews.filter((interview) => interview.applicantId === detailApplicant.id) : []
  const applicantAssessments = detailApplicant ? assessments.filter((assessment) => assessment.applicantId === detailApplicant.id) : []
  const applicantEvaluations = detailApplicant ? evaluations.filter((evaluation) => evaluation.applicantId === detailApplicant.id) : []

  const columns: DataTableColumn<Applicant>[] = [
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
          <span className="block text-xs font-normal text-ink-500">{applicant.id}</span>
        </button>
      ),
    },
    { key: 'position', header: 'Position', render: (applicant) => applicant.positionTitle },
    { key: 'applied', header: 'Applied', render: (applicant) => formatDate(applicant.appliedDate) },
    { key: 'experience', header: 'Experience', render: (applicant) => `${applicant.experienceYears} yrs` },
    { key: 'source', header: 'Source', render: (applicant) => applicant.source },
    { key: 'stage', header: 'Stage', render: (applicant) => <StatusBadge status={applicant.stage} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (applicant) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(applicant)}
            aria-label={`Edit ${applicant.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredApplicants.length} applicant{filteredApplicants.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add applicant
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value)
            resetToFirstPage()
          }}
          placeholder="Search applicants by name, position or email…"
          aria-label="Search applicants"
          className="lg:max-w-sm"
        />
        <FilterDropdown
          label="Position"
          value={positionFilter}
          options={positions}
          onChange={(value) => {
            setPositionFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-52"
        />
        <FilterDropdown
          label="Stage"
          value={stageFilter}
          options={stageOptions}
          onChange={(value) => {
            setStageFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-40"
        />
        <FilterDropdown
          label="Source"
          value={sourceFilter}
          options={sources}
          onChange={(value) => {
            setSourceFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-44"
        />
        <div className="relative lg:w-52">
          <label htmlFor={sortSelectId} className="sr-only">
            Sort applicants
          </label>
          <select
            id={sortSelectId}
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="h-10 w-full appearance-none rounded-lg border border-ink-200 bg-white py-2 pr-9 pl-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(applicant) => applicant.id}
        emptyTitle="No applicants found"
        emptyMessage="Try a different search term or filter."
      />

      {filteredApplicants.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredApplicants.length)} of{' '}
            {filteredApplicants.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="text-xs font-medium text-ink-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <ApplicantFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingApplicant={editingApplicant}
        vacancies={vacancies}
      />

      <Modal
        open={detailApplicant !== null}
        onClose={() => setDetailApplicantId(null)}
        title="Applicant details"
        description={detailApplicant?.id}
        className="max-w-2xl"
      >
        {detailApplicant ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-600">
                  <UserRound className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{detailApplicant.name}</p>
                  <p className="truncate text-xs text-ink-500">{detailApplicant.positionTitle}</p>
                </div>
              </div>
              <StatusBadge status={detailApplicant.stage} />
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Email</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-ink-900">
                  <Mail className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  <span className="truncate">{detailApplicant.email}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Phone</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-ink-900">
                  <Phone className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  {detailApplicant.phone}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Experience</dt>
                <dd className="mt-0.5 text-ink-900">{detailApplicant.experienceYears} years</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Source</dt>
                <dd className="mt-0.5 text-ink-900">{detailApplicant.source}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Applied</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailApplicant.appliedDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Education</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-ink-900">
                  <GraduationCap className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  <span className="truncate">{detailApplicant.education}</span>
                </dd>
              </div>
            </dl>

            <div>
              <dt className="text-xs font-medium text-ink-500">Experience summary</dt>
              <p className="mt-1 text-sm text-ink-800">{detailApplicant.experienceSummary}</p>
            </div>

            <div>
              <dt className="mb-2 text-xs font-medium text-ink-500">Skills</dt>
              <div className="flex flex-wrap gap-1.5">
                {detailApplicant.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="mb-1.5 text-xs font-medium text-ink-500">Interviews</dt>
                {applicantInterviews.length > 0 ? (
                  <ul className="space-y-1 text-xs text-ink-700">
                    {applicantInterviews.map((interview) => (
                      <li key={interview.id}>
                        {formatDate(interview.date)} — {interview.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ink-400">None scheduled</p>
                )}
              </div>
              <div>
                <dt className="mb-1.5 text-xs font-medium text-ink-500">Assessments</dt>
                {applicantAssessments.length > 0 ? (
                  <ul className="space-y-1 text-xs text-ink-700">
                    {applicantAssessments.map((assessment) => (
                      <li key={assessment.id}>
                        {assessment.type} — {assessment.score !== null ? `${assessment.score}/100` : assessment.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ink-400">None recorded</p>
                )}
              </div>
              <div>
                <dt className="mb-1.5 text-xs font-medium text-ink-500">Evaluations</dt>
                {applicantEvaluations.length > 0 ? (
                  <ul className="space-y-1 text-xs text-ink-700">
                    {applicantEvaluations.map((evaluation) => (
                      <li key={evaluation.id}>{evaluation.recommendation}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ink-400">None recorded</p>
                )}
              </div>
            </div>

            <div>
              <dt className="mb-2 text-xs font-medium text-ink-500">Activity timeline</dt>
              <ul className="space-y-2 border-l border-ink-200 pl-4">
                {detailApplicant.timeline
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <li key={entry.id} className="text-sm">
                      <p className="text-ink-800">{entry.message}</p>
                      <p className="text-xs text-ink-400">{formatDate(entry.date)}</p>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-ink-100 pt-4">
              <label className="text-sm">
                <span className="mb-1.5 block text-xs font-medium text-ink-500">Move to stage</span>
                <select
                  value={detailApplicant.stage}
                  onChange={(event) => handleStageSelect(detailApplicant, event.target.value as ApplicantStage)}
                  className={demoControlStyles}
                >
                  {stageOptions.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>
              <Button type="button" variant="secondary" size="md" onClick={() => openEditModal(detailApplicant)}>
                Edit applicant
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={pendingStageChange !== null}
        onClose={() => setPendingStageChange(null)}
        title={pendingStageChange?.stage === 'Hired' ? 'Mark as hired?' : 'Reject applicant?'}
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
  )
}
