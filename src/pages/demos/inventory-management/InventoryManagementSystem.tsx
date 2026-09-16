import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { useRouter } from '../../../lib/useRouter'
import { DemoShell } from '../../../components/demo/DemoShell'
import type { GlobalSearchResult } from '../../../components/demo/types'
import { InventoryDataProvider } from '../../../data/demos/inventory/store'
import { useInventoryData } from '../../../data/demos/inventory/context'
import type { InventoryDataContextValue } from '../../../data/demos/inventory/context'
import { appName, basePath, demoNavGroups, demoNavItems, demoNotifications } from '../../../data/demos/inventory/navigation'
import { Dashboard } from './Dashboard'
import { Products } from './Products'
import { Stock } from './Stock'
import { Movements } from './Movements'
import { Warehouses } from './Warehouses'
import { Suppliers } from './Suppliers'
import { PurchaseOrders } from './PurchaseOrders'
import { Reports } from './Reports'
import { Settings } from './Settings'

interface InventoryRoute {
  key: string
  title: string
  Component: ComponentType
}

const routes: Record<string, InventoryRoute> = {
  '': { key: 'dashboard', title: 'Dashboard', Component: Dashboard },
  '/products': { key: 'products', title: 'Products', Component: Products },
  '/stock': { key: 'stock', title: 'Stock', Component: Stock },
  '/movements': { key: 'movements', title: 'Stock Movements', Component: Movements },
  '/warehouses': { key: 'warehouses', title: 'Warehouses', Component: Warehouses },
  '/suppliers': { key: 'suppliers', title: 'Suppliers', Component: Suppliers },
  '/purchase-orders': { key: 'purchase-orders', title: 'Purchase Orders', Component: PurchaseOrders },
  '/reports': { key: 'reports', title: 'Reports', Component: Reports },
  '/settings': { key: 'settings', title: 'Settings', Component: Settings },
}

function buildSearchResults(shared: InventoryDataContextValue, query: string): GlobalSearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: GlobalSearchResult[] = []

  for (const product of shared.products) {
    if (product.name.toLowerCase().includes(needle) || product.sku.toLowerCase().includes(needle)) {
      results.push({ id: `product-${product.id}`, kind: 'Product', label: product.name, sublabel: product.sku, to: '/products' })
    }
  }
  for (const warehouse of shared.warehouses) {
    if (warehouse.name.toLowerCase().includes(needle)) {
      results.push({ id: `warehouse-${warehouse.id}`, kind: 'Warehouse', label: warehouse.name, sublabel: warehouse.location, to: '/warehouses' })
    }
  }
  for (const supplier of shared.suppliers) {
    if (supplier.name.toLowerCase().includes(needle)) {
      results.push({ id: `supplier-${supplier.id}`, kind: 'Supplier', label: supplier.name, sublabel: supplier.category, to: '/suppliers' })
    }
  }
  for (const order of shared.purchaseOrders) {
    if (order.id.toLowerCase().includes(needle) || order.supplierName.toLowerCase().includes(needle)) {
      results.push({ id: `po-${order.id}`, kind: 'Purchase Order', label: order.id, sublabel: order.supplierName, to: '/purchase-orders' })
    }
  }

  return results.slice(0, 8)
}

function InventoryShell() {
  const { path } = useRouter()
  const shared = useInventoryData()
  const [searchQuery, setSearchQuery] = useState('')

  const subPath = path.slice(basePath.length)
  const route = routes[subPath] ?? routes['']
  const { Component } = route

  const searchResults = useMemo(() => buildSearchResults(shared, searchQuery), [shared, searchQuery])

  return (
    <DemoShell
      appName={appName}
      basePath={basePath}
      navItems={demoNavItems}
      groups={demoNavGroups}
      notifications={demoNotifications}
      activeKey={route.key}
      pageTitle={route.title}
      globalSearch={{
        query: searchQuery,
        onQueryChange: setSearchQuery,
        results: searchResults,
        placeholder: 'Search products, warehouses, suppliers…',
      }}
    >
      <Component />
    </DemoShell>
  )
}

/**
 * Inventory Management System: a standalone, dedicated inventory product
 * with its own in-memory store (see data/demos/inventory/store.tsx). Not
 * wired into the Integrated Platform or the Business Management System this
 * stage — see the Stage 13 plan for the clean-boundary rationale.
 */
export function InventoryManagementSystem() {
  return (
    <InventoryDataProvider>
      <InventoryShell />
    </InventoryDataProvider>
  )
}
