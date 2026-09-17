import { useId, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatDate } from '../../../lib/format'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import type { DataRecord } from '../../../data/demos/admin-dashboard/types'
import { toCsv, downloadCsv } from './exportCsv'

const PAGE_SIZE = 8
const statusOptions = ['Active', 'Pending', 'Needs Review', 'Closed']

type SortKey = 'updated-desc' | 'value-desc' | 'value-asc'
const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'updated-desc', label: 'Sort: Recently updated' },
  { value: 'value-desc', label: 'Sort: Highest value' },
  { value: 'value-asc', label: 'Sort: Lowest value' },
]

function matchesSearch(record: DataRecord, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return record.name.toLowerCase().includes(needle) || record.category.toLowerCase().includes(needle)
}

/** Data Explorer: a generic administrative data table — search, filters, sort, pagination, detail view and CSV export. */
export function DataExplorer() {
  const { records } = useAdminDashboardData()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('updated-desc')
  const [page, setPage] = useState(1)
  const [detailRecordId, setDetailRecordId] = useState<string | null>(null)
  const [exportedNotice, setExportedNotice] = useState(false)

  const sortSelectId = useId()
  const categories = useMemo(() => Array.from(new Set(records.map((record) => record.category))).sort(), [records])
  const departments = useMemo(() => Array.from(new Set(records.map((record) => record.department))).sort(), [records])

  const filteredRecords = useMemo(() => {
    const filtered = records.filter(
      (record) =>
        (categoryFilter === 'All' || record.category === categoryFilter) &&
        (departmentFilter === 'All' || record.department === departmentFilter) &&
        (statusFilter === 'All' || record.status === statusFilter) &&
        matchesSearch(record, searchTerm),
    )

    const sorted = [...filtered]
    if (sortKey === 'value-desc') sorted.sort((a, b) => b.value - a.value)
    else if (sortKey === 'value-asc') sorted.sort((a, b) => a.value - b.value)
    else sorted.sort((a, b) => b.updatedDate.localeCompare(a.updatedDate))
    return sorted
  }, [records, searchTerm, categoryFilter, departmentFilter, statusFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredRecords.slice(pageStart, pageStart + PAGE_SIZE)

  const resetToFirstPage = () => setPage(1)

  const detailRecord = detailRecordId ? (records.find((record) => record.id === detailRecordId) ?? null) : null

  const handleExport = () => {
    const csv = toCsv(filteredRecords, [
      { header: 'Record', value: (record) => record.name },
      { header: 'Category', value: (record) => record.category },
      { header: 'Department', value: (record) => record.department },
      { header: 'Value', value: (record) => record.value },
      { header: 'Status', value: (record) => record.status },
      { header: 'Updated', value: (record) => record.updatedDate },
    ])
    downloadCsv('administrative-data-explorer.csv', csv)
    setExportedNotice(true)
    window.setTimeout(() => setExportedNotice(false), 2500)
  }

  const columns: DataTableColumn<DataRecord>[] = [
    {
      key: 'name',
      header: 'Record',
      render: (record) => (
        <button type="button" onClick={() => setDetailRecordId(record.id)} className="block text-left font-medium text-ink-900 hover:text-accent-600">
          {record.name}
        </button>
      ),
    },
    { key: 'category', header: 'Category', render: (record) => record.category },
    { key: 'department', header: 'Department', render: (record) => record.department },
    { key: 'value', header: 'Value', render: (record) => (record.value > 0 ? formatCurrency(record.value) : '—') },
    { key: 'status', header: 'Status', render: (record) => <StatusBadge status={record.status} /> },
    { key: 'updated', header: 'Updated', render: (record) => formatDate(record.updatedDate) },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredRecords.length} record{filteredRecords.length === 1 ? '' : 's'}
        </p>
        <div className="flex items-center gap-3">
          {exportedNotice ? (
            <span role="status" className="text-xs font-medium text-emerald-600">
              Report prepared for export.
            </span>
          ) : null}
          <Button type="button" variant="secondary" size="md" onClick={handleExport}>
            <Download className="size-4" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value)
            resetToFirstPage()
          }}
          placeholder="Search records by name or category…"
          aria-label="Search data records"
          className="lg:max-w-sm"
        />
        <FilterDropdown
          label="Category"
          value={categoryFilter}
          options={categories}
          onChange={(value) => {
            setCategoryFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-44"
        />
        <FilterDropdown
          label="Department"
          value={departmentFilter}
          options={departments}
          onChange={(value) => {
            setDepartmentFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-48"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={(value) => {
            setStatusFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-44"
        />
        <div className="relative lg:w-56">
          <label htmlFor={sortSelectId} className="sr-only">
            Sort records
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
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
        </div>
      </div>

      <DataTable columns={columns} rows={pageRows} rowKey={(record) => record.id} emptyTitle="No records found" emptyMessage="Try a different search term or filter." />

      {filteredRecords.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length}
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

      <Modal
        open={detailRecord !== null}
        onClose={() => setDetailRecordId(null)}
        title={detailRecord?.name ?? 'Record'}
        description={detailRecord ? `${detailRecord.category} · ${detailRecord.department}` : undefined}
      >
        {detailRecord ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-ink-500">Value</dt>
              <dd className="mt-0.5 text-ink-900">{detailRecord.value > 0 ? formatCurrency(detailRecord.value) : '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Updated</dt>
              <dd className="mt-0.5 text-ink-900">{formatDate(detailRecord.updatedDate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={detailRecord.status} />
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </div>
  )
}
