import { useId, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, Trash2, UserRound } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Tag } from '../../../components/ui/Tag'
import { Button } from '../../../components/ui/Button'
import { Link } from '../../../lib/router'
import { formatDate } from '../../../lib/format'
import { employees as initialEmployees } from '../../../data/demos/human-resources/employees'
import { recentActivity } from '../../../data/demos/human-resources/dashboard'
import type { Employee, EmployeeStatus, EmploymentType } from '../../../data/demos/human-resources/types'
import { useOptionalIntegratedData } from '../../../data/demos/integrated/context'
import { basePath as recruitmentBasePath } from '../../../data/demos/recruitment/navigation'
import { EmployeeFormModal } from './EmployeeFormModal'
import type { EmployeeFormValues } from './EmployeeFormModal'

const PAGE_SIZE = 8
const STATUS_OPTIONS: EmployeeStatus[] = ['Active', 'On Leave', 'Inactive']
const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = ['Full-time', 'Part-time', 'Contract']

type SortOption = 'name-asc' | 'joined-newest' | 'joined-oldest'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'joined-newest', label: 'Joined (newest first)' },
  { value: 'joined-oldest', label: 'Joined (oldest first)' },
]

function matchesSearch(employee: Employee, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    employee.name.toLowerCase().includes(needle) ||
    employee.position.toLowerCase().includes(needle) ||
    employee.email.toLowerCase().includes(needle)
  )
}

function sortEmployees(list: Employee[], sort: SortOption): Employee[] {
  const sorted = [...list]
  if (sort === 'name-asc') return sorted.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'joined-newest') {
    return sorted.sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime())
  }
  return sorted.sort((a, b) => new Date(a.joined).getTime() - new Date(b.joined).getTime())
}

/**
 * Employee management page: search, filters, sorting, pagination and
 * CRUD-style interactions. Uses the shared integrated-platform store when
 * available (so employees hired via Recruitment appear here immediately);
 * otherwise falls back to local state.
 */
