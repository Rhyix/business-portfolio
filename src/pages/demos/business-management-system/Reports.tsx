import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DataTable } from '../../../components/demo/DataTable'
import type { DataTableColumn } from '../../../components/demo/DataTable'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatCurrency, formatNumber } from '../../../lib/format'
import { orderActivitySeries, revenueSeries } from '../../../data/demos/business-management/dashboard'
import { initialOrders } from '../../../data/demos/business-management/orders'
import type { OrderStatus } from '../../../data/demos/business-management/types'

const STATUS_ORDER: OrderStatus[] = ['Completed', 'Processing', 'Pending', 'Cancelled']

const statusTone: Record<OrderStatus, string> = {
  Completed: 'bg-emerald-500',
  Processing: 'bg-accent-500',
  Pending: 'bg-amber-500',
  Cancelled: 'bg-ink-300',
}

interface TopProductRow {
  name: string
  quantity: number
  revenue: number
}

const topProductColumns: DataTableColumn<TopProductRow>[] = [
  { key: 'name', header: 'Product', render: (row) => <span className="font-medium text-ink-900">{row.name}</span> },
  { key: 'quantity', header: 'Units sold', render: (row) => formatNumber(row.quantity) },
  {
    key: 'revenue',
    header: 'Revenue',
    render: (row) => <span className="font-medium text-ink-900">{formatCurrency(row.revenue)}</span>,
  },
]

const totalRevenue = revenueSeries.reduce((sum, point) => sum + point.value, 0)

const orderStatusCounts = initialOrders.reduce<Record<OrderStatus, number>>(
  (totals, order) => ({ ...totals, [order.status]: totals[order.status] + 1 }),
  { Pending: 0, Processing: 0, Completed: 0, Cancelled: 0 },
)

/** Order status breakdown for the "Sales performance" card, computed once from static demo data. */
const statusBreakdown = STATUS_ORDER.map((status) => ({
  status,
  count: orderStatusCounts[status],
  percent: Math.round((orderStatusCounts[status] / initialOrders.length) * 100),
}))

const productTotals = initialOrders
  .flatMap((order) => order.items)
  .reduce<Record<string, TopProductRow>>((totals, item) => {
    const existing = totals[item.productName] ?? { name: item.productName, quantity: 0, revenue: 0 }

    return {
      ...totals,
      [item.productName]: {
        name: item.productName,
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.quantity * item.unitPrice,
      },
    }
  }, {})

/** Best-selling products by revenue for the "Top products" card. */
const topProducts = Object.values(productTotals)
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5)

/** Reports page: a handful of simple, polished visualisations built on the same demo order data. */
export function Reports() {
  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Revenue overview" subtitle={`${formatCurrency(totalRevenue)} over the last 6 months`}>
          <BarChart data={revenueSeries} formatValue={formatCurrency} />
        </ChartCard>
        <ChartCard title="Order activity" subtitle="Orders per day, this week">
          <BarChart data={orderActivitySeries} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Sales performance" subtitle="Order status breakdown, current period">
          <div className="space-y-4">
            {statusBreakdown.map((entry) => (
              <div key={entry.status}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-700">{entry.status}</span>
                  <span className="text-ink-500">
                    {entry.count} order{entry.count === 1 ? '' : 's'} · {entry.percent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-ink-100">
                  <div
                    className={`h-2 rounded-full ${statusTone[entry.status]}`}
                    style={{ width: `${Math.max(entry.percent, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top products" subtitle="By revenue, this period">
          <DataTable columns={topProductColumns} rows={topProducts} rowKey={(row) => row.name} />
        </ChartCard>
      </div>
    </div>
  )
}
