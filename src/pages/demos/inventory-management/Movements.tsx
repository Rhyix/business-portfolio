import { useId, useMemo, useState } from 'react'
import { ArrowDownCircle, ArrowLeftRight, ArrowUpCircle, Settings2 } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { Modal } from '../../../components/demo/Modal'
import { formatDate, formatNumber } from '../../../lib/format'
import { useInventoryData } from '../../../data/demos/inventory/context'
import type { StockMovement, StockMovementType } from '../../../data/demos/inventory/types'

const typeOptions: StockMovementType[] = ['Stock In', 'Stock Out', 'Transfer', 'Adjustment']

const typeIcons: Record<StockMovementType, typeof ArrowUpCircle> = {
  'Stock In': ArrowUpCircle,
  'Stock Out': ArrowDownCircle,
  Transfer: ArrowLeftRight,
  Adjustment: Settings2,
}

const typeTone: Record<StockMovementType, string> = {
  'Stock In': 'text-emerald-600',
  'Stock Out': 'text-red-600',
  Transfer: 'text-accent-600',
  Adjustment: 'text-amber-600',
}

function matchesSearch(movement: StockMovement, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    movement.productName.toLowerCase().includes(needle) ||
    movement.reference.toLowerCase().includes(needle) ||
    movement.id.toLowerCase().includes(needle)
  )
}

/** Stock Movements: the live movement ledger — every stock-affecting action in this demo appends here. */
export function Movements() {
  const { movements, warehouses } = useInventoryData()

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [warehouseFilter, setWarehouseFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [detailMovementId, setDetailMovementId] = useState<string | null>(null)

  const dateFilterId = useId()
  const warehouseNameById = useMemo(() => new Map(warehouses.map((warehouse) => [warehouse.id, warehouse.name])), [warehouses])

  const filteredMovements = useMemo(() => {
    return movements
      .filter(
        (movement) =>
          (typeFilter === 'All' || movement.type === typeFilter) &&
          (warehouseFilter === 'All' || movement.warehouseId === warehouseFilter) &&
          (!dateFilter || movement.date === dateFilter) &&
          matchesSearch(movement, searchTerm),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [movements, searchTerm, typeFilter, warehouseFilter, dateFilter])

  const detailMovement = detailMovementId ? (movements.find((movement) => movement.id === detailMovementId) ?? null) : null

  const columns: DataTableColumn<StockMovement>[] = [
    {
      key: 'id',
      header: 'Movement',
      render: (movement) => (
        <button
          type="button"
          onClick={() => setDetailMovementId(movement.id)}
          className="block text-left font-medium text-ink-900 hover:text-accent-600"
        >
          {movement.id}
        </button>
      ),
    },
    { key: 'product', header: 'Product', render: (movement) => movement.productName },
    { key: 'warehouse', header: 'Warehouse', render: (movement) => movement.warehouseName },
    {
      key: 'type',
      header: 'Type',
      render: (movement) => {
        const Icon = typeIcons[movement.type]
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium ${typeTone[movement.type]}`}>
            <Icon className="size-4" aria-hidden="true" />
            {movement.type}
          </span>
        )
      },
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (movement) => (
        <span className="font-medium text-ink-900">
          {movement.type === 'Stock Out' ? '-' : movement.quantity > 0 ? '+' : ''}
          {formatNumber(Math.abs(movement.quantity))}
        </span>
      ),
    },
    { key: 'reference', header: 'Reference', render: (movement) => movement.reference },
    { key: 'date', header: 'Date', render: (movement) => formatDate(movement.date) },
    { key: 'user', header: 'User', render: (movement) => movement.user },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">
        {filteredMovements.length} movement{filteredMovements.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by product or reference…"
          aria-label="Search stock movements"
          className="lg:max-w-sm"
        />
        <FilterDropdown label="Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} className="lg:w-40" />
        <FilterDropdown
          label="Warehouse"
          value={warehouseFilter === 'All' ? 'All' : (warehouseNameById.get(warehouseFilter) ?? 'All')}
          options={warehouses.map((warehouse) => warehouse.name)}
          onChange={(value) => {
            const match = warehouses.find((warehouse) => warehouse.name === value)
            setWarehouseFilter(match ? match.id : 'All')
          }}
          className="lg:w-44"
        />
        <div className="lg:w-44">
          <label htmlFor={dateFilterId} className="sr-only">
            Filter by date
          </label>
          <input
            id={dateFilterId}
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
          />
        </div>
        {dateFilter ? (
          <button type="button" onClick={() => setDateFilter('')} className="text-xs font-medium text-accent-600 hover:text-accent-700">
            Clear date
          </button>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        rows={filteredMovements}
        rowKey={(movement) => movement.id}
        emptyTitle="No movements found"
        emptyMessage="Try a different search term or filter."
      />

      <Modal
        open={detailMovement !== null}
        onClose={() => setDetailMovementId(null)}
        title="Movement details"
        description={detailMovement?.id}
      >
        {detailMovement ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-ink-500">Product</dt>
              <dd className="mt-0.5 text-ink-900">{detailMovement.productName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Warehouse</dt>
              <dd className="mt-0.5 text-ink-900">{detailMovement.warehouseName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Type</dt>
              <dd className="mt-0.5 text-ink-900">{detailMovement.type}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Quantity</dt>
              <dd className="mt-0.5 text-ink-900">{formatNumber(detailMovement.quantity)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Reference</dt>
              <dd className="mt-0.5 text-ink-900">{detailMovement.reference}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Date</dt>
              <dd className="mt-0.5 text-ink-900">{formatDate(detailMovement.date)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">User</dt>
              <dd className="mt-0.5 text-ink-900">{detailMovement.user}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </div>
  )
}
