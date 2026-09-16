import { useId, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatDate } from '../../../lib/format'
import { initialOrders } from '../../../data/demos/business-management/orders'
import type { Order, OrderStatus } from '../../../data/demos/business-management/types'
import { useOptionalIntegratedData } from '../../../data/demos/integrated/context'

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Cancelled']

function matchesSearch(order: Order, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return order.id.toLowerCase().includes(needle) || order.customerName.toLowerCase().includes(needle)
}

/**
 * Orders page: status filtering, search and a read-only order detail view.
 * Inside the integrated platform (shared store present) it also gains a
 * "Create order" action that draws from the shared Customers/Products data
 * and deducts stock — demonstrating the Customers → Orders → Inventory
 * relationship. The standalone BMS demo keeps its original read-only scope.
 */
export function Orders() {
  const shared = useOptionalIntegratedData()
  const orders = shared ? shared.orders : initialOrders

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) => (statusFilter === 'All' || order.status === statusFilter) && matchesSearch(order, searchTerm),
    )
  }, [orders, searchTerm, statusFilter])

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
        </p>
        {shared ? (
          <Button type="button" size="md" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Create order
          </Button>
        ) : null}
      </div>

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

      {shared ? (
        <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create order" description="Draws from the shared Customers and Products data.">
          {createOpen ? <CreateOrderForm onClose={() => setCreateOpen(false)} /> : null}
        </Modal>
      ) : null}
    </div>
  )
}

interface CreateOrderFormProps {
  onClose: () => void
}

/** Single-item order builder used by the integrated platform's "Create order" action. */
function CreateOrderForm({ onClose }: CreateOrderFormProps) {
  const shared = useOptionalIntegratedData()
  const customerId = useId()
  const productId = useId()
  const quantityId = useId()

  const [selectedCustomerId, setSelectedCustomerId] = useState(shared?.customers[0]?.id ?? '')
  const [selectedProductId, setSelectedProductId] = useState(shared?.products[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)

  if (!shared) return null

  const selectedProduct = shared.products.find((product) => product.id === selectedProductId)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCustomerId || !selectedProductId) {
      setError('Choose a customer and a product.')
      return
    }
    shared.addOrder({ customerId: selectedCustomerId, productId: selectedProductId, quantity })
    onClose()
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={customerId} className="mb-1.5 block text-sm font-medium text-ink-800">
          Customer
        </label>
        <select
          id={customerId}
          value={selectedCustomerId}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setSelectedCustomerId(event.target.value)}
          className={demoControlStyles}
        >
          {shared.customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} — {customer.company}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={productId} className="mb-1.5 block text-sm font-medium text-ink-800">
          Product
        </label>
        <select
          id={productId}
          value={selectedProductId}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => setSelectedProductId(event.target.value)}
          className={demoControlStyles}
        >
          {shared.products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({formatCurrency(product.price)}, {product.stock} in stock)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={quantityId} className="mb-1.5 block text-sm font-medium text-ink-800">
          Quantity
        </label>
        <input
          id={quantityId}
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className={demoControlStyles}
        />
      </div>

      {selectedProduct ? (
        <p className="text-xs text-ink-500">
          Total: {formatCurrency(selectedProduct.price * quantity)}. This will reduce {selectedProduct.name}'s stock
          by {quantity}.
        </p>
      ) : null}

      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          Create order
        </Button>
      </div>
    </form>
  )
}
