import { useMemo, useState } from 'react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { formatCurrency, formatDate } from '../../../lib/format'
import { initialOrders } from '../../../data/demos/business-management/orders'
import type { Order, OrderStatus } from '../../../data/demos/business-management/types'

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Cancelled']

function matchesSearch(order: Order, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return order.id.toLowerCase().includes(needle) || order.customerName.toLowerCase().includes(needle)
}

/** Orders page: status filtering, search and a read-only order detail view. */
export function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)

  const filteredOrders = useMemo(() => {
    return initialOrders.filter(
      (order) => (statusFilter === 'All' || order.status === statusFilter) && matchesSearch(order, searchTerm),
    )
  }, [searchTerm, statusFilter])

  const columns: DataTableColumn<Order>[] = [
    { key: 'id', header: 'Order', render: (order) => <span className="font-medium text-ink-900">{order.id}</span> },
    { key: 'customer', header: 'Customer', render: (order) => order.customerName },
    { key: 'date', header: 'Date', render: (order) => formatDate(order.date) },
    {
      key: 'items',
      header: 'Items',
      render: (order) => `${order.items.reduce((sum, item) => sum + item.quantity, 0)} pcs`,
    },
    {
      key: 'total',
      header: 'Total',
      render: (order) => <span className="font-medium text-ink-900">{formatCurrency(order.total)}</span>,
    },
    { key: 'status', header: 'Status', render: (order) => <StatusBadge status={order.status} /> },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">
        {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by order ID or customer…"
          aria-label="Search orders"
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
        rows={filteredOrders}
        rowKey={(order) => order.id}
        onRowClick={setDetailOrder}
        emptyTitle="No orders found"
        emptyMessage="Try a different search term or status filter."
      />

      <Modal
        open={detailOrder !== null}
        onClose={() => setDetailOrder(null)}
        title={detailOrder ? `Order ${detailOrder.id}` : ''}
        description={detailOrder ? `Placed by ${detailOrder.customerName} on ${formatDate(detailOrder.date)}` : undefined}
      >
        {detailOrder ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={detailOrder.status} />
              <span className="text-lg font-semibold text-ink-900">
                {formatCurrency(detailOrder.total)}
              </span>
            </div>

            <div className="rounded-xl border border-ink-200/80">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200/80 bg-ink-50/70">
                    <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-ink-500 uppercase">
                      Item
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right text-xs font-semibold text-ink-500 uppercase">
                      Qty
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right text-xs font-semibold text-ink-500 uppercase">
                      Unit price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {detailOrder.items.map((item) => (
                    <tr key={item.productName}>
                      <td className="px-4 py-2.5 text-ink-800">{item.productName}</td>
                      <td className="px-4 py-2.5 text-right text-ink-600">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-right text-ink-600">{formatCurrency(item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
