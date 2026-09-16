import { ArrowRight } from 'lucide-react'
import { Link } from '../../../lib/router'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { StatCard } from '../../../components/demo/StatCard'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatCurrency, formatDate, formatNumber } from '../../../lib/format'
import {
  orderActivitySeries,
  quickActions,
  revenueSeries,
  summaryMetrics,
} from '../../../data/demos/business-management/dashboard'
import { initialOrders } from '../../../data/demos/business-management/orders'
import { initialProducts } from '../../../data/demos/business-management/products'
import { initialCustomers } from '../../../data/demos/business-management/customers'
import type { Order } from '../../../data/demos/business-management/types'

const DEMO_BASE_PATH = '/solutions/business-management-system'

const recentOrderColumns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'Order', render: (order) => <span className="font-medium text-ink-900">{order.id}</span> },
  { key: 'customer', header: 'Customer', render: (order) => order.customerName },
  { key: 'date', header: 'Date', render: (order) => formatDate(order.date) },
  {
    key: 'total',
    header: 'Total',
    render: (order) => <span className="font-medium text-ink-900">{formatCurrency(order.total)}</span>,
  },
  { key: 'status', header: 'Status', render: (order) => <StatusBadge status={order.status} /> },
]

function SectionHeader({ title, viewAllHref }: { title: string; viewAllHref?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
      {viewAllHref ? (
        <Link
          to={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 transition-colors duration-200 hover:text-accent-700"
        >
          View all
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}

/** Dashboard: the landing page of the Business Management System demo. */
export function Dashboard() {
  const recentOrders = initialOrders.slice(0, 5)

  const lowStockProducts = initialProducts
    .filter((product) => product.stock <= product.reorderLevel)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5)

  const recentCustomers = [...initialCustomers]
    .sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <ChartCard title="Revenue" subtitle="Last 6 months">
          <BarChart data={revenueSeries} formatValue={formatCurrency} />
        </ChartCard>
        <ChartCard title="Order activity" subtitle="Orders per day, this week">
          <BarChart data={orderActivitySeries} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Recent orders" viewAllHref={`${DEMO_BASE_PATH}/orders`} />
          <DataTable columns={recentOrderColumns} rows={recentOrders} rowKey={(order) => order.id} />
        </div>

        <div>
          <SectionHeader title="Low-stock products" viewAllHref={`${DEMO_BASE_PATH}/inventory`} />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            <ul className="divide-y divide-ink-100">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-500">{formatNumber(product.stock)} in stock</p>
                  </div>
                  <StatusBadge status={product.stock === 0 ? 'Out of stock' : 'Low stock'} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Recent customer activity" viewAllHref={`${DEMO_BASE_PATH}/customers`} />
          <div className="rounded-xl border border-ink-200/80 bg-white">
            <ul className="divide-y divide-ink-100">
              {recentCustomers.map((customer) => (
                <li key={customer.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">{customer.name}</p>
                    <p className="truncate text-xs text-ink-500">{customer.company}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-ink-400">Joined {formatDate(customer.joined)}</span>
                    <StatusBadge status={customer.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionHeader title="Quick actions" />
          <div className="grid gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  to={`${DEMO_BASE_PATH}${action.to}`}
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
    </div>
  )
}
