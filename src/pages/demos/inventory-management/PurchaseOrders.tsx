import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatDate, formatNumber } from '../../../lib/format'
import { useInventoryData } from '../../../data/demos/inventory/context'
import { purchaseOrderTotal } from '../../../data/demos/inventory/types'
import type { PurchaseOrder, PurchaseOrderInput, PurchaseOrderStatus } from '../../../data/demos/inventory/types'
import { PurchaseOrderFormModal } from './PurchaseOrderFormModal'

const statusOptions: PurchaseOrderStatus[] = ['Draft', 'Ordered', 'Partially Received', 'Received', 'Cancelled']

/** Purchase Orders: create, view, cancel, and — the flagship workflow — receive stock against an order. */
export function PurchaseOrders() {
  const {
    purchaseOrders,
    suppliers,
    warehouses,
    products,
    addPurchaseOrder,
    cancelPurchaseOrder,
    receivePurchaseOrder,
    pendingPurchaseOrderProductId,
    setPendingPurchaseOrderProductId,
  } = useInventoryData()

  const [statusFilter, setStatusFilter] = useState('All')
  const [manualFormOpen, setManualFormOpen] = useState(false)
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<PurchaseOrder | null>(null)
  const [receiveQuantities, setReceiveQuantities] = useState<Record<string, string>>({})

  // The form opens either from the regular "Create purchase order" button, or
  // because a low-stock action elsewhere set a pending product id — derived
  // directly from that shared value rather than copied into local state via
  // an effect, so there's nothing to keep in sync.
  const formOpen = manualFormOpen || pendingPurchaseOrderProductId !== null

  const filteredOrders = useMemo(() => {
    return purchaseOrders
      .filter((order) => statusFilter === 'All' || order.status === statusFilter)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  }, [purchaseOrders, statusFilter])

  const detailOrder = detailOrderId ? (purchaseOrders.find((order) => order.id === detailOrderId) ?? null) : null

  const openCreateModal = () => setManualFormOpen(true)

  const closeFormModal = () => {
    setManualFormOpen(false)
    setPendingPurchaseOrderProductId(null)
  }

  const handleFormSubmit = (values: PurchaseOrderInput) => {
    addPurchaseOrder(values)
    closeFormModal()
  }

  const openDetail = (order: PurchaseOrder) => {
    setDetailOrderId(order.id)
    setReceiveQuantities(Object.fromEntries(order.items.map((item) => [item.productId, String(Math.max(0, item.quantity - item.receivedQuantity))])))
  }

  const confirmCancel = () => {
    if (!cancelTarget) return
    cancelPurchaseOrder(cancelTarget.id)
    setCancelTarget(null)
  }

  const handleReceive = () => {
    if (!detailOrder) return
    const lines = detailOrder.items.map((item) => ({
      productId: item.productId,
      quantityReceived: Number(receiveQuantities[item.productId]) || 0,
    }))
    receivePurchaseOrder(detailOrder.id, lines)
    setDetailOrderId(null)
  }

  const canReceive = detailOrder
    ? detailOrder.status !== 'Received' &&
      detailOrder.status !== 'Cancelled' &&
      detailOrder.items.some((item) => (Number(receiveQuantities[item.productId]) || 0) > 0)
    : false

  const columns: DataTableColumn<PurchaseOrder>[] = [
    {
      key: 'id',
      header: 'PO Number',
      render: (order) => (
        <button type="button" onClick={() => openDetail(order)} className="block text-left font-medium text-ink-900 hover:text-accent-600">
          {order.id}
        </button>
      ),
    },
    { key: 'supplier', header: 'Supplier', render: (order) => order.supplierName },
    { key: 'warehouse', header: 'Warehouse', render: (order) => order.warehouseName },
    { key: 'items', header: 'Items', render: (order) => formatNumber(order.items.length) },
    { key: 'total', header: 'Total', render: (order) => <span className="font-medium text-ink-900">{formatCurrency(purchaseOrderTotal(order))}</span> },
    { key: 'orderDate', header: 'Order Date', render: (order) => formatDate(order.orderDate) },
    { key: 'expectedDate', header: 'Expected Date', render: (order) => formatDate(order.expectedDate) },
    { key: 'status', header: 'Status', render: (order) => <StatusBadge status={order.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (order) =>
        order.status !== 'Received' && order.status !== 'Cancelled' ? (
          <button
            type="button"
            onClick={() => setCancelTarget(order)}
            aria-label={`Cancel ${order.id}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredOrders.length} purchase order{filteredOrders.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openCreateModal}>
          <Plus className="size-4" aria-hidden="true" />
          Create purchase order
        </Button>
      </div>

      <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="sm:w-52" />

      <DataTable
        columns={columns}
        rows={filteredOrders}
        rowKey={(order) => order.id}
        emptyTitle="No purchase orders found"
        emptyMessage="Try a different status filter."
      />

      <PurchaseOrderFormModal
        open={formOpen}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        suppliers={suppliers}
        warehouses={warehouses}
        products={products}
        presetProductId={pendingPurchaseOrderProductId}
      />

      <Modal
        open={detailOrder !== null}
        onClose={() => setDetailOrderId(null)}
        title={detailOrder?.id ?? 'Purchase order'}
        description={detailOrder ? `${detailOrder.supplierName} · ${detailOrder.warehouseName}` : undefined}
        className="max-w-2xl"
      >
        {detailOrder ? (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs font-medium text-ink-500">Order Date</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailOrder.orderDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Expected Date</dt>
                <dd className="mt-0.5 text-ink-900">{formatDate(detailOrder.expectedDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={detailOrder.status} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Total</dt>
                <dd className="mt-0.5 font-medium text-ink-900">{formatCurrency(purchaseOrderTotal(detailOrder))}</dd>
              </div>
            </dl>

            <div>
              <p className="mb-2 text-sm font-medium text-ink-800">
                {detailOrder.status === 'Received' || detailOrder.status === 'Cancelled' ? 'Line items' : 'Receive stock'}
              </p>
              <div className="overflow-x-auto rounded-xl border border-ink-200/80">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-200/80 bg-ink-50/60 text-left text-xs font-medium text-ink-500">
                      <th className="px-3 py-2.5">Product</th>
                      <th className="px-3 py-2.5">Ordered</th>
                      <th className="px-3 py-2.5">Received</th>
                      {detailOrder.status !== 'Received' && detailOrder.status !== 'Cancelled' ? (
                        <th className="px-3 py-2.5">Receive Now</th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {detailOrder.items.map((item) => {
                      const remaining = Math.max(0, item.quantity - item.receivedQuantity)
                      return (
                        <tr key={item.productId}>
                          <td className="px-3 py-2.5 text-ink-900">{item.productName}</td>
                          <td className="px-3 py-2.5">{formatNumber(item.quantity)}</td>
                          <td className="px-3 py-2.5">{formatNumber(item.receivedQuantity)}</td>
                          {detailOrder.status !== 'Received' && detailOrder.status !== 'Cancelled' ? (
                            <td className="px-3 py-2.5">
                              <label htmlFor={`receive-${item.productId}`} className="sr-only">
                                Receive now — {item.productName}
                              </label>
                              <input
                                id={`receive-${item.productId}`}
                                type="number"
                                min={0}
                                max={remaining}
                                value={receiveQuantities[item.productId] ?? '0'}
                                onChange={(event) =>
                                  setReceiveQuantities((current) => ({ ...current, [item.productId]: event.target.value }))
                                }
                                className="h-10 w-20 rounded-lg border border-ink-200 bg-white px-2.5 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
                              />
                            </td>
                          ) : null}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {detailOrder.status !== 'Received' && detailOrder.status !== 'Cancelled' ? (
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" size="md" onClick={() => setDetailOrderId(null)}>
                  Close
                </Button>
                <Button type="button" size="md" onClick={handleReceive} disabled={!canReceive}>
                  Confirm receipt
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        title="Cancel purchase order?"
        description={cancelTarget ? `${cancelTarget.id} for ${cancelTarget.supplierName} will be marked cancelled.` : undefined}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setCancelTarget(null)}>
            Keep order
          </Button>
          <button
            type="button"
            onClick={confirmCancel}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Cancel order
          </button>
        </div>
      </Modal>
    </div>
  )
}
