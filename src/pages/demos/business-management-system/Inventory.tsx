import { useMemo, useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, CircleAlert, PackageCheck, PackageX, Settings2 } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { StatCard } from '../../../components/demo/StatCard'
import { formatDate, formatNumber } from '../../../lib/format'
import { initialProducts } from '../../../data/demos/business-management/products'
import { stockMovements } from '../../../data/demos/business-management/inventory'
import type { Product, StockMovementType } from '../../../data/demos/business-management/types'
import { useOptionalIntegratedData } from '../../../data/demos/integrated/context'

function stockStatus(product: Product): 'Healthy' | 'Low stock' | 'Out of stock' {
  if (product.stock === 0) return 'Out of stock'
  if (product.stock <= product.reorderLevel) return 'Low stock'
  return 'Healthy'
}

function matchesSearch(product: Product, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return product.name.toLowerCase().includes(needle) || product.sku.toLowerCase().includes(needle)
}

const movementIcons: Record<StockMovementType, typeof ArrowUpCircle> = {
  Restock: ArrowUpCircle,
  Sale: ArrowDownCircle,
  Adjustment: Settings2,
}

/**
 * Inventory page: at-a-glance stock health, filterable stock table and
 * recent movement log. Reads live product stock from the shared
 * integrated-platform store when available, so orders placed elsewhere in
 * the platform are reflected here within the same demo session.
 */
export function Inventory() {
  const shared = useOptionalIntegratedData()
  const products = shared ? shared.products : initialProducts
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  )

  const counts = useMemo(() => {
    return products.reduce(
      (totals, product) => {
        const status = stockStatus(product)
        if (status === 'Healthy') totals.healthy += 1
        else if (status === 'Low stock') totals.low += 1
        else totals.out += 1
        return totals
      },
      { healthy: 0, low: 0, out: 0 },
    )
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        (categoryFilter === 'All' || product.category === categoryFilter) &&
        matchesSearch(product, searchTerm),
    )
  }, [products, searchTerm, categoryFilter])

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
    { key: 'category', header: 'Category', render: (product) => product.category },
    { key: 'stock', header: 'Stock on hand', render: (product) => formatNumber(product.stock) },
    { key: 'reorder', header: 'Reorder at', render: (product) => formatNumber(product.reorderLevel) },
    { key: 'status', header: 'Status', render: (product) => <StatusBadge status={stockStatus(product)} /> },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Healthy stock" value={String(counts.healthy)} icon={PackageCheck} />
        <StatCard label="Low stock" value={String(counts.low)} icon={CircleAlert} />
        <StatCard label="Out of stock" value={String(counts.out)} icon={PackageX} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by product name or SKU…"
              aria-label="Search inventory"
              className="sm:max-w-sm"
            />
            <FilterDropdown
              label="Category"
              value={categoryFilter}
              options={categories}
              onChange={setCategoryFilter}
              className="sm:w-48"
            />
          </div>

          <DataTable
            columns={columns}
            rows={filteredProducts}
            rowKey={(product) => product.id}
            emptyTitle="No products found"
            emptyMessage="Try a different search term or category filter."
          />
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Recent stock movement</h2>
          <div className="rounded-xl border border-ink-200/80 bg-white">
            <ul className="divide-y divide-ink-100">
              {stockMovements.map((movement) => {
                const Icon = movementIcons[movement.type]
                return (
                  <li key={movement.id} className="flex items-start gap-3 px-4 py-3">
                    <Icon
                      className={movement.quantity >= 0 ? 'mt-0.5 size-4 shrink-0 text-emerald-600' : 'mt-0.5 size-4 shrink-0 text-ink-400'}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{movement.productName}</p>
                      <p className="text-xs text-ink-500">
                        {movement.type} · {movement.quantity > 0 ? '+' : ''}
                        {movement.quantity} · {formatDate(movement.date)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
