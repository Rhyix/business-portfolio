import { useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { cn } from '../../../lib/cn'
import { formatDate } from '../../../lib/format'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { Applicant, Assessment, AssessmentInput, AssessmentStatus, AssessmentType } from '../../../data/demos/recruitment/types'

const typeOptions: AssessmentType[] = ['Technical', 'Behavioral', 'Written', 'Practical']
const statusOptions: AssessmentStatus[] = ['Pending', 'In Progress', 'Completed']

type FieldErrors = Partial<Record<'applicantId', string>>

function AssessmentForm({
  onClose,
  onSubmit,
  editingAssessment,
  applicants,
}: {
  onClose: () => void
  onSubmit: (values: AssessmentInput) => void
  editingAssessment: Assessment | null
  applicants: Applicant[]
}) {
  const [applicantId, setApplicantId] = useState(editingAssessment?.applicantId ?? applicants[0]?.id ?? '')
  const [type, setType] = useState<AssessmentType>(editingAssessment?.type ?? 'Technical')
  const [date, setDate] = useState(editingAssessment?.date ?? '')
  const [score, setScore] = useState(editingAssessment?.score !== null && editingAssessment?.score !== undefined ? String(editingAssessment.score) : '')
  const [status, setStatus] = useState<AssessmentStatus>(editingAssessment?.status ?? 'Pending')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!applicantId) nextErrors.applicantId = 'Select a candidate.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const applicant = applicants.find((item) => item.id === applicantId)

    onSubmit({
      applicantId,
      candidateName: applicant?.name ?? editingAssessment?.candidateName ?? '',
      positionTitle: applicant?.positionTitle ?? editingAssessment?.positionTitle ?? '',
      type,
      date: date || new Date().toISOString().slice(0, 10),
      score: score.trim() ? Math.max(0, Math.min(100, Number(score))) : null,
      status,
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="assessment-candidate" label="Candidate" error={errors.applicantId}>
        <select
          id="assessment-candidate"
          value={applicantId}
          onChange={(event) => {
            setApplicantId(event.target.value)
            setErrors({})
          }}
          aria-invalid={errors.applicantId ? true : undefined}
          className={cn(demoControlStyles, errors.applicantId && 'border-red-300')}
        >
          {applicants.map((applicant) => (
            <option key={applicant.id} value={applicant.id}>
              {applicant.name} · {applicant.positionTitle}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="assessment-type" label="Type">
          <select id="assessment-type" value={type} onChange={(event) => setType(event.target.value as AssessmentType)} className={demoControlStyles}>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="assessment-date" label="Date">
          <input id="assessment-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={demoControlStyles} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="assessment-score" label="Score (out of 100)">
          <input
            id="assessment-score"
            type="number"
            min={0}
            max={100}
            placeholder="e.g. 82"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            className={demoControlStyles}
          />
        </FormField>
        <FormField id="assessment-status" label="Status">
          <select id="assessment-status" value={status} onChange={(event) => setStatus(event.target.value as AssessmentStatus)} className={demoControlStyles}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingAssessment ? 'Save changes' : 'Record assessment'}
        </Button>
      </div>
    </form>
  )
}

/** Assessments: filter by type/status, record and edit scores for candidates. */
export function Assessments() {
  const { assessments, applicants, addAssessment, updateAssessment } = useRecruitmentData()

  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)

  const filteredAssessments = assessments
    .filter((assessment) => (typeFilter === 'All' || assessment.type === typeFilter) && (statusFilter === 'All' || assessment.status === statusFilter))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const openAddModal = () => {
    setEditingAssessment(null)
    setFormOpen(true)
  }

  const openEditModal = (assessment: Assessment) => {
    setEditingAssessment(assessment)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: AssessmentInput) => {
    if (editingAssessment) {
      updateAssessment(editingAssessment.id, values)
    } else {
      addAssessment(values)
    }
    setFormOpen(false)
  }

  const columns: DataTableColumn<Assessment>[] = [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (assessment) => (
        <span>
          <span className="block font-medium text-ink-900">{assessment.candidateName}</span>
          <span className="block text-xs text-ink-500">{assessment.positionTitle}</span>
        </span>
      ),
    },
    { key: 'type', header: 'Type', render: (assessment) => assessment.type },
    { key: 'date', header: 'Date', render: (assessment) => formatDate(assessment.date) },
    {
      key: 'score',
      header: 'Score',
      render: (assessment) => (
        <span className="font-medium text-ink-900">{assessment.score !== null ? `${assessment.score}/100` : '—'}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (assessment) => <StatusBadge status={assessment.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (assessment) => (
        <button
          type="button"
          onClick={() => openEditModal(assessment)}
          aria-label={`Edit ${assessment.candidateName}'s assessment`}
          className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredAssessments.length} assessment{filteredAssessments.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Record assessment
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <FilterDropdown label="Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} className="sm:w-44" />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="sm:w-44" />
      </div>

      <DataTable
        columns={columns}
        rows={filteredAssessments}
        rowKey={(assessment) => assessment.id}
        emptyTitle="No assessments found"
        emptyMessage="Try a different filter."
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingAssessment ? 'Edit assessment' : 'Record assessment'}
        description={editingAssessment ? `Update details for ${editingAssessment.candidateName}.` : 'Log a new candidate assessment.'}
      >
        {formOpen ? (
          <AssessmentForm onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingAssessment={editingAssessment} applicants={applicants} />
        ) : null}
      </Modal>
    </div>
  )
}
