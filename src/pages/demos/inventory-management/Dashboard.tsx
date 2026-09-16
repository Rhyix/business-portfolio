import { Link } from '../../../lib/router'
import { StatCard } from '../../../components/demo/StatCard'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { useInventoryData } from '../../../data/demos/inventory/context'
import { formatCurrency, formatDate, formatNumber } from '../../../lib/format'
import { movementTrend, quickActions, stockByWarehouse, summaryMetrics } from '../../../data/demos/inventory/dashboard'
import { basePath } from '../../../data/demos/inventory/navigation'
import { getProductStatus } from '../../../data/demos/inventory/types'
import type { Product, PurchaseOrder } from '../../../data/demos/inventory/types'

function SectionHeader({ title }: { title: string }) {
  return <h2 className="mb-4 text-sm font-semibold text-ink-900">{title}</h2>
}

/** Dashboard: the landing page of the Inventory Management System demo. */
export function Dashboard() {
  const shared = useInventoryData()

  const lowStockProducts = shared.products
    .filter((product) => !product.discontinued && getProductStatus(product) === 'Low Stock')
    .slice(0, 5)
  const outOfStockProducts = shared.products.filter((product) => !product.discontinued && getProductStatus(product) === 'Out of Stock')
  const recentOrders = shared.purchaseOrders.slice(0, 5)

  const orderColumns: DataTableColumn<PurchaseOrder>[] = [
    { key: 'id', header: 'PO', render: (order) => <span className="font-medium text-ink-900">{order.id}</span> },
    { key: 'supplier', header: 'Supplier', render: (order) => order.supplierName },
    { key: 'expected', header: 'Expected', render: (order) => formatDate(order.expectedDate) },
    { key: 'status', header: 'Status', render: (order) => <StatusBadge status={order.status} /> },
  ]

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {summaryMetrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.format === 'currency' ? formatCurrency(metric.value) : formatNumber(metric.value)}
            icon={metric.icon}
            delta={metric.delta}
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Movement trend" subtitle="Stock movements per day, this week">
          <BarChart data={movementTrend} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Stock by warehouse" subtitle="Units on hand, current distribution">
          <BarChart data={stockByWarehouse} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Low stock" />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            {lowStockProducts.length > 0 ? (
              <ul className="divide-y divide-ink-100">
                {lowStockProducts.map((product: Product) => (
                  <li key={product.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{product.name}</p>
                      <p className="text-xs text-ink-500">
                        {product.stock} on hand · reorder at {product.reorderLevel}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={getProductStatus(product)} />
                      <Link
                        to={`${basePath}/purchase-orders`}
                        onClick={() => shared.setPendingPurchaseOrderProductId(product.id)}
                        className="rounded-full border border-ink-200 px-2.5 py-1 text-xs font-medium text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40 hover:text-accent-700"
                      >
                        Create PO
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-ink-500">Nothing is low on stock right now.</p>
            )}
          </div>
        </div>

        <div>
          <SectionHeader title="Out of stock" />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            {outOfStockProducts.length > 0 ? (
              <ul className="divide-y divide-ink-100">
                {outOfStockProducts.slice(0, 5).map((product) => (
                  <li key={product.id} className="px-4 py-3">
                    <p className="truncate text-sm font-medium text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-500">{product.sku}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-sm text-ink-500">Nothing is out of stock right now.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Recent purchase orders" />
          <DataTable
            columns={orderColumns}
            rows={recentOrders}
            rowKey={(order) => order.id}
            emptyTitle="No purchase orders yet"
            emptyMessage="Purchase orders will appear here once created."
          />
        </div>

        <div>
          <SectionHeader title="Quick actions" />
          <div className="grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  to={`${basePath}${action.to}`}
                  className="flex items-center gap-3 rounded-xl border border-ink-200/80 bg-white p-3.5 transition-colors duration-200 hover:border-accent-300 hover:bg-accent-50/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-ink-200/80 bg-white text-accent-600">
                    <Icon className="size-4" aria-hidden="true" strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink-900">{action.label}</span>
                    <span className="block truncate text-xs text-ink-500">{action.description}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <SectionHeader title="Recent activity" />
        <div className="rounded-xl border border-ink-200/80 bg-white">
          <ul className="divide-y divide-ink-100">
            {shared.activity.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <p className="text-sm text-ink-800">{item.message}</p>
                <span className="shrink-0 text-xs text-ink-400">{formatDate(item.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
