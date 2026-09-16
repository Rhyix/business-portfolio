import { useId, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Briefcase, Calendar, Users } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Tag } from '../../../components/ui/Tag'
import { formatDate } from '../../../lib/format'
import { applicants as initialApplicants, interviewSchedule, jobOpenings } from '../../../data/demos/human-resources/recruitment'
import type { Applicant, ApplicantStatus } from '../../../data/demos/human-resources/types'
import { useOptionalIntegratedData } from '../../../data/demos/integrated/context'
import { cn } from '../../../lib/cn'

type RecruitmentTab = 'openings' | 'applicants' | 'interviews'

const tabs: { key: RecruitmentTab; label: string; icon: typeof Briefcase }[] = [
  { key: 'openings', label: 'Open Positions', icon: Briefcase },
  { key: 'applicants', label: 'Applicants', icon: Users },
  { key: 'interviews', label: 'Interviews', icon: Calendar },
]

const APPLICANT_STATUS_OPTIONS: ApplicantStatus[] = [
  'Applied',
  'Screening',
  'Interview',
  'Shortlisted',
  'Rejected',
  'Hired',
]

const openingColumns: DataTableColumn<(typeof jobOpenings)[number]>[] = [
  { key: 'title', header: 'Position', render: (job) => <span className="font-medium text-ink-900">{job.title}</span> },
  { key: 'department', header: 'Department', render: (job) => job.department },
  { key: 'type', header: 'Employment Type', render: (job) => <Tag>{job.employmentType}</Tag> },
  { key: 'location', header: 'Location', render: (job) => job.location },
  { key: 'openings', header: 'Openings', render: (job) => job.openings },
  { key: 'status', header: 'Status', render: (job) => <StatusBadge status={job.status} /> },
  { key: 'posted', header: 'Posted', render: (job) => formatDate(job.postedDate) },
]

const interviewColumns: DataTableColumn<(typeof interviewSchedule)[number]>[] = [
  { key: 'applicant', header: 'Applicant', render: (interview) => <span className="font-medium text-ink-900">{interview.applicantName}</span> },
  { key: 'position', header: 'Position', render: (interview) => interview.positionTitle },
  { key: 'date', header: 'Date', render: (interview) => formatDate(interview.date) },
  { key: 'time', header: 'Time', render: (interview) => interview.time },
  { key: 'interviewer', header: 'Interviewer', render: (interview) => interview.interviewer },
  { key: 'mode', header: 'Mode', render: (interview) => <Tag>{interview.mode}</Tag> },
]

function matchesSearch(applicant: Applicant, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return applicant.name.toLowerCase().includes(needle) || applicant.positionTitle.toLowerCase().includes(needle)
}

/**
 * HRMS recruitment module: open positions, an applicant pipeline and an
 * interview schedule. Uses the shared integrated-platform store when
 * available — moving an applicant to "Hired" then creates a matching
 * Employee record automatically (see the store's updateApplicantStatus).
 */
