import { useState } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { formatNumber } from '../../../lib/format'
import { getStockStatus } from '../../../data/demos/inventory/types'
import type { Product } from '../../../data/demos/inventory/types'
import { cn } from '../../../lib/cn'

interface StockAdjustmentModalProps {
  product: Product | null
  onClose: () => void
  onAdjust: (productId: string, quantityDelta: number, reference: string) => void
}

/** Why a count changed. Free text would make the movement log useless. */
const REASONS = [
  'Stock count correction',
  'Damaged goods',
  'Returned by customer',
  'Lost or shrinkage',
  'Transfer adjustment',
] as const

/**
 * Records a stock adjustment against one product. The store already had an
 * `adjustStock` action that writes a Movement and logs activity; it simply had
 * no way to be invoked, so on-hand numbers could never change from this page.
 *
 * Deliberately a delta rather than a new absolute count: that is how the
 * underlying Movement record is shaped, and it keeps "what changed" auditable
 * instead of overwriting history with a final figure.
 *
 * The caller keys this on the product id, so opening it for a different record
 * remounts it with empty fields. That is why there is no reset effect here.
 */
export function StockAdjustmentModal({ product, onClose, onAdjust }: StockAdjustmentModalProps) {
  const [delta, setDelta] = useState('')
  const [reason, setReason] = useState<string>(REASONS[0])
  const [error, setError] = useState<string | null>(null)

  if (!product) return null

  const parsed = Number(delta)
  const isValidNumber = delta.trim() !== '' && Number.isInteger(parsed)
  const projected = isValidNumber ? Math.max(0, product.stock + parsed) : product.stock
  const projectedProduct: Product = { ...product, stock: projected }

  const handleSubmit = () => {
    if (!isValidNumber) {
      setError('Enter a whole number, for example -3 or 12.')
      return
    }
    if (parsed === 0) {
      setError('Enter a non-zero adjustment.')
      return
    }
    if (product.stock + parsed < 0) {
      setError(`Only ${formatNumber(product.stock)} on hand — this would take stock below zero.`)
      return
    }
    onAdjust(product.id, parsed, reason)
    onClose()
  }

  return (
    <Modal
      open={product !== null}
      onClose={onClose}
      title="Adjust stock"
      description={`${product.name} · ${product.sku}`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-ink-200/80 p-3.5">
            <p className="text-xs text-ink-500">On hand now</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{formatNumber(product.stock)}</p>
          </div>
          <div
            className={cn(
              'rounded-xl border p-3.5',
              isValidNumber && parsed !== 0 ? 'border-accent-200 bg-accent-50/50' : 'border-ink-200/80',
            )}
          >
            <p className="text-xs text-ink-500">After adjustment</p>
            <p className="mt-1 text-2xl font-semibold text-ink-900">{formatNumber(projected)}</p>
          </div>
        </div>

        <div>
          <label htmlFor="stock-adjust-delta" className="mb-1.5 block text-sm font-medium text-ink-800">
            Adjustment
          </label>
          <input
            id="stock-adjust-delta"
            type="number"
            step="1"
            inputMode="numeric"
            value={delta}
            onChange={(event) => {
              setDelta(event.target.value)
              setError(null)
            }}
            placeholder="e.g. -3 or 12"
            aria-describedby="stock-adjust-help"
            aria-invalid={error !== null}
            className={demoControlStyles}
          />
          <p id="stock-adjust-help" className="mt-1.5 text-xs text-ink-500">
            Use a negative number to remove units, positive to add them. Reorder level is{' '}
            {formatNumber(product.reorderLevel)}.
          </p>
        </div>

        <div>
          <label htmlFor="stock-adjust-reason" className="mb-1.5 block text-sm font-medium text-ink-800">
            Reason
          </label>
          <select
            id="stock-adjust-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={demoControlStyles}
          >
            {REASONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-ink-500">
            Recorded against the movement so the change can be traced later.
          </p>
        </div>

        {isValidNumber && parsed !== 0 && product.stock + parsed >= 0 ? (
          <p className="text-xs text-ink-500">
            Stock status will be{' '}
            <span className="font-medium text-ink-800">{getStockStatus(projectedProduct)}</span> after this
            adjustment.
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="md" onClick={handleSubmit}>
            Record adjustment
          </Button>
        </div>
      </div>
    </Modal>
  )
}
