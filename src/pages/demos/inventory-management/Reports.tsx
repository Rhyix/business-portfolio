import { useMemo } from 'react'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatCurrency, formatNumber } from '../../../lib/format'
import { useInventoryData } from '../../../data/demos/inventory/context'
import { getStockStatus } from '../../../data/demos/inventory/types'
import type { PurchaseOrderStatus, StockStatus } from '../../../data/demos/inventory/types'

const stockStatusOrder: StockStatus[] = ['Healthy', 'Low', 'Critical', 'Out of Stock']
const stockStatusTone: Record<StockStatus, string> = {
  Healthy: 'bg-emerald-500',
  Low: 'bg-amber-500',
  Critical: 'bg-red-400',
  'Out of Stock': 'bg-red-600',
}

const poStatusOrder: PurchaseOrderStatus[] = ['Draft', 'Ordered', 'Partially Received', 'Received', 'Cancelled']
const poStatusTone: Record<PurchaseOrderStatus, string> = {
  Draft: 'bg-ink-300',
  Ordered: 'bg-accent-500',
  'Partially Received': 'bg-amber-500',
  Received: 'bg-emerald-500',
  Cancelled: 'bg-red-400',
}

function ProgressBreakdown({ rows }: { rows: { label: string; count: number; percent: number; tone: string }[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-700">{row.label}</span>
            <span className="text-ink-500">
              {row.count} · {row.percent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-ink-100">
            <div className={`h-2 rounded-full ${row.tone}`} style={{ width: `${Math.max(row.percent, 2)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Reports: stock levels, movement activity, inventory value by warehouse, stock-health breakdown and PO activity. */
export function Reports() {
  const { products, warehouses, movements, purchaseOrders } = useInventoryData()

  const stockByCategory = useMemo(() => {
    const totals = new Map<string, number>()
    for (const product of products) {
      totals.set(product.category, (totals.get(product.category) ?? 0) + product.stock)
    }
    return Array.from(totals.entries()).map(([label, value]) => ({ label, value }))
  }, [products])

  const movementActivity = useMemo(() => {
    const counts = new Map<string, number>()
    for (const movement of movements) {
      counts.set(movement.type, (counts.get(movement.type) ?? 0) + 1)
    }
    return ['Stock In', 'Stock Out', 'Transfer', 'Adjustment'].map((label) => ({ label, value: counts.get(label) ?? 0 }))
  }, [movements])

  const valueByWarehouse = useMemo(() => {
    return warehouses.map((warehouse) => ({
      label: warehouse.name,
      value: products.filter((product) => product.warehouseId === warehouse.id).reduce((sum, product) => sum + product.stock * product.price, 0),
    }))
  }, [products, warehouses])

  const stockHealthBreakdown = useMemo(() => {
    const total = products.length || 1
    return stockStatusOrder.map((status) => {
      const count = products.filter((product) => getStockStatus(product) === status).length
      return { label: status, count, percent: Math.round((count / total) * 100), tone: stockStatusTone[status] }
    })
  }, [products])

  const poActivityBreakdown = useMemo(() => {
    const total = purchaseOrders.length || 1
    return poStatusOrder.map((status) => {
      const count = purchaseOrders.filter((order) => order.status === status).length
      return { label: status, count, percent: Math.round((count / total) * 100), tone: poStatusTone[status] }
    })
  }, [purchaseOrders])

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Stock levels by category" subtitle="Units on hand, current catalogue">
          <BarChart data={stockByCategory} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Movement activity" subtitle="Recorded movements by type">
          <BarChart data={movementActivity} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Inventory value by warehouse" subtitle="Stock on hand × unit price">
          <BarChart data={valueByWarehouse} formatValue={formatCurrency} />
        </ChartCard>
        <ChartCard title="Stock health" subtitle="Share of the catalogue at each stock tier">
          <ProgressBreakdown rows={stockHealthBreakdown} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Purchase order activity" subtitle="Share of orders at each status">
          <ProgressBreakdown rows={poActivityBreakdown} />
        </ChartCard>
      </div>
    </div>
  )
}
