import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import type { Applicant, Interview, InterviewFormat, InterviewInput, InterviewStatus } from '../../../data/demos/recruitment/types'

const formatOptions: InterviewFormat[] = ['Video Call', 'Phone', 'In Person']
const statusOptions: InterviewStatus[] = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']

type FieldErrors = Partial<Record<'applicantId' | 'interviewer' | 'date' | 'time', string>>

interface InterviewFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: InterviewInput) => void
  editingInterview: Interview | null
  applicants: Applicant[]
}

/** Schedule/edit dialog for a single interview. No backend — state lives in the shared recruitment store. */
export function InterviewFormModal({ open, onClose, onSubmit, editingInterview, applicants }: InterviewFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingInterview ? 'Edit interview' : 'Schedule interview'}
      description={editingInterview ? `Update details for ${editingInterview.candidateName}.` : 'Set up a new candidate interview.'}
    >
      {open ? (
        <InterviewForm onClose={onClose} onSubmit={onSubmit} editingInterview={editingInterview} applicants={applicants} />
      ) : null}
    </Modal>
  )
}

interface InterviewFormFieldsProps {
  onClose: () => void
  onSubmit: (values: InterviewInput) => void
  editingInterview: Interview | null
  applicants: Applicant[]
}

function InterviewForm({ onClose, onSubmit, editingInterview, applicants }: InterviewFormFieldsProps) {
  const [applicantId, setApplicantId] = useState(editingInterview?.applicantId ?? applicants[0]?.id ?? '')
  const [interviewer, setInterviewer] = useState(editingInterview?.interviewer ?? '')
  const [date, setDate] = useState(editingInterview?.date ?? '')
  const [time, setTime] = useState(editingInterview?.time ?? '')
  const [format, setFormat] = useState<InterviewFormat>(editingInterview?.format ?? 'Video Call')
  const [status, setStatus] = useState<InterviewStatus>(editingInterview?.status ?? 'Scheduled')
  const [notes, setNotes] = useState(editingInterview?.notes ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!applicantId) nextErrors.applicantId = 'Select a candidate.'
    if (!interviewer.trim()) nextErrors.interviewer = 'Enter an interviewer.'
    if (!date) nextErrors.date = 'Select a date.'
    if (!time) nextErrors.time = 'Select a time.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const applicant = applicants.find((item) => item.id === applicantId)

    onSubmit({
      applicantId,
      candidateName: applicant?.name ?? editingInterview?.candidateName ?? '',
      positionTitle: applicant?.positionTitle ?? editingInterview?.positionTitle ?? '',
      interviewer,
      date,
      time,
      format,
      status,
      notes,
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="interview-candidate" label="Candidate" error={errors.applicantId}>
        <select
          id="interview-candidate"
          value={applicantId}
          onChange={(event) => {
            setApplicantId(event.target.value)
            setErrors((current) => ({ ...current, applicantId: undefined }))
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

      <FormField id="interview-interviewer" label="Interviewer" error={errors.interviewer}>
        <input
          id="interview-interviewer"
          type="text"
          value={interviewer}
          onChange={(event) => {
            setInterviewer(event.target.value)
            setErrors((current) => ({ ...current, interviewer: undefined }))
          }}
          aria-invalid={errors.interviewer ? true : undefined}
          className={cn(demoControlStyles, errors.interviewer && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="interview-date" label="Date" error={errors.date}>
          <input
            id="interview-date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              setErrors((current) => ({ ...current, date: undefined }))
            }}
            aria-invalid={errors.date ? true : undefined}
            className={cn(demoControlStyles, errors.date && 'border-red-300')}
          />
        </FormField>
        <FormField id="interview-time" label="Time" error={errors.time}>
          <input
            id="interview-time"
            type="time"
            value={time}
            onChange={(event) => {
              setTime(event.target.value)
              setErrors((current) => ({ ...current, time: undefined }))
            }}
            aria-invalid={errors.time ? true : undefined}
            className={cn(demoControlStyles, errors.time && 'border-red-300')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="interview-format" label="Format">
          <select id="interview-format" value={format} onChange={(event) => setFormat(event.target.value as InterviewFormat)} className={demoControlStyles}>
            {formatOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="interview-status" label="Status">
          <select id="interview-status" value={status} onChange={(event) => setStatus(event.target.value as InterviewStatus)} className={demoControlStyles}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id="interview-notes" label="Notes">
        <textarea
          id="interview-notes"
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
          {editingInterview ? 'Save changes' : 'Schedule interview'}
        </Button>
      </div>
    </form>
  )
}
