import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { SearchInput } from '../../../components/demo/SearchInput'
import { FilterDropdown } from '../../../components/demo/FilterDropdown'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { Button } from '../../../components/ui/Button'
import { formatDate } from '../../../lib/format'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import { formatKpiTarget, formatKpiValue } from '../../../data/demos/admin-dashboard/types'
import type { Kpi, KpiInput } from '../../../data/demos/admin-dashboard/types'
import { KpiFormModal } from './KpiFormModal'

const categoryOptions = ['Financial', 'Operational', 'Workforce', 'Customer', 'Compliance']
const statusOptions = ['On Track', 'Attention', 'Below Target']

function matchesSearch(kpi: Kpi, term: string): boolean {
  const needle = term.trim().toLowerCase()
  if (!needle) return true
  return kpi.metric.toLowerCase().includes(needle)
}

/** KPIs: search, category/status filters, CRUD and a read-only detail view. */
export function Kpis() {
  const { kpis, addKpi, updateKpi, removeKpi } = useAdminDashboardData()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingKpi, setEditingKpi] = useState<Kpi | null>(null)
  const [detailKpiId, setDetailKpiId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Kpi | null>(null)

  const filteredKpis = useMemo(() => {
    return kpis
      .filter(
        (kpi) =>
          (categoryFilter === 'All' || kpi.category === categoryFilter) &&
          (statusFilter === 'All' || kpi.status === statusFilter) &&
          matchesSearch(kpi, searchTerm),
      )
      .sort((a, b) => a.metric.localeCompare(b.metric))
  }, [kpis, searchTerm, categoryFilter, statusFilter])

  const detailKpi = detailKpiId ? (kpis.find((kpi) => kpi.id === detailKpiId) ?? null) : null

  const openAddModal = () => {
    setEditingKpi(null)
    setFormOpen(true)
  }

  const openEditModal = (kpi: Kpi) => {
    setEditingKpi(kpi)
    setFormOpen(true)
  }

  const handleFormSubmit = (values: KpiInput) => {
    if (editingKpi) {
      updateKpi(editingKpi.id, values)
    } else {
      addKpi(values)
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    removeKpi(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns: DataTableColumn<Kpi>[] = [
    {
      key: 'metric',
      header: 'Metric',
      render: (kpi) => (
        <button type="button" onClick={() => setDetailKpiId(kpi.id)} className="block text-left font-medium text-ink-900 hover:text-accent-600">
          {kpi.metric}
        </button>
      ),
    },
    { key: 'category', header: 'Category', render: (kpi) => kpi.category },
    { key: 'current', header: 'Current Value', render: (kpi) => <span className="font-medium text-ink-900">{formatKpiValue(kpi)}</span> },
    { key: 'target', header: 'Target', render: (kpi) => formatKpiTarget(kpi) },
    {
      key: 'change',
      header: 'Change',
      render: (kpi) => (
        <span className={kpi.changePct >= 0 ? 'text-emerald-600' : 'text-red-600'}>
          {kpi.changePct >= 0 ? '+' : ''}
          {kpi.changePct}%
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (kpi) => <StatusBadge status={kpi.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (kpi) => (
        <span className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => openEditModal(kpi)}
            aria-label={`Edit ${kpi.metric}`}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(kpi)}
            aria-label={`Remove ${kpi.metric}`}
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
          {filteredKpis.length} KPI{filteredKpis.length === 1 ? '' : 's'}
        </p>
        <Button type="button" size="md" onClick={openAddModal}>
          <Plus className="size-4" aria-hidden="true" />
          Add KPI
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search KPIs by metric name…" aria-label="Search KPIs" className="lg:max-w-sm" />
        <FilterDropdown label="Category" value={categoryFilter} options={categoryOptions} onChange={setCategoryFilter} className="lg:w-44" />
        <FilterDropdown label="Status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="lg:w-44" />
      </div>

      <DataTable columns={columns} rows={filteredKpis} rowKey={(kpi) => kpi.id} emptyTitle="No KPIs found" emptyMessage="Try a different search term or filter." />

      <KpiFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} editingKpi={editingKpi} />

      <Modal
        open={detailKpi !== null}
        onClose={() => setDetailKpiId(null)}
        title={detailKpi?.metric ?? 'KPI'}
        description={detailKpi ? `${detailKpi.category} · updated ${formatDate(detailKpi.updatedDate)}` : undefined}
      >
        {detailKpi ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-ink-500">Current value</dt>
              <dd className="mt-0.5 text-ink-900">{formatKpiValue(detailKpi)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Target</dt>
              <dd className="mt-0.5 text-ink-900">{formatKpiTarget(detailKpi)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Change</dt>
              <dd className="mt-0.5 text-ink-900">
                {detailKpi.changePct >= 0 ? '+' : ''}
                {detailKpi.changePct}%
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-ink-500">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={detailKpi.status} />
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remove KPI?"
        description={deleteTarget ? `${deleteTarget.metric} will be removed from the KPI list. This cannot be undone in this demo.` : undefined}
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
