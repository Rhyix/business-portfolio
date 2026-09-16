import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Tag } from '../../../components/ui/Tag'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import { leaveRequests as initialLeaveRequests } from '../../../data/demos/human-resources/leave'
import type { LeaveRequest, LeaveStatus, LeaveType } from '../../../data/demos/human-resources/types'
import { useOptionalIntegratedData } from '../../../data/demos/integrated/context'

const STATUS_OPTIONS: LeaveStatus[] = ['Pending', 'Approved', 'Rejected']
const TYPE_OPTIONS: LeaveType[] = ['Vacation Leave', 'Sick Leave', 'Emergency Leave', 'Personal Leave']

function matchesSearch(request: LeaveRequest, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return request.employeeName.toLowerCase().includes(needle) || request.id.toLowerCase().includes(needle)
}

type PendingAction = { request: LeaveRequest; action: 'Approved' | 'Rejected' } | null

/**
 * Leave-request workflow: search, filters, a detail view and an
 * approve/reject flow with confirmation. Uses the shared integrated-platform
 * store when available, so dashboard HR indicators reflect the decision
 * immediately; otherwise falls back to local state.
 */
export function Leave() {
  const shared = useOptionalIntegratedData()
  const [localRequests, setLocalRequests] = useState<LeaveRequest[]>(initialLeaveRequests)
  const requests = shared ? shared.leaveRequests : localRequests
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const detailRequest = requests.find((request) => request.id === detailRequestId) ?? null

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (request) =>
        (statusFilter === 'All' || request.status === statusFilter) &&
        (typeFilter === 'All' || request.type === typeFilter) &&
        matchesSearch(request, searchTerm),
    )
  }, [requests, searchTerm, statusFilter, typeFilter])

  const applyDecision = () => {
    if (!pendingAction) return
    if (shared) {
      shared.updateLeaveStatus(pendingAction.request.id, pendingAction.action)
    } else {
      setLocalRequests((current) =>
        current.map((request) =>
          request.id === pendingAction.request.id ? { ...request, status: pendingAction.action } : request,
        ),
      )
    }
    setPendingAction(null)
    setDetailRequestId(null)
  }

  const columns: DataTableColumn<LeaveRequest>[] = [
    {
      key: 'id',
      header: 'Request',
      render: (request) => (
        <button
          type="button"
          onClick={() => setDetailRequestId(request.id)}
          className="font-medium text-ink-900 hover:text-accent-700 hover:underline"
        >
          {request.id}
        </button>
      ),
    },
    { key: 'employee', header: 'Employee', render: (request) => request.employeeName },
    { key: 'type', header: 'Type', render: (request) => <Tag>{request.type}</Tag> },
    { key: 'start', header: 'Start Date', render: (request) => formatDate(request.startDate) },
    { key: 'end', header: 'End Date', render: (request) => formatDate(request.endDate) },
    { key: 'days', header: 'Days', render: (request) => request.days },
    { key: 'status', header: 'Status', render: (request) => <StatusBadge status={request.status} /> },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">
        {filteredRequests.length} request{filteredRequests.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by employee or request ID…"
          aria-label="Search leave requests"
          className="sm:max-w-sm"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
          className="sm:w-44"
        />
        <FilterDropdown
          label="Type"
          value={typeFilter}
          options={TYPE_OPTIONS}
          onChange={setTypeFilter}
          className="sm:w-48"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filteredRequests}
        rowKey={(request) => request.id}
        emptyTitle="No leave requests found"
        emptyMessage="Try a different search term or filter."
      />

      <Modal
        open={detailRequest !== null}
        onClose={() => setDetailRequestId(null)}
        title={detailRequest ? `Leave request ${detailRequest.id}` : ''}
        description={detailRequest ? `${detailRequest.employeeName} · ${detailRequest.department}` : undefined}
      >
        {detailRequest ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Tag>{detailRequest.type}</Tag>
              <StatusBadge status={detailRequest.status} />
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-ink-200/80 p-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Start date</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailRequest.startDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">End date</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailRequest.endDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Duration</dt>
                <dd className="mt-0.5 text-ink-900">{detailRequest.days} day{detailRequest.days === 1 ? '' : 's'}</dd>
              </div>
            </dl>

            <div>
              <p className="text-xs font-medium text-ink-500">Reason</p>
              <p className="mt-1 text-sm text-ink-700">{detailRequest.reason}</p>
            </div>

            {detailRequest.status === 'Pending' ? (
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setPendingAction({ request: detailRequest, action: 'Rejected' })}
                >
                  <X className="size-4" aria-hidden="true" />
                  Reject
                </Button>
                <Button
                  type="button"
                  size="md"
                  onClick={() => setPendingAction({ request: detailRequest, action: 'Approved' })}
                >
                  <Check className="size-4" aria-hidden="true" />
                  Approve
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={pendingAction !== null}
        onClose={() => setPendingAction(null)}
        title={pendingAction?.action === 'Approved' ? 'Approve this request?' : 'Reject this request?'}
        description={
          pendingAction
            ? `${pendingAction.request.employeeName}'s ${pendingAction.request.type.toLowerCase()} request (${pendingAction.request.days} day${pendingAction.request.days === 1 ? '' : 's'}) will be marked ${pendingAction.action.toLowerCase()}.`
            : undefined
        }
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setPendingAction(null)}>
            Cancel
          </Button>
          <Button type="button" size="md" onClick={applyDecision}>
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  )
}
