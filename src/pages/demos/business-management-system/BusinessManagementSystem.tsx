import type { ComponentType } from 'react'
import { useRouter } from '../../../lib/useRouter'
import { DemoShell } from '../../../components/demo/DemoShell'
import { BusinessManagementDataProvider } from '../../../data/demos/business-management/store'
import {
  appName,
  basePath,
  demoNavItems,
  demoNotifications,
} from '../../../data/demos/business-management/navigation'
import { Dashboard } from './Dashboard'
import { Customers } from './Customers'
import { Products } from './Products'
import { Orders } from './Orders'
import { Inventory } from './Inventory'
import { Invoices } from './Invoices'
import { Reports } from './Reports'
import { Settings } from './Settings'

interface DemoRoute {
  key: string
  title: string
  Component: ComponentType
}

const routes: Record<string, DemoRoute> = {
  '': { key: 'dashboard', title: 'Dashboard', Component: Dashboard },
  '/customers': { key: 'customers', title: 'Customers', Component: Customers },
  '/products': { key: 'products', title: 'Products', Component: Products },
  '/orders': { key: 'orders', title: 'Orders', Component: Orders },
  '/inventory': { key: 'inventory', title: 'Inventory', Component: Inventory },
  '/invoices': { key: 'invoices', title: 'Invoices', Component: Invoices },
  '/reports': { key: 'reports', title: 'Reports', Component: Reports },
  '/settings': { key: 'settings', title: 'Settings', Component: Settings },
}

/**
 * Flagship demo: a fictional Business Management System shown as a sample
 * solution inside the AETEX portfolio. All data is in-memory demo data —
 * there is no backend, database or real authentication behind this route.
 */
export function BusinessManagementSystem() {
  const { path } = useRouter()
  const subPath = path.slice(basePath.length)
  const route = routes[subPath] ?? routes['']
  const { Component } = route

  return (
    // Above the routed <Component />, so state outlives a module change. The
    // integrated platform never mounts this: it owns these same pages through
    // IntegratedDataProvider instead.
    <BusinessManagementDataProvider>
      <DemoShell
        appName={appName}
        basePath={basePath}
        navItems={demoNavItems}
        notifications={demoNotifications}
        activeKey={route.key}
        pageTitle={route.title}
      >
        <Component />
      </DemoShell>
    </BusinessManagementDataProvider>
  )
}