export function Recruitment() {
  const shared = useOptionalIntegratedData()
  const [activeTab, setActiveTab] = useState<RecruitmentTab>('openings')
  const [localApplicants, setLocalApplicants] = useState<Applicant[]>(initialApplicants)
  const applicants = shared ? shared.applicants : localApplicants
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [positionFilter, setPositionFilter] = useState('All')
  const [detailApplicantId, setDetailApplicantId] = useState<string | null>(null)
  const tabListId = useId()
  const statusSelectId = useId()

  const detailApplicant = applicants.find((applicant) => applicant.id === detailApplicantId) ?? null

  const positions = useMemo(
    () => Array.from(new Set(applicants.map((applicant) => applicant.positionTitle))).sort(),
    [applicants],
  )

  const filteredApplicants = useMemo(() => {
    return applicants.filter(
      (applicant) =>
        (statusFilter === 'All' || applicant.status === statusFilter) &&
        (positionFilter === 'All' || applicant.positionTitle === positionFilter) &&
        matchesSearch(applicant, searchTerm),
    )
  }, [applicants, searchTerm, statusFilter, positionFilter])

  const applicantColumns: DataTableColumn<Applicant>[] = [
    {
      key: 'name',
      header: 'Applicant',
      render: (applicant) => (
        <button
          type="button"
          onClick={() => setDetailApplicantId(applicant.id)}
          className="font-medium text-ink-900 hover:text-accent-700 hover:underline"
        >
          {applicant.name}
        </button>
      ),
    },
    { key: 'position', header: 'Position', render: (applicant) => applicant.positionTitle },
    { key: 'applied', header: 'Applied', render: (applicant) => formatDate(applicant.appliedDate) },
    { key: 'status', header: 'Status', render: (applicant) => <StatusBadge status={applicant.status} /> },
  ]

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!detailApplicant) return
    const nextStatus = event.target.value as ApplicantStatus
    if (shared) {
      shared.updateApplicantStatus(detailApplicant.id, nextStatus)
    } else {
      setLocalApplicants((current) =>
        current.map((applicant) =>
          applicant.id === detailApplicant.id ? { ...applicant, status: nextStatus } : applicant,
        ),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Recruitment sections" id={tabListId} className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.key === activeTab

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
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'openings' ? (
        <div role="tabpanel" id={`${tabListId}-openings-panel`} aria-labelledby={`${tabListId}-openings-tab`}>
          <DataTable
            columns={openingColumns}
            rows={shared ? shared.jobOpenings : jobOpenings}
            rowKey={(job) => job.id}
          />
        </div>
      ) : null}

      {activeTab === 'applicants' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-applicants-panel`}
          aria-labelledby={`${tabListId}-applicants-tab`}
          className="space-y-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by applicant or position…"
              aria-label="Search applicants"
              className="sm:max-w-sm"
            />
            <FilterDropdown
              label="Status"
              value={statusFilter}
              options={APPLICANT_STATUS_OPTIONS}
              onChange={setStatusFilter}
              className="sm:w-44"
            />
            <FilterDropdown
              label="Position"
              value={positionFilter}
              options={positions}
              onChange={setPositionFilter}
              className="sm:w-56"
            />
          </div>

          <DataTable
            columns={applicantColumns}
            rows={filteredApplicants}
            rowKey={(applicant) => applicant.id}
            emptyTitle="No applicants found"
            emptyMessage="Try a different search term or filter."
          />
        </div>
      ) : null}

      {activeTab === 'interviews' ? (
        <div role="tabpanel" id={`${tabListId}-interviews-panel`} aria-labelledby={`${tabListId}-interviews-tab`}>
          <DataTable
            columns={interviewColumns}
            rows={shared ? shared.interviews : interviewSchedule}
            rowKey={(interview) => interview.id}
          />
        </div>
      ) : null}

      <Modal
        open={detailApplicant !== null}
        onClose={() => setDetailApplicantId(null)}
        title="Applicant details"
        description={detailApplicant?.positionTitle}
      >
        {detailApplicant ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-ink-900">{detailApplicant.name}</p>
              <p className="text-xs text-ink-500">Applied {formatDate(detailApplicant.appliedDate)}</p>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-ink-200/80 p-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Email</dt>
                <dd className="mt-0.5 text-ink-900">{detailApplicant.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Phone</dt>
                <dd className="mt-0.5 text-ink-900">{detailApplicant.phone}</dd>
              </div>
            </dl>

            <div>
              <label htmlFor={statusSelectId} className="mb-1.5 block text-xs font-medium text-ink-600">
                Application status
              </label>
              <select
                id={statusSelectId}
                value={detailApplicant.status}
                onChange={handleStatusChange}
                className={demoControlStyles}
              >
                {APPLICANT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-ink-400">
                {shared
                  ? "Updating this selector changes the applicant's status immediately. Marking an applicant Hired also adds them to Employees."
                  : "Updating this selector changes the applicant's status immediately in this demo session."}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
