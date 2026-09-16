import { useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatCurrency, formatNumber } from '../../../lib/format'
import { initialProducts } from '../../../data/demos/business-management/products'
import type { Product } from '../../../data/demos/business-management/types'
import { ProductFormModal } from './ProductFormModal'
import type { ProductFormValues } from './ProductFormModal'

const PAGE_SIZE = 8

function stockStatus(product: Product): 'Healthy' | 'Low stock' | 'Out of stock' {
  if (product.stock === 0) return 'Out of stock'
  if (product.stock <= product.reorderLevel) return 'Low stock'
  return 'Healthy'
}

function matchesSearch(product: Product, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return (
    product.name.toLowerCase().includes(needle) ||
    product.sku.toLowerCase().includes(needle) ||
    product.category.toLowerCase().includes(needle)
  )
}

/** Product catalogue page: search, category filter and CRUD-style interactions over local state. */
export function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const nextIdRef = useRef(2015)

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  )

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        (categoryFilter === 'All' || product.category === categoryFilter) &&
        matchesSearch(product, searchTerm),
    )
  }, [products, searchTerm, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE)

  const updateSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1)
  }

  const updateCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    setPage(1)
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id ? { ...product, ...values } : product,
        ),
      )
    } else {
      const newProduct: Product = { id: `PRD-${nextIdRef.current}`, ...values }
      nextIdRef.current += 1
      setProducts((current) => [newProduct, ...current])
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    setProducts((current) => current.filter((product) => product.id !== deleteTarget.id))
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
    {
      key: 'price',
      header: 'Price',
      render: (product) => <span className="font-medium text-ink-900">{formatCurrency(product.price)}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product) => (
        <span className="flex items-center gap-2">
          {formatNumber(product.stock)}
          <StatusBadge status={stockStatus(product)} />
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (product) => <StatusBadge status={product.status} /> },
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
          <button
            type="button"
            onClick={() => setDeleteTarget(product)}
            aria-label={`Remove ${product.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={updateSearch}
          placeholder="Search products by name, SKU or category…"
          aria-label="Search products"
          className="sm:max-w-sm"
        />
        <FilterDropdown
          label="Category"
          value={categoryFilter}
          options={categories}
          onChange={updateCategoryFilter}
          className="sm:w-48"
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(product) => product.id}
        emptyTitle="No products found"
        emptyMessage="Try a different search term or category filter."
      />

      {filteredProducts.length > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-500">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filteredProducts.length)} of{' '}
            {filteredProducts.length}
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
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remove product?"
        description={
          deleteTarget
            ? `${deleteTarget.name} will be removed from this demo catalogue. This cannot be undone.`
            : undefined
        }
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
            Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}
