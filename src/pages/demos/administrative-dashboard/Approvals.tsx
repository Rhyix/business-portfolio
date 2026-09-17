import { useMemo, useState } from 'react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import type { Approval } from '../../../data/demos/admin-dashboard/types'

const typeOptions = ['Purchase Request', 'Leave Request', 'Budget Request', 'Administrative Request']
const statusOptions = ['Pending', 'Approved', 'Rejected']

function matchesSearch(approval: Approval, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return approval.requester.toLowerCase().includes(needle) || approval.id.toLowerCase().includes(needle)
}

type PendingDecision = 'approve' | 'reject' | null

/** Approvals: search/filter, and an approve/reject workflow that always confirms before acting. */
export function Approvals() {
  const { approvals, approveRequest, rejectRequest } = useAdminDashboardData()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pendingDecision, setPendingDecision] = useState<PendingDecision>(null)

  const filteredApprovals = useMemo(() => {
    return approvals
      .filter(
        (approval) =>
          (typeFilter === 'All' || approval.type === typeFilter) &&
          (statusFilter === 'All' || approval.status === statusFilter) &&
          matchesSearch(approval, searchTerm),
      )
      .sort((a, b) => b.dateSubmitted.localeCompare(a.dateSubmitted))
  }, [approvals, searchTerm, typeFilter, statusFilter])

  const selectedApproval = selectedId ? (approvals.find((approval) => approval.id === selectedId) ?? null) : null

  const openDetail = (approval: Approval) => {
    setSelectedId(approval.id)
    setPendingDecision(null)
  }

  const closeDetail = () => {
    setSelectedId(null)
    setPendingDecision(null)
  }

  const confirmDecision = () => {
    if (!selectedApproval || !pendingDecision) return
    if (pendingDecision === 'approve') approveRequest(selectedApproval.id)
    else rejectRequest(selectedApproval.id)
    closeDetail()
  }

  const columns: DataTableColumn<Approval>[] = [
    {
      key: 'id',
      header: 'Request ID',
      render: (approval) => (
        <button type="button" onClick={() => openDetail(approval)} className="block text-left font-medium text-ink-900 hover:text-accent-600">
          {approval.id}
        </button>
      ),
    },
    { key: 'type', header: 'Type', render: (approval) => approval.type },
    { key: 'requester', header: 'Requester', render: (approval) => approval.requester },
    { key: 'department', header: 'Department', render: (approval) => approval.department },
    { key: 'date', header: 'Date', render: (approval) => formatDate(approval.dateSubmitted) },
    { key: 'status', header: 'Status', render: (approval) => <StatusBadge status={approval.status} /> },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">
        {filteredApprovals.length} request{filteredApprovals.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by requester or request ID…" aria-label="Search approvals" className="lg:max-w-sm" />
        <FilterDropdown label="Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} className="lg:w-52" />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="lg:w-40" />
      </div>

      <DataTable
        columns={columns}
        rows={filteredApprovals}
        rowKey={(approval) => approval.id}
        onRowClick={openDetail}
        emptyTitle="No requests found"
        emptyMessage="Try a different search term or filter."
      />

      <Modal
        open={selectedApproval !== null}
        onClose={closeDetail}
        title={selectedApproval?.id ?? 'Request'}
        description={selectedApproval ? `${selectedApproval.type} · ${selectedApproval.requester}` : undefined}
      >
        {selectedApproval ? (
          pendingDecision ? (
            <div className="space-y-4">
              <p className="text-sm text-ink-700">
                {pendingDecision === 'approve' ? 'Approve' : 'Reject'} {selectedApproval.id} from {selectedApproval.requester}?
              </p>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" size="md" onClick={() => setPendingDecision(null)}>
                  Back
                </Button>
                {pendingDecision === 'approve' ? (
                  <Button type="button" size="md" onClick={confirmDecision}>
                    Confirm approval
                  </Button>
                ) : (
                  <button
                    type="button"
                    onClick={confirmDecision}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
                  >
                    Confirm rejection
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedApproval.status} />
                <span className="text-xs text-ink-500">Submitted {formatDate(selectedApproval.dateSubmitted)}</span>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs font-medium text-ink-500">Department</dt>
                  <dd className="mt-0.5 text-ink-900">{selectedApproval.department}</dd>
                </div>
                {selectedApproval.decisionDate ? (
                  <div>
                    <dt className="text-xs font-medium text-ink-500">Decision date</dt>
                    <dd className="mt-0.5 text-ink-900">{formatDate(selectedApproval.decisionDate)}</dd>
                  </div>
                ) : null}
              </dl>

              <p className="rounded-lg bg-ink-50/60 p-3 text-sm text-ink-700">{selectedApproval.details}</p>

              {selectedApproval.status === 'Pending' ? (
                <div className="flex justify-end gap-3 border-t border-ink-200/80 pt-4">
                  <button
                    type="button"
                    onClick={() => setPendingDecision('reject')}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-red-200 px-5 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <Button type="button" size="md" onClick={() => setPendingDecision('approve')}>
                    Approve
                  </Button>
                </div>
              ) : (
                <p className="border-t border-ink-200/80 pt-4 text-xs text-ink-500">This request has already been {selectedApproval.status.toLowerCase()}.</p>
              )}
            </div>
          )
        ) : null}
      </Modal>
    </div>
  )
}
