import { useId, useMemo, useState } from 'react'
import { Mail, Pencil, Phone, PowerOff, Plus } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatNumber } from '../../../lib/format'
import { useInventoryData } from '../../../data/demos/inventory/context'
import type { Supplier, SupplierInput } from '../../../data/demos/inventory/types'
import { SupplierFormModal } from './SupplierFormModal'

function matchesSearch(supplier: Supplier, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return supplier.name.toLowerCase().includes(needle) || supplier.contactName.toLowerCase().includes(needle)
}

/** Suppliers: search, category/status filters, CRUD, and Products/Orders counts derived from purchase order history. */
export function Suppliers() {
  const { suppliers, purchaseOrders, addSupplier, updateSupplier, deactivateSupplier } = useInventoryData()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [detailSupplierId, setDetailSupplierId] = useState<string | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Supplier | null>(null)

  const detailId = useId()
  const categories = useMemo(() => Array.from(new Set(suppliers.map((supplier) => supplier.category))).sort(), [suppliers])

  const orderCountBySupplier = useMemo(() => {
    const counts = new Map<string, number>()
    for (const order of purchaseOrders) {
      counts.set(order.supplierId, (counts.get(order.supplierId) ?? 0) + 1)
    }
    return counts
  }, [purchaseOrders])

  /** Distinct products ordered from each supplier, derived from purchase order history (this demo has no direct Product→Supplier link). */
  const productCountBySupplier = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const order of purchaseOrders) {
      const set = map.get(order.supplierId) ?? new Set<string>()
      for (const item of order.items) set.add(item.productId)
      map.set(order.supplierId, set)
    }
    return map
  }, [purchaseOrders])

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (supplier) =>
        (categoryFilter === 'All' || supplier.category === categoryFilter) &&
        (statusFilter === 'All' || supplier.status === statusFilter) &&
        matchesSearch(supplier, searchTerm),
    )
  }, [suppliers, searchTerm, categoryFilter, statusFilter])

  const detailSupplier = detailSupplierId ? (suppliers.find((supplier) => supplier.id === detailSupplierId) ?? null) : null

  const openAddModal = () => {
    setEditingSupplier(null)
    setFormOpen(true)
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: SupplierInput) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, values)
    } else {
      addSupplier(values)
    }
    setFormOpen(false)
  }

  const confirmDeactivate = () => {
    if (!deactivateTarget) return
    deactivateSupplier(deactivateTarget.id)
    setDeactivateTarget(null)
  }

  const columns: DataTableColumn<Supplier>[] = [
    {
      key: 'name',
      header: 'Supplier',
      render: (supplier) => (
        <button
          type="button"
          onClick={() => setDetailSupplierId(supplier.id)}
          className="block text-left font-medium text-ink-900 hover:text-accent-600"
        >
          {supplier.name}
          <span className="block text-xs font-normal text-ink-500">{supplier.contactName}</span>
        </button>
      ),
    },
    { key: 'category', header: 'Category', render: (supplier) => supplier.category },
    {
      key: 'products',
      header: 'Products',
      render: (supplier) => formatNumber(productCountBySupplier.get(supplier.id)?.size ?? 0),
    },
    { key: 'orders', header: 'Orders', render: (supplier) => formatNumber(orderCountBySupplier.get(supplier.id) ?? 0) },
    { key: 'status', header: 'Status', render: (supplier) => <StatusBadge status={supplier.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (supplier) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(supplier)}
            aria-label={`Edit ${supplier.name}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          {supplier.status === 'Active' ? (
            <button
              type="button"
              onClick={() => setDeactivateTarget(supplier)}
              aria-label={`Deactivate ${supplier.name}`}
              className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
            >
              <PowerOff className="size-4" aria-hidden="true" />
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
          {filteredSuppliers.length} supplier{filteredSuppliers.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add supplier
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by supplier or contact name…"
          aria-label="Search suppliers"
          className="sm:max-w-sm"
        />
        <FilterDropdown label="Category" value={categoryFilter} options={categories} onChange={setCategoryFilter} className="sm:w-44" />
        <FilterDropdown label="Status" value={statusFilter} options={['Active', 'Inactive']} onChange={setStatusFilter} className="sm:w-40" />
      </div>

      <DataTable
        columns={columns}
        rows={filteredSuppliers}
        rowKey={(supplier) => supplier.id}
        emptyTitle="No suppliers found"
        emptyMessage="Try a different search term or filter."
      />

      <SupplierFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingSupplier={editingSupplier} />

      <Modal open={detailSupplier !== null} onClose={() => setDetailSupplierId(null)} title="Supplier details" description={detailSupplier?.id}>
        {detailSupplier ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p id={detailId} className="text-sm font-semibold text-ink-900">
                {detailSupplier.name}
              </p>
              <StatusBadge status={detailSupplier.status} />
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Contact</dt>
                <dd className="mt-0.5 text-ink-900">{detailSupplier.contactName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Category</dt>
                <dd className="mt-0.5 text-ink-900">{detailSupplier.category}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Email</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-ink-900">
                  <Mail className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  <span className="truncate">{detailSupplier.email}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Phone</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-ink-900">
                  <Phone className="size-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  {detailSupplier.phone}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Products supplied</dt>
                <dd className="mt-0.5 text-ink-900">{formatNumber(productCountBySupplier.get(detailSupplier.id)?.size ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Purchase orders</dt>
                <dd className="mt-0.5 text-ink-900">{formatNumber(orderCountBySupplier.get(detailSupplier.id) ?? 0)}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate supplier?"
        description={deactivateTarget ? `${deactivateTarget.name} will be marked inactive.` : undefined}
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
