import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import { formatCurrency } from '../../../lib/format'
import type { Product, PurchaseOrderInput, Supplier, Warehouse } from '../../../data/demos/inventory/types'

interface LineItemRow {
  productId: string
  quantity: string
  unitCost: string
}

interface PurchaseOrderFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: PurchaseOrderInput) => void
  suppliers: Supplier[]
  warehouses: Warehouse[]
  products: Product[]
  /** Preselects the first line item's product — set when opened via a low-stock "Create Purchase Order" action. */
  presetProductId?: string | null
}

/** Create-purchase-order dialog with a dynamic add/remove line-item builder. No backend — state lives in the shared inventory store. */
export function PurchaseOrderFormModal({ open, onClose, onSubmit, suppliers, warehouses, products, presetProductId }: PurchaseOrderFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Create purchase order" description="Order replenishment stock from a supplier." className="max-w-2xl">
      {open ? (
        <PurchaseOrderForm
          onClose={onClose}
          onSubmit={onSubmit}
          suppliers={suppliers}
          warehouses={warehouses}
          products={products}
          presetProductId={presetProductId}
        />
      ) : null}
    </Modal>
  )
}

function emptyRow(productId = ''): LineItemRow {
  return { productId, quantity: '1', unitCost: '' }
}

function PurchaseOrderForm({
  onClose,
  onSubmit,
  suppliers,
  warehouses,
  products,
  presetProductId,
}: {
  onClose: () => void
  onSubmit: (values: PurchaseOrderInput) => void
  suppliers: Supplier[]
  warehouses: Warehouse[]
  products: Product[]
  presetProductId?: string | null
}) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? '')
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? '')
  const [expectedDate, setExpectedDate] = useState('')
  const [status, setStatus] = useState<'Draft' | 'Ordered'>('Ordered')
  const [rows, setRows] = useState<LineItemRow[]>([emptyRow(presetProductId ?? '')])
  const [error, setError] = useState<string | null>(null)

  const updateRow = (index: number, patch: Partial<LineItemRow>) => {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)))
    setError(null)
  }

  const addRow = () => setRows((current) => [...current, emptyRow()])
  const removeRow = (index: number) => setRows((current) => (current.length > 1 ? current.filter((_, rowIndex) => rowIndex !== index) : current))

  const total = rows.reduce((sum, row) => sum + (Number(row.quantity) || 0) * (Number(row.unitCost) || 0), 0)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!supplierId || !warehouseId || !expectedDate) {
      setError('Fill in the supplier, warehouse and expected date.')
      return
    }

    const items = rows
      .filter((row) => row.productId)
      .map((row) => ({ productId: row.productId, quantity: Number(row.quantity) || 0, unitCost: Number(row.unitCost) || 0 }))

    if (items.length === 0) {
      setError('Add at least one line item.')
      return
    }
    if (items.some((item) => item.quantity <= 0)) {
      setError('Each line item needs a quantity greater than zero.')
      return
    }

    onSubmit({ supplierId, warehouseId, expectedDate, status, items })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField id="po-supplier" label="Supplier">
          <select id="po-supplier" value={supplierId} onChange={(event) => setSupplierId(event.target.value)} className={demoControlStyles}>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="po-warehouse" label="Warehouse">
          <select id="po-warehouse" value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)} className={demoControlStyles}>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="po-expected" label="Expected date">
          <input
            id="po-expected"
            type="date"
            value={expectedDate}
            onChange={(event) => setExpectedDate(event.target.value)}
            className={demoControlStyles}
          />
        </FormField>
        <FormField id="po-status" label="Status">
          <select id="po-status" value={status} onChange={(event) => setStatus(event.target.value as 'Draft' | 'Ordered')} className={demoControlStyles}>
            <option value="Draft">Draft</option>
            <option value="Ordered">Ordered</option>
          </select>
        </FormField>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink-800">Line items</legend>
        <div className="overflow-x-auto rounded-xl border border-ink-200/80">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-200/80 bg-ink-50/60 text-left text-xs font-medium text-ink-500">
                <th className="px-3 py-2.5">Product</th>
                <th className="px-3 py-2.5">Quantity</th>
                <th className="px-3 py-2.5">Unit Cost</th>
                <th className="px-3 py-2.5 text-right">Line Total</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((row, index) => {
                const lineTotal = (Number(row.quantity) || 0) * (Number(row.unitCost) || 0)
                return (
                  <tr key={index}>
                    <td className="px-3 py-2.5">
                      <label htmlFor={`po-row-product-${index}`} className="sr-only">
                        Product (line {index + 1})
                      </label>
                      <select
                        id={`po-row-product-${index}`}
                        value={row.productId}
                        onChange={(event) => updateRow(index, { productId: event.target.value })}
                        className={cn(demoControlStyles, 'h-10 min-w-[11rem]')}
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      <label htmlFor={`po-row-quantity-${index}`} className="sr-only">
                        Quantity (line {index + 1})
                      </label>
                      <input
                        id={`po-row-quantity-${index}`}
                        type="number"
                        min={1}
                        value={row.quantity}
                        onChange={(event) => updateRow(index, { quantity: event.target.value })}
                        className={cn(demoControlStyles, 'h-10 w-20')}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <label htmlFor={`po-row-cost-${index}`} className="sr-only">
                        Unit cost (line {index + 1})
                      </label>
                      <input
                        id={`po-row-cost-${index}`}
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.unitCost}
                        onChange={(event) => updateRow(index, { unitCost: event.target.value })}
                        className={cn(demoControlStyles, 'h-10 w-24')}
                      />
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-ink-900">{formatCurrency(lineTotal)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={rows.length === 1}
                        aria-label={`Remove line ${index + 1}`}
                        className="inline-flex size-9 items-center justify-center rounded-lg text-ink-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-400"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40 hover:text-accent-700"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add line item
        </button>
      </fieldset>

      <div className="flex items-center justify-end gap-2 border-t border-ink-100 pt-4 text-sm">
        <span className="text-ink-500">Total</span>
        <span className="text-base font-semibold text-ink-900">{formatCurrency(total)}</span>
      </div>

      {error ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          Create purchase order
        </Button>
      </div>
    </form>
  )
}
