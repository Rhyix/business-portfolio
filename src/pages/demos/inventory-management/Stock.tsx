import { useMemo, useState } from 'react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { formatNumber } from '../../../lib/format'
import { useInventoryData } from '../../../data/demos/inventory/context'
import { getStockStatus } from '../../../data/demos/inventory/types'
import type { Product } from '../../../data/demos/inventory/types'

function matchesSearch(product: Product, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return product.name.toLowerCase().includes(needle) || product.sku.toLowerCase().includes(needle)
}

/**
 * Stock: the current inventory-health view, distinct from Products — no
 * CRUD here, just on-hand/reserved/available numbers and a 4-tier stock
 * status (Healthy/Low/Critical/Out of Stock) computed from the same
 * Product records Products.tsx manages.
 */
export function Stock() {
  const { products, warehouses } = useInventoryData()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [warehouseFilter, setWarehouseFilter] = useState('All')
  const [lowStockOnly, setLowStockOnly] = useState(false)

  const warehouseNameById = useMemo(() => new Map(warehouses.map((warehouse) => [warehouse.id, warehouse.name])), [warehouses])
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const status = getStockStatus(product)
      return (
        (categoryFilter === 'All' || product.category === categoryFilter) &&
        (warehouseFilter === 'All' || product.warehouseId === warehouseFilter) &&
        (!lowStockOnly || status === 'Low' || status === 'Critical' || status === 'Out of Stock') &&
        matchesSearch(product, searchTerm)
      )
    })
  }, [products, searchTerm, categoryFilter, warehouseFilter, lowStockOnly])

  const columns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (product) => (
        <span>
          <span className="block font-medium text-ink-900">{product.name}</span>
          <span className="block text-xs text-ink-500">{product.sku}</span>
        </span>
      ),
    },
    { key: 'warehouse', header: 'Warehouse', render: (product) => warehouseNameById.get(product.warehouseId) ?? '—' },
    { key: 'onHand', header: 'On Hand', render: (product) => formatNumber(product.stock) },
    { key: 'reserved', header: 'Reserved', render: (product) => formatNumber(product.reserved) },
    {
      key: 'available',
      header: 'Available',
      render: (product) => <span className="font-medium text-ink-900">{formatNumber(Math.max(0, product.stock - product.reserved))}</span>,
    },
    { key: 'reorder', header: 'Reorder Level', render: (product) => formatNumber(product.reorderLevel) },
    { key: 'status', header: 'Stock Status', render: (product) => <StatusBadge status={getStockStatus(product)} /> },
  ]

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-500">
        {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by product name or SKU…"
          aria-label="Search stock"
          className="lg:max-w-sm"
        />
        <FilterDropdown label="Category" value={categoryFilter} options={categories} onChange={setCategoryFilter} className="lg:w-44" />
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
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(event) => setLowStockOnly(event.target.checked)}
            className="size-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-100"
          />
          Low stock only
        </label>
      </div>

      <DataTable
        columns={columns}
        rows={filteredProducts}
        rowKey={(product) => product.id}
        emptyTitle="No stock records found"
        emptyMessage="Try a different search term or filter."
      />
    </div>
  )
}
