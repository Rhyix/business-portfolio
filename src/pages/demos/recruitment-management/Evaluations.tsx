import { useState } from 'react'
import type { FormEvent } from 'react'
import { Pencil, Plus, Star } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { cn } from '../../../lib/cn'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { Applicant, Evaluation, EvaluationInput, Recommendation } from '../../../data/demos/recruitment/types'

const recommendationOptions: Recommendation[] = ['Strongly Recommend', 'Recommend', 'Needs Review', 'Do Not Recommend']

const scoreDimensions: { key: keyof Pick<EvaluationInput, 'communication' | 'technicalSkills' | 'problemSolving' | 'cultureFit'>; label: string }[] = [
  { key: 'communication', label: 'Communication' },
  { key: 'technicalSkills', label: 'Technical skills' },
  { key: 'problemSolving', label: 'Problem solving' },
  { key: 'cultureFit', label: 'Culture / team fit' },
]

function ScoreStars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span aria-hidden="true" className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} className={cn('size-3.5', index < value ? 'fill-accent-500 text-accent-500' : 'text-ink-200')} />
        ))}
      </span>
      <span className="sr-only">{value} out of 5</span>
    </span>
  )
}

type FieldErrors = Partial<Record<'applicantId', string>>

function EvaluationForm({
  onClose,
  onSubmit,
  editingEvaluation,
  applicants,
}: {
  onClose: () => void
  onSubmit: (values: EvaluationInput) => void
  editingEvaluation: Evaluation | null
  applicants: Applicant[]
}) {
  const [applicantId, setApplicantId] = useState(editingEvaluation?.applicantId ?? applicants[0]?.id ?? '')
  const [communication, setCommunication] = useState(editingEvaluation?.communication ?? 3)
  const [technicalSkills, setTechnicalSkills] = useState(editingEvaluation?.technicalSkills ?? 3)
  const [problemSolving, setProblemSolving] = useState(editingEvaluation?.problemSolving ?? 3)
  const [cultureFit, setCultureFit] = useState(editingEvaluation?.cultureFit ?? 3)
  const [recommendation, setRecommendation] = useState<Recommendation>(editingEvaluation?.recommendation ?? 'Recommend')
  const [notes, setNotes] = useState(editingEvaluation?.notes ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const scores: Record<string, [number, (value: number) => void]> = {
    communication: [communication, setCommunication],
    technicalSkills: [technicalSkills, setTechnicalSkills],
    problemSolving: [problemSolving, setProblemSolving],
    cultureFit: [cultureFit, setCultureFit],
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!applicantId) nextErrors.applicantId = 'Select a candidate.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const applicant = applicants.find((item) => item.id === applicantId)

    onSubmit({
      applicantId,
      candidateName: applicant?.name ?? editingEvaluation?.candidateName ?? '',
      positionTitle: applicant?.positionTitle ?? editingEvaluation?.positionTitle ?? '',
      communication,
      technicalSkills,
      problemSolving,
      cultureFit,
      recommendation,
      notes,
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="evaluation-candidate" label="Candidate" error={errors.applicantId}>
        <select
          id="evaluation-candidate"
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
        {scoreDimensions.map((dimension) => {
          const [value, setValue] = scores[dimension.key]
          return (
            <FormField key={dimension.key} id={`evaluation-${dimension.key}`} label={`${dimension.label} (1–5)`}>
              <select
                id={`evaluation-${dimension.key}`}
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
                className={demoControlStyles}
              >
                {[1, 2, 3, 4, 5].map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </FormField>
          )
        })}
      </div>

      <FormField id="evaluation-recommendation" label="Recommendation">
        <select
          id="evaluation-recommendation"
          value={recommendation}
          onChange={(event) => setRecommendation(event.target.value as Recommendation)}
          className={demoControlStyles}
        >
          {recommendationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="evaluation-notes" label="Notes">
        <textarea
          id="evaluation-notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors duration-200 placeholder:text-ink-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingEvaluation ? 'Save changes' : 'Add evaluation'}
        </Button>
      </div>
    </form>
  )
}

/** Evaluations: 1-5 scoring across four dimensions plus an overall recommendation. */
export function Evaluations() {
  const { evaluations, applicants, addEvaluation, updateEvaluation } = useRecruitmentData()

  const [recommendationFilter, setRecommendationFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null)

  const filteredEvaluations = evaluations.filter(
    (evaluation) => recommendationFilter === 'All' || evaluation.recommendation === recommendationFilter,
  )

  const openAddModal = () => {
    setEditingEvaluation(null)
    setFormOpen(true)
  }

  const openEditModal = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: EvaluationInput) => {
    if (editingEvaluation) {
      updateEvaluation(editingEvaluation.id, values)
    } else {
      addEvaluation(values)
    }
    setFormOpen(false)
  }

  const columns: DataTableColumn<Evaluation>[] = [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (evaluation) => (
        <span>
          <span className="block font-medium text-ink-900">{evaluation.candidateName}</span>
          <span className="block text-xs text-ink-500">{evaluation.positionTitle}</span>
        </span>
      ),
    },
    { key: 'communication', header: 'Communication', render: (evaluation) => <ScoreStars value={evaluation.communication} /> },
    { key: 'technical', header: 'Technical', render: (evaluation) => <ScoreStars value={evaluation.technicalSkills} /> },
    { key: 'problem', header: 'Problem solving', render: (evaluation) => <ScoreStars value={evaluation.problemSolving} /> },
    { key: 'culture', header: 'Culture fit', render: (evaluation) => <ScoreStars value={evaluation.cultureFit} /> },
    { key: 'recommendation', header: 'Recommendation', render: (evaluation) => <StatusBadge status={evaluation.recommendation} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (evaluation) => (
        <button
          type="button"
          onClick={() => openEditModal(evaluation)}
          aria-label={`Edit ${evaluation.candidateName}'s evaluation`}
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
          {filteredEvaluations.length} evaluation{filteredEvaluations.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add evaluation
        </Button>
      </div>

      <FilterDropdown
        label="Recommendation"
        value={recommendationFilter}
        options={recommendationOptions}
        onChange={setRecommendationFilter}
        className="sm:w-56"
      />

      <DataTable
        columns={columns}
        rows={filteredEvaluations}
        rowKey={(evaluation) => evaluation.id}
        emptyTitle="No evaluations found"
        emptyMessage="Try a different filter."
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingEvaluation ? 'Edit evaluation' : 'Add evaluation'}
        description={editingEvaluation ? `Update details for ${editingEvaluation.candidateName}.` : 'Score a candidate across four dimensions.'}
      >
        {formOpen ? (
          <EvaluationForm onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingEvaluation={editingEvaluation} applicants={applicants} />
        ) : null}
      </Modal>
    </div>
  )
}
