import { useId, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatDate, formatNumber } from '../../../lib/format'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { Vacancy, VacancyInput } from '../../../data/demos/recruitment/types'
import { VacancyFormModal } from './VacancyFormModal'

const PAGE_SIZE = 8

type SortKey = 'newest' | 'title' | 'applicants'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Sort: Newest first' },
  { value: 'title', label: 'Sort: Title A–Z' },
  { value: 'applicants', label: 'Sort: Most applicants' },
]

function matchesSearch(vacancy: Vacancy, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    vacancy.title.toLowerCase().includes(needle) ||
    vacancy.department.toLowerCase().includes(needle) ||
    vacancy.location.toLowerCase().includes(needle) ||
    vacancy.id.toLowerCase().includes(needle)
  )
}

/** Job vacancies: search, department/status/employment-type filters, sort, pagination and CRUD. */
export function Vacancies() {
  const { vacancies, applicants, addVacancy, updateVacancy, deleteVacancy } = useRecruitmentData()

  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Vacancy | null>(null)

  const sortSelectId = useId()

  const departments = useMemo(() => Array.from(new Set(vacancies.map((vacancy) => vacancy.department))).sort(), [vacancies])
  const statuses = useMemo(() => Array.from(new Set(vacancies.map((vacancy) => vacancy.status))).sort(), [vacancies])
  const employmentTypes = useMemo(() => Array.from(new Set(vacancies.map((vacancy) => vacancy.employmentType))).sort(), [vacancies])

  const applicantCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const applicant of applicants) {
      counts.set(applicant.vacancyId, (counts.get(applicant.vacancyId) ?? 0) + 1)
    }
    return counts
  }, [applicants])

  const filteredVacancies = useMemo(() => {
    const filtered = vacancies.filter(
      (vacancy) =>
        (departmentFilter === 'All' || vacancy.department === departmentFilter) &&
        (statusFilter === 'All' || vacancy.status === statusFilter) &&
        (typeFilter === 'All' || vacancy.employmentType === typeFilter) &&
        matchesSearch(vacancy, searchTerm),
    )

    const sorted = [...filtered]
    if (sortKey === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortKey === 'applicants') {
      sorted.sort((a, b) => (applicantCounts.get(b.id) ?? 0) - (applicantCounts.get(a.id) ?? 0))
    } else {
      sorted.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    }
    return sorted
  }, [vacancies, searchTerm, departmentFilter, statusFilter, typeFilter, sortKey, applicantCounts])

  const totalPages = Math.max(1, Math.ceil(filteredVacancies.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredVacancies.slice(pageStart, pageStart + PAGE_SIZE)

  const resetToFirstPage = () => setPage(1)

  const openAddModal = () => {
    setEditingVacancy(null)
    setFormOpen(true)
  }

  const openEditModal = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: VacancyInput) => {
    if (editingVacancy) {
      updateVacancy(editingVacancy.id, values)
    } else {
      addVacancy(values)
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteVacancy(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns: DataTableColumn<Vacancy>[] = [
    {
      key: 'title',
      header: 'Position',
      render: (vacancy) => (
        <span>
          <span className="block font-medium text-ink-900">{vacancy.title}</span>
          <span className="block text-xs text-ink-500">{vacancy.id}</span>
        </span>
      ),
    },
    { key: 'department', header: 'Department', render: (vacancy) => vacancy.department },
    { key: 'type', header: 'Type', render: (vacancy) => vacancy.employmentType },
    { key: 'location', header: 'Location', render: (vacancy) => vacancy.location },
    { key: 'posted', header: 'Posted', render: (vacancy) => formatDate(vacancy.postedDate) },
    {
      key: 'applicants',
      header: 'Applicants',
      render: (vacancy) => <span className="font-medium text-ink-900">{formatNumber(applicantCounts.get(vacancy.id) ?? 0)}</span>,
    },
    { key: 'status', header: 'Status', render: (vacancy) => <StatusBadge status={vacancy.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (vacancy) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(vacancy)}
            aria-label={`Edit ${vacancy.title}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(vacancy)}
            aria-label={`Remove ${vacancy.title}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredVacancies.length} vacanc{filteredVacancies.length === 1 ? 'y' : 'ies'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Create vacancy
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value)
            resetToFirstPage()
          }}
          placeholder="Search vacancies by title, department or location…"
          aria-label="Search vacancies"
          className="lg:max-w-sm"
        />
        <FilterDropdown
          label="Department"
          value={departmentFilter}
          options={departments}
          onChange={(value) => {
            setDepartmentFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-44"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={statuses}
          onChange={(value) => {
            setStatusFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-40"
        />
        <FilterDropdown
          label="Type"
          value={typeFilter}
          options={employmentTypes}
          onChange={(value) => {
            setTypeFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-40"
        />
        <div className="relative lg:w-52">
          <label htmlFor={sortSelectId} className="sr-only">
            Sort vacancies
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
        rowKey={(vacancy) => vacancy.id}
        emptyTitle="No vacancies found"
        emptyMessage="Try a different search term or filter."
      />

      {filteredVacancies.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredVacancies.length)} of{' '}
            {filteredVacancies.length}
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

      <VacancyFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingVacancy={editingVacancy} />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete vacancy?"
        description={
          deleteTarget ? `${deleteTarget.title} will be removed from this demo. This cannot be undone.` : undefined
        }
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
