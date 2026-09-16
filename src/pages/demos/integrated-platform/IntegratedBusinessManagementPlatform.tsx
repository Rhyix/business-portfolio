import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { useRouter } from '../../../lib/useRouter'
import { DemoShell } from '../../../components/demo/DemoShell'
import type { GlobalSearchResult } from '../../../components/demo/types'
import { IntegratedDataProvider } from '../../../data/demos/integrated/store'
import { useIntegratedData } from '../../../data/demos/integrated/context'
import type { IntegratedDataContextValue } from '../../../data/demos/integrated/context'
import {
  appName,
  basePath,
  demoNavGroups,
  demoNavItems,
  demoNotifications,
} from '../../../data/demos/integrated/navigation'
import { Dashboard } from './Dashboard'
import { Reports } from './Reports'
import { Settings } from './Settings'
import { Customers } from '../business-management-system/Customers'
import { Products } from '../business-management-system/Products'
import { Orders } from '../business-management-system/Orders'
import { Inventory } from '../business-management-system/Inventory'
import { Invoices } from '../business-management-system/Invoices'
import { Employees } from '../human-resource-management/Employees'
import { Attendance } from '../human-resource-management/Attendance'
import { Leave } from '../human-resource-management/Leave'
import { Recruitment } from '../human-resource-management/Recruitment'
import { Documents } from '../human-resource-management/Documents'

interface PlatformRoute {
  key: string
  title: string
  Component: ComponentType
}

const routes: Record<string, PlatformRoute> = {
  '': { key: 'dashboard', title: 'Dashboard', Component: Dashboard },
  '/customers': { key: 'customers', title: 'Customers', Component: Customers },
  '/products': { key: 'products', title: 'Products', Component: Products },
  '/orders': { key: 'orders', title: 'Orders', Component: Orders },
  '/inventory': { key: 'inventory', title: 'Inventory', Component: Inventory },
  '/invoices': { key: 'invoices', title: 'Invoices', Component: Invoices },
  '/employees': { key: 'employees', title: 'Employees', Component: Employees },
  '/attendance': { key: 'attendance', title: 'Attendance', Component: Attendance },
  '/leave': { key: 'leave', title: 'Leave Requests', Component: Leave },
  '/recruitment': { key: 'recruitment', title: 'Recruitment', Component: Recruitment },
  '/documents': { key: 'documents', title: 'Documents', Component: Documents },
  '/reports': { key: 'reports', title: 'Reports', Component: Reports },
  '/settings': { key: 'settings', title: 'Settings', Component: Settings },
}

function buildSearchResults(shared: IntegratedDataContextValue, query: string): GlobalSearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: GlobalSearchResult[] = []

  for (const customer of shared.customers) {
    if (customer.name.toLowerCase().includes(needle) || customer.company.toLowerCase().includes(needle)) {
      results.push({
        id: `customer-${customer.id}`,
        kind: 'Customer',
        label: customer.name,
        sublabel: customer.company,
        to: '/customers',
      })
    }
  }
  for (const product of shared.products) {
    if (product.name.toLowerCase().includes(needle) || product.sku.toLowerCase().includes(needle)) {
      results.push({
        id: `product-${product.id}`,
        kind: 'Product',
        label: product.name,
        sublabel: product.sku,
        to: '/products',
      })
    }
  }
  for (const order of shared.orders) {
    if (order.id.toLowerCase().includes(needle) || order.customerName.toLowerCase().includes(needle)) {
      results.push({
        id: `order-${order.id}`,
        kind: 'Order',
        label: order.id,
        sublabel: order.customerName,
        to: '/orders',
      })
    }
  }
  for (const invoice of shared.invoices) {
    if (invoice.id.toLowerCase().includes(needle) || invoice.customerName.toLowerCase().includes(needle)) {
      results.push({
        id: `invoice-${invoice.id}`,
        kind: 'Invoice',
        label: invoice.id,
        sublabel: invoice.customerName,
        to: '/invoices',
      })
    }
  }
  for (const employee of shared.employees) {
    if (employee.name.toLowerCase().includes(needle) || employee.position.toLowerCase().includes(needle)) {
      results.push({
        id: `employee-${employee.id}`,
        kind: 'Employee',
        label: employee.name,
        sublabel: employee.position,
        to: '/employees',
      })
    }
  }
  for (const applicant of shared.applicants) {
    if (applicant.name.toLowerCase().includes(needle) || applicant.positionTitle.toLowerCase().includes(needle)) {
      results.push({
        id: `applicant-${applicant.id}`,
        kind: 'Applicant',
        label: applicant.name,
        sublabel: applicant.positionTitle,
        to: '/recruitment',
      })
    }
  }

  return results.slice(0, 8)
}

function IntegratedPlatformShell() {
  const { path } = useRouter()
  const shared = useIntegratedData()
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
      globalSearch={{ query: searchQuery, onQueryChange: setSearchQuery, results: searchResults }}
    >
      <Component />
    </DemoShell>
  )
}

/**
 * Flagship demo: the AETEX Integrated Business Management Platform, unifying
 * the Business Management System and Human Resource Management System under
 * one shell and one shared in-memory store. Reuses the same page components
 * as the two standalone demos — see useOptionalIntegratedData() in
 * src/data/demos/integrated/store.tsx for how each page adapts.
 */
export function IntegratedBusinessManagementPlatform() {
  return (
    <IntegratedDataProvider>
      <IntegratedPlatformShell />
    </IntegratedDataProvider>
  )
}
