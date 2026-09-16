import { useMemo, useState } from 'react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatDate } from '../../../lib/format'
import { initialInvoices } from '../../../data/demos/business-management/invoices'
import type { Invoice, InvoiceStatus } from '../../../data/demos/business-management/types'
import { useOptionalIntegratedData } from '../../../data/demos/integrated/context'

const STATUS_OPTIONS: InvoiceStatus[] = ['Paid', 'Pending', 'Overdue']

function matchesSearch(invoice: Invoice, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    invoice.id.toLowerCase().includes(needle) ||
    invoice.customerName.toLowerCase().includes(needle) ||
    invoice.orderId.toLowerCase().includes(needle)
  )
}

/**
 * Invoice management page: status filtering, search and an invoice detail
 * view. Inside the integrated platform (shared store present) the detail
 * view also gains a "Mark as paid" action. No real payment processing.
 */
export function Invoices() {
  const shared = useOptionalIntegratedData()
  const invoices = shared ? shared.invoices : initialInvoices

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [detailInvoiceId, setDetailInvoiceId] = useState<string | null>(null)

  const detailInvoice = invoices.find((invoice) => invoice.id === detailInvoiceId) ?? null

  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) =>
        (statusFilter === 'All' || invoice.status === statusFilter) && matchesSearch(invoice, searchTerm),
    )
  }, [invoices, searchTerm, statusFilter])

  const columns: DataTableColumn<Invoice>[] = [
    { key: 'id', header: 'Invoice', render: (invoice) => <span className="font-medium text-ink-900">{invoice.id}</span> },
    { key: 'customer', header: 'Customer', render: (invoice) => invoice.customerName },
    { key: 'date', header: 'Date', render: (invoice) => formatDate(invoice.date) },
    { key: 'dueDate', header: 'Due date', render: (invoice) => formatDate(invoice.dueDate) },
    {
      key: 'amount',
      header: 'Amount',
      render: (invoice) => <span className="font-medium text-ink-900">{formatCurrency(invoice.amount)}</span>,
    },
    { key: 'status', header: 'Status', render: (invoice) => <StatusBadge status={invoice.status} /> },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">
        {filteredInvoices.length} invoice{filteredInvoices.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by invoice, order ID or customer…"
          aria-label="Search invoices"
          className="sm:max-w-sm"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
          className="sm:w-48"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filteredInvoices}
        rowKey={(invoice) => invoice.id}
        onRowClick={(invoice) => setDetailInvoiceId(invoice.id)}
        emptyTitle="No invoices found"
        emptyMessage="Try a different search term or status filter."
      />

      <Modal
        open={detailInvoice !== null}
        onClose={() => setDetailInvoiceId(null)}
        title={detailInvoice ? `Invoice ${detailInvoice.id}` : ''}
        description={detailInvoice ? `Billed to ${detailInvoice.customerName} for order ${detailInvoice.orderId}` : undefined}
      >
        {detailInvoice ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={detailInvoice.status} />
              <span className="text-lg font-semibold text-ink-900">
                {formatCurrency(detailInvoice.amount)}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-xl border border-ink-200/80 p-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Issued</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailInvoice.date)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Due</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailInvoice.dueDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Related order</dt>
                <dd className="mt-0.5 text-ink-900">{detailInvoice.orderId}</dd>
              </div>
            </dl>

            <p className="text-xs text-ink-400">
              This demo does not process real payments. In a production build this panel would link to
              the order record and a payment/reconciliation workflow.
            </p>

            {shared && detailInvoice.status !== 'Paid' ? (
              <div className="flex justify-end pt-2">
                <Button type="button" size="md" onClick={() => shared.markInvoicePaid(detailInvoice.id)}>
                  Mark as paid
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