export function Employees() {
  const shared = useOptionalIntegratedData()
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(initialEmployees)
  const employees = shared ? shared.employees : localEmployees
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sort, setSort] = useState<SortOption>('name-asc')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)

  const nextIdRef = useRef(1017)
  const sortSelectId = useId()

  const departments = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.department))).sort(),
    [employees],
  )

  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter(
      (employee) =>
        (departmentFilter === 'All' || employee.department === departmentFilter) &&
        (statusFilter === 'All' || employee.status === statusFilter) &&
        (typeFilter === 'All' || employee.employmentType === typeFilter) &&
        matchesSearch(employee, searchTerm),
    )
    return sortEmployees(filtered, sort)
  }, [employees, searchTerm, departmentFilter, statusFilter, typeFilter, sort])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredEmployees.slice(pageStart, pageStart + PAGE_SIZE)

  const resetPage = () => setPage(1)

  const openAddModal = () => {
    setEditingEmployee(null)
    setFormOpen(true)
  }

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: EmployeeFormValues) => {
    if (editingEmployee) {
      if (shared) {
        shared.updateEmployee(editingEmployee.id, values)
      } else {
        setLocalEmployees((current) =>
          current.map((employee) =>
            employee.id === editingEmployee.id ? { ...employee, ...values } : employee,
          ),
        )
      }
    } else if (shared) {
      shared.addEmployee(values)
    } else {
      const newEmployee: Employee = {
        id: `EMP-${nextIdRef.current}`,
        ...values,
        joined: new Date().toISOString().slice(0, 10),
      }
      nextIdRef.current += 1
      setLocalEmployees((current) => [newEmployee, ...current])
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (shared) {
      shared.deleteEmployee(deleteTarget.id)
    } else {
      setLocalEmployees((current) => current.filter((employee) => employee.id !== deleteTarget.id))
    }
    setDeleteTarget(null)
  }

  const columns: DataTableColumn<Employee>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (employee) => (
        <button type="button" onClick={() => setDetailEmployee(employee)} className="text-left">
          <span className="block font-medium text-ink-900 hover:text-accent-700 hover:underline">
            {employee.name}
          </span>
          <span className="block text-xs text-ink-500">{employee.id}</span>
        </button>
      ),
    },
    { key: 'department', header: 'Department', render: (employee) => employee.department },
    { key: 'position', header: 'Position', render: (employee) => employee.position },
    {
      key: 'employmentType',
      header: 'Employment Type',
      render: (employee) => <Tag>{employee.employmentType}</Tag>,
    },
    { key: 'status', header: 'Status', render: (employee) => <StatusBadge status={employee.status} /> },
    { key: 'joined', header: 'Joined', render: (employee) => formatDate(employee.joined) },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (employee) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(employee)}
            aria-label={`Edit ${employee.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(employee)}
            aria-label={`Remove ${employee.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </span>
      ),
    },
  ]

  const activitySource = shared ? shared.activity : recentActivity
  const detailActivity = detailEmployee
    ? activitySource.filter((item) => item.message.includes(detailEmployee.name))
    : []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredEmployees.length} employee{filteredEmployees.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add employee
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value)
            resetPage()
          }}
          placeholder="Search employees by name, position or email…"
          aria-label="Search employees"
          className="lg:max-w-xs"
        />
        <FilterDropdown
          label="Department"
          value={departmentFilter}
          options={departments}
          onChange={(value) => {
            setDepartmentFilter(value)
            resetPage()
          }}
          className="lg:w-44"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={(value) => {
            setStatusFilter(value)
            resetPage()
          }}
          className="lg:w-40"
        />
        <FilterDropdown
          label="Employment"
          value={typeFilter}
          options={EMPLOYMENT_TYPE_OPTIONS}
          onChange={(value) => {
            setTypeFilter(value)
            resetPage()
          }}
          className="lg:w-40"
        />
        <div className="relative lg:w-52">
          <label htmlFor={sortSelectId} className="sr-only">
            Sort employees
          </label>
          <select
            id={sortSelectId}
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-10 w-full appearance-none rounded-lg border border-ink-200 bg-white py-2 pr-9 pl-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
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
        rowKey={(employee) => employee.id}
        emptyTitle="No employees found"
        emptyMessage="Try a different search term or filter combination."
      />

      {filteredEmployees.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredEmployees.length)} of{' '}
            {filteredEmployees.length}
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

      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingEmployee={editingEmployee}
      />

      <Modal
        open={detailEmployee !== null}
        onClose={() => setDetailEmployee(null)}
        title="Employee details"
        description={detailEmployee?.id}
      >
        {detailEmployee ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-ink-100 text-ink-600">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{detailEmployee.name}</p>
                <p className="truncate text-xs text-ink-500">
                  {detailEmployee.position} · {detailEmployee.department}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Email</dt>
                <dd className="mt-0.5 text-ink-900">{detailEmployee.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Phone</dt>
                <dd className="mt-0.5 text-ink-900">{detailEmployee.phone}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={detailEmployee.status} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Employment type</dt>
                <dd className="mt-1">
                  <Tag>{detailEmployee.employmentType}</Tag>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Start date</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailEmployee.joined)}</dd>
              </div>
              {detailEmployee.source ? (
                <div>
                  <dt className="text-xs font-medium text-ink-500">Source</dt>
                  <dd className="mt-0.5 text-ink-900">{detailEmployee.source}</dd>
                </div>
              ) : null}
            </dl>

            {detailEmployee.source ? (
              <div className="rounded-xl border border-ink-200/80 bg-ink-50/50 p-4 text-sm">
                <p className="text-xs font-medium text-ink-500">Recruitment record</p>
                {detailEmployee.recruitmentApplicantId ? (
                  <p className="mt-1 text-ink-800">Applicant ID: {detailEmployee.recruitmentApplicantId}</p>
                ) : null}
                <Link
                  to={recruitmentBasePath}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
                >
                  View recruitment record
                </Link>
              </div>
            ) : null}

            <div>
              <p className="text-xs font-medium text-ink-500">Recent activity</p>
              {detailActivity.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {detailActivity.map((item) => (
                    <li key={item.id} className="text-sm text-ink-700">
                      {item.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-ink-500">No recent activity for this employee in this demo.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  const employee = detailEmployee
                  setDetailEmployee(null)
                  openEditModal(employee)
                }}
              >
                Edit employee
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remove employee?"
        description={
          deleteTarget
            ? `${deleteTarget.name} will be removed from this demo workspace. This cannot be undone.`
            : undefined
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
            Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}
