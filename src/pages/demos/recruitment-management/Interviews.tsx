import { useId, useMemo, useState } from 'react'
import { Calendar, Eye, Pencil, Plus, Video, X } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { Interview, InterviewInput } from '../../../data/demos/recruitment/types'
import { InterviewFormModal } from './InterviewFormModal'

const statusOptions = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']
const formatOptions = ['Video Call', 'Phone', 'In Person']

function matchesSearch(interview: Interview, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    interview.candidateName.toLowerCase().includes(needle) ||
    interview.positionTitle.toLowerCase().includes(needle) ||
    interview.interviewer.toLowerCase().includes(needle)
  )
}

/** Interviews: search, status/format filters, date filter, schedule/edit/view/cancel-with-confirmation. */
export function Interviews() {
  const { interviews, applicants, addInterview, updateInterview } = useRecruitmentData()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [formatFilter, setFormatFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [detailInterviewId, setDetailInterviewId] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Interview | null>(null)

  const dateFilterId = useId()

  const detailInterview = detailInterviewId ? (interviews.find((interview) => interview.id === detailInterviewId) ?? null) : null

  const filteredInterviews = useMemo(() => {
    return interviews
      .filter(
        (interview) =>
          (statusFilter === 'All' || interview.status === statusFilter) &&
          (formatFilter === 'All' || interview.format === formatFilter) &&
          (!dateFilter || interview.date === dateFilter) &&
          matchesSearch(interview, searchTerm),
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [interviews, searchTerm, statusFilter, formatFilter, dateFilter])

  const openAddModal = () => {
    setEditingInterview(null)
    setFormOpen(true)
  }

  const openEditModal = (interview: Interview) => {
    setEditingInterview(interview)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: InterviewInput) => {
    if (editingInterview) {
      updateInterview(editingInterview.id, values)
    } else {
      addInterview(values)
    }
    setFormOpen(false)
  }

  const confirmCancel = () => {
    if (!cancelTarget) return
    updateInterview(cancelTarget.id, {
      applicantId: cancelTarget.applicantId,
      candidateName: cancelTarget.candidateName,
      positionTitle: cancelTarget.positionTitle,
      interviewer: cancelTarget.interviewer,
      date: cancelTarget.date,
      time: cancelTarget.time,
      format: cancelTarget.format,
      status: 'Cancelled',
      notes: cancelTarget.notes,
    })
    setCancelTarget(null)
  }

  const columns: DataTableColumn<Interview>[] = [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (interview) => (
        <button type="button" onClick={() => setDetailInterviewId(interview.id)} className="block text-left font-medium text-ink-900 hover:text-accent-600">
          {interview.candidateName}
          <span className="block text-xs font-normal text-ink-500">{interview.positionTitle}</span>
        </button>
      ),
    },
    { key: 'interviewer', header: 'Interviewer', render: (interview) => interview.interviewer },
    { key: 'date', header: 'Date & time', render: (interview) => `${formatDate(interview.date)} · ${interview.time}` },
    { key: 'format', header: 'Format', render: (interview) => interview.format },
    { key: 'status', header: 'Status', render: (interview) => <StatusBadge status={interview.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (interview) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDetailInterviewId(interview.id)}
            aria-label={`View ${interview.candidateName}'s interview`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Eye className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => openEditModal(interview)}
            aria-label={`Edit ${interview.candidateName}'s interview`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          {interview.status === 'Scheduled' || interview.status === 'Rescheduled' ? (
            <button
              type="button"
              onClick={() => setCancelTarget(interview)}
              aria-label={`Cancel ${interview.candidateName}'s interview`}
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredInterviews.length} interview{filteredInterviews.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Schedule interview
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by candidate, position or interviewer…"
          aria-label="Search interviews"
          className="lg:max-w-sm"
        />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="lg:w-40" />
        <FilterDropdown label="Format" value={formatFilter} options={formatOptions} onChange={setFormatFilter} className="lg:w-40" />
        <div className="lg:w-44">
          <label htmlFor={dateFilterId} className="sr-only">
            Filter by date
          </label>
          <input
            id={dateFilterId}
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
          />
        </div>
        {dateFilter ? (
          <button type="button" onClick={() => setDateFilter('')} className="text-xs font-medium text-accent-600 hover:text-accent-700">
            Clear date
          </button>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        rows={filteredInterviews}
        rowKey={(interview) => interview.id}
        emptyTitle="No interviews found"
        emptyMessage="Try a different search term or filter."
      />

      <InterviewFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingInterview={editingInterview}
        applicants={applicants}
      />

      <Modal
        open={detailInterview !== null}
        onClose={() => setDetailInterviewId(null)}
        title="Interview details"
        description={detailInterview?.candidateName}
      >
        {detailInterview ? (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Position</dt>
                <dd className="mt-0.5 text-ink-900">{detailInterview.positionTitle}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Interviewer</dt>
                <dd className="mt-0.5 text-ink-900">{detailInterview.interviewer}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Date &amp; time</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-ink-900">
                  <Calendar className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  {formatDate(detailInterview.date)} · {detailInterview.time}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Format</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-ink-900">
                  <Video className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  {detailInterview.format}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={detailInterview.status} />
                </dd>
              </div>
            </dl>
            {detailInterview.notes ? (
              <div>
                <dt className="text-xs font-medium text-ink-500">Notes</dt>
                <p className="mt-1 text-sm text-ink-800">{detailInterview.notes}</p>
              </div>
            ) : null}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  const interview = detailInterview
                  setDetailInterviewId(null)
                  openEditModal(interview)
                }}
              >
                Edit interview
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        title="Cancel interview?"
        description={
          cancelTarget
            ? `${cancelTarget.candidateName}'s interview on ${formatDate(cancelTarget.date)} will be marked cancelled.`
            : undefined
        }
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setCancelTarget(null)}>
            Keep interview
          </Button>
          <button
            type="button"
            onClick={confirmCancel}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Cancel interview
          </button>
        </div>
      </Modal>
    </div>
  )
}
