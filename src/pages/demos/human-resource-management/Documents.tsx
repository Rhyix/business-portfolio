import { useMemo, useState } from 'react'
import { FileX } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { formatDate } from '../../../lib/format'
import { employeeDocuments } from '../../../data/demos/human-resources/documents'
import type { DocumentStatus, DocumentType, EmployeeDocument } from '../../../data/demos/human-resources/types'

const STATUS_OPTIONS: DocumentStatus[] = ['Valid', 'Expiring Soon', 'Expired', 'Missing']

function documentTitle(type: DocumentType): string {
  return `${type.replace(/ /g, '_')}.pdf`
}

/** Employee document register: filters and a metadata-only detail view. No file storage or uploads. */
export function Documents() {
  const [employeeFilter, setEmployeeFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [detailDocId, setDetailDocId] = useState<string | null>(null)

  const detailDoc = employeeDocuments.find((doc) => doc.id === detailDocId) ?? null

  const employeeNames = useMemo(
    () => Array.from(new Set(employeeDocuments.map((doc) => doc.employeeName))).sort(),
    [],
  )
  const documentTypes = useMemo(
    () => Array.from(new Set(employeeDocuments.map((doc) => doc.type))).sort(),
    [],
  )

  const filteredDocs = useMemo(() => {
    return employeeDocuments.filter(
      (doc) =>
        (employeeFilter === 'All' || doc.employeeName === employeeFilter) &&
        (typeFilter === 'All' || doc.type === typeFilter) &&
        (statusFilter === 'All' || doc.status === statusFilter),
    )
  }, [employeeFilter, typeFilter, statusFilter])

  const columns: DataTableColumn<EmployeeDocument>[] = [
    {
      key: 'document',
      header: 'Document',
      render: (doc) => (
        <button
          type="button"
          onClick={() => setDetailDocId(doc.id)}
          className="font-medium text-ink-900 hover:text-accent-700 hover:underline"
        >
          {documentTitle(doc.type)}
        </button>
      ),
    },
    { key: 'employee', header: 'Employee', render: (doc) => doc.employeeName },
    { key: 'type', header: 'Type', render: (doc) => doc.type },
    { key: 'uploaded', header: 'Uploaded', render: (doc) => (doc.uploaded ? formatDate(doc.uploaded) : '—') },
    { key: 'expiry', header: 'Expiry', render: (doc) => (doc.expiry ? formatDate(doc.expiry) : '—') },
    { key: 'status', header: 'Status', render: (doc) => <StatusBadge status={doc.status} /> },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">
        {filteredDocs.length} document{filteredDocs.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <FilterDropdown
          label="Employee"
          value={employeeFilter}
          options={employeeNames}
          onChange={setEmployeeFilter}
          className="sm:w-56"
        />
        <FilterDropdown
          label="Type"
          value={typeFilter}
          options={documentTypes}
          onChange={setTypeFilter}
          className="sm:w-56"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
          className="sm:w-44"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filteredDocs}
        rowKey={(doc) => doc.id}
        emptyTitle="No documents found"
        emptyMessage="Try a different employee, type or status filter."
      />

      <Modal
        open={detailDoc !== null}
        onClose={() => setDetailDocId(null)}
        title={detailDoc ? documentTitle(detailDoc.type) : ''}
        description={detailDoc?.employeeName}
      >
        {detailDoc ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-700">{detailDoc.type}</span>
              <StatusBadge status={detailDoc.status} />
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-ink-200/80 p-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Uploaded</dt>
                <dd className="mt-0.5 text-ink-900">{detailDoc.uploaded ? formatDate(detailDoc.uploaded) : 'Not on file'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Expiry</dt>
                <dd className="mt-0.5 text-ink-900">{detailDoc.expiry ? formatDate(detailDoc.expiry) : 'No expiry'}</dd>
              </div>
            </dl>

            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-8 text-center">
              <FileX className="size-6 text-ink-400" aria-hidden="true" />
              <p className="text-sm text-ink-500">
                No file preview available. This demo does not store or upload real documents.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
