import { useId, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatNumber } from '../../../lib/format'
import { useInventoryData } from '../../../data/demos/inventory/context'
import { getProductStatus } from '../../../data/demos/inventory/types'
import type { Product, ProductInput } from '../../../data/demos/inventory/types'
import { ProductFormModal } from './ProductFormModal'

const PAGE_SIZE = 8

type SortKey = 'name' | 'stock-asc' | 'stock-desc'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'name', label: 'Sort: Name A–Z' },
  { value: 'stock-asc', label: 'Sort: Lowest stock first' },
  { value: 'stock-desc', label: 'Sort: Highest stock first' },
]

function matchesSearch(product: Product, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return product.name.toLowerCase().includes(needle) || product.sku.toLowerCase().includes(needle)
}

/** Products: search, category/warehouse/status filters, sort, pagination and CRUD. */
export function Products() {
  const { products, warehouses, addProduct, updateProduct, discontinueProduct } = useInventoryData()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [warehouseFilter, setWarehouseFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const sortSelectId = useId()

  const warehouseNameById = useMemo(() => new Map(warehouses.map((warehouse) => [warehouse.id, warehouse.name])), [warehouses])
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products])
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued']

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        (categoryFilter === 'All' || product.category === categoryFilter) &&
        (warehouseFilter === 'All' || product.warehouseId === warehouseFilter) &&
        (statusFilter === 'All' || getProductStatus(product) === statusFilter) &&
        matchesSearch(product, searchTerm),
    )

    const sorted = [...filtered]
    if (sortKey === 'stock-asc') sorted.sort((a, b) => a.stock - b.stock)
    else if (sortKey === 'stock-desc') sorted.sort((a, b) => b.stock - a.stock)
    else sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [products, searchTerm, categoryFilter, warehouseFilter, statusFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE)

  const resetToFirstPage = () => setPage(1)

  const openAddModal = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: ProductInput) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values)
    } else {
      addProduct(values)
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    discontinueProduct(deleteTarget.id)
    setDeleteTarget(null)
  }

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
    { key: 'warehouse', header: 'Warehouse', render: (product) => warehouseNameById.get(product.warehouseId) ?? '—' },
    { key: 'price', header: 'Price', render: (product) => <span className="font-medium text-ink-900">{formatCurrency(product.price)}</span> },
    { key: 'stock', header: 'Stock', render: (product) => formatNumber(product.stock) },
    { key: 'reorder', header: 'Reorder Level', render: (product) => formatNumber(product.reorderLevel) },
    { key: 'status', header: 'Status', render: (product) => <StatusBadge status={getProductStatus(product)} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (product) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(product)}
            aria-label={`Edit ${product.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          {!product.discontinued ? (
            <button
              type="button"
              onClick={() => setDeleteTarget(product)}
              aria-label={`Discontinue ${product.name}`}
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add product
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value)
            resetToFirstPage()
          }}
          placeholder="Search products by name or SKU…"
          aria-label="Search products"
          className="lg:max-w-sm"
        />
        <FilterDropdown
          label="Category"
          value={categoryFilter}
          options={categories}
          onChange={(value) => {
            setCategoryFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-44"
        />
        <FilterDropdown
          label="Warehouse"
          value={warehouseFilter === 'All' ? 'All' : (warehouseNameById.get(warehouseFilter) ?? 'All')}
          options={warehouses.map((warehouse) => warehouse.name)}
          onChange={(value) => {
            const match = warehouses.find((warehouse) => warehouse.name === value)
            setWarehouseFilter(match ? match.id : 'All')
            resetToFirstPage()
          }}
          className="lg:w-44"
        />
        <FilterDropdown
          label="Status"
          value={statusFilter}
          options={statuses}
          onChange={(value) => {
            setStatusFilter(value)
            resetToFirstPage()
          }}
          className="lg:w-40"
        />
        <div className="relative lg:w-52">
          <label htmlFor={sortSelectId} className="sr-only">
            Sort products
          </label>
          <select
            id={sortSelectId}
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="h-10 w-full appearance-none rounded-lg border border-ink-200 bg-white py-2 pr-9 pl-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(product) => product.id}
        emptyTitle="No products found"
        emptyMessage="Try a different search term or filter."
      />

      {filteredProducts.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="text-xs font-medium text-ink-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition-colors duration-200 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingProduct={editingProduct}
        warehouses={warehouses}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Discontinue product?"
        description={deleteTarget ? `${deleteTarget.name} will be marked discontinued. This cannot be undone in this demo.` : undefined}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" size="md" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-red-700"
          >
            Discontinue
          </button>
        </div>
      </Modal>
    </div>
  )
}
