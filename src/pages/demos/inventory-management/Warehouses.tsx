import { useMemo, useState } from 'react'
import { Pencil, Plus, PowerOff } from 'lucide-react'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/demo/EmptyState'
import { formatNumber } from '../../../lib/format'
import { useInventoryData } from '../../../data/demos/inventory/context'
import type { Warehouse, WarehouseInput } from '../../../data/demos/inventory/types'
import { WarehouseFormModal } from './WarehouseFormModal'

/** Warehouses: card-based summary (name, manager, product/stock counts, capacity) with CRUD. */
export function Warehouses() {
  const { warehouses, products, addWarehouse, updateWarehouse, deactivateWarehouse } = useInventoryData()

  const [formOpen, setFormOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Warehouse | null>(null)

  const warehouseStats = useMemo(() => {
    const stats = new Map<string, { productCount: number; stockCount: number }>()
    for (const product of products) {
      const current = stats.get(product.warehouseId) ?? { productCount: 0, stockCount: 0 }
      stats.set(product.warehouseId, { productCount: current.productCount + 1, stockCount: current.stockCount + product.stock })
    }
    return stats
  }, [products])

  const openAddModal = () => {
    setEditingWarehouse(null)
    setFormOpen(true)
  }

  const openEditModal = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: WarehouseInput) => {
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, values)
    } else {
      addWarehouse(values)
    }
    setFormOpen(false)
  }

  const confirmDeactivate = () => {
    if (!deactivateTarget) return
    deactivateWarehouse(deactivateTarget.id)
    setDeactivateTarget(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {warehouses.length} warehouse{warehouses.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add warehouse
        </Button>
      </div>

      {warehouses.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {warehouses.map((warehouse) => {
            const stats = warehouseStats.get(warehouse.id) ?? { productCount: 0, stockCount: 0 }
            const utilization = warehouse.capacity > 0 ? Math.min(100, Math.round((stats.stockCount / warehouse.capacity) * 100)) : 0

            return (
              <li key={warehouse.id} className="rounded-2xl border border-ink-200/80 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{warehouse.name}</p>
                    <p className="truncate text-xs text-ink-500">{warehouse.location}</p>
                  </div>
                  <StatusBadge status={warehouse.status} />
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-ink-500">Manager</dt>
                    <dd className="mt-0.5 truncate text-ink-900">{warehouse.manager}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-ink-500">Products</dt>
                    <dd className="mt-0.5 text-ink-900">{formatNumber(stats.productCount)}</dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-ink-700">Capacity</span>
                    <span className="text-ink-500">
                      {formatNumber(stats.stockCount)} / {formatNumber(warehouse.capacity)} units
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-100">
                    <div
                      className={`h-2 rounded-full ${utilization >= 90 ? 'bg-red-500' : utilization >= 70 ? 'bg-amber-500' : 'bg-accent-600'}`}
                      style={{ width: `${Math.max(utilization, 2)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(warehouse)}
                    aria-label={`Edit ${warehouse.name}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  {warehouse.status === 'Active' ? (
                    <button
                      type="button"
                      onClick={() => setDeactivateTarget(warehouse)}
                      aria-label={`Deactivate ${warehouse.name}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <PowerOff className="size-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState title="No warehouses yet" message="Add a warehouse to start tracking stock by location." />
      )}

      <WarehouseFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingWarehouse={editingWarehouse} />

      <Modal
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate warehouse?"
        description={deactivateTarget ? `${deactivateTarget.name} will be marked inactive. Existing stock records are unaffected.` : undefined}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setDeactivateTarget(null)}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={confirmDeactivate}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Deactivate
          </button>
        </div>
      </Modal>
    </div>
  )
}
