import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { useRouter } from '../../../lib/useRouter'
import { DemoShell } from '../../../components/demo/DemoShell'
import type { GlobalSearchResult } from '../../../components/demo/types'
import { AdminDashboardDataProvider } from '../../../data/demos/admin-dashboard/store'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import type { AdminDashboardDataContextValue } from '../../../data/demos/admin-dashboard/context'
import { appName, basePath, demoNavGroups, demoNavItems, demoNotifications } from '../../../data/demos/admin-dashboard/navigation'
import { Dashboard } from './Dashboard'
import { Overview } from './Overview'
import { Kpis } from './Kpis'
import { Departments } from './Departments'
import { Approvals } from './Approvals'
import { DataExplorer } from './DataExplorer'
import { Reports } from './Reports'
import { Activity } from './Activity'
import { Settings } from './Settings'

interface AdminRoute {
  key: string
  title: string
  Component: ComponentType
}

const routes: Record<string, AdminRoute> = {
  '': { key: 'dashboard', title: 'Dashboard', Component: Dashboard },
  '/overview': { key: 'overview', title: 'Overview', Component: Overview },
  '/kpis': { key: 'kpis', title: 'KPIs', Component: Kpis },
  '/departments': { key: 'departments', title: 'Departments', Component: Departments },
  '/approvals': { key: 'approvals', title: 'Approvals', Component: Approvals },
  '/data': { key: 'data', title: 'Data Explorer', Component: DataExplorer },
  '/reports': { key: 'reports', title: 'Reports', Component: Reports },
  '/activity': { key: 'activity', title: 'Activity', Component: Activity },
  '/settings': { key: 'settings', title: 'Settings', Component: Settings },
}

function buildSearchResults(shared: AdminDashboardDataContextValue, query: string): GlobalSearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: GlobalSearchResult[] = []

  for (const kpi of shared.kpis) {
    if (kpi.metric.toLowerCase().includes(needle)) {
      results.push({ id: `kpi-${kpi.id}`, kind: 'KPI', label: kpi.metric, sublabel: kpi.category, to: '/kpis' })
    }
  }
  for (const department of shared.departments) {
    if (department.name.toLowerCase().includes(needle)) {
      results.push({ id: `dept-${department.id}`, kind: 'Department', label: department.name, sublabel: `${department.headcount} staff`, to: '/departments' })
    }
  }
  for (const approval of shared.approvals) {
    if (approval.requester.toLowerCase().includes(needle) || approval.id.toLowerCase().includes(needle)) {
      results.push({ id: `approval-${approval.id}`, kind: 'Approval', label: `${approval.type} — ${approval.requester}`, sublabel: approval.id, to: '/approvals' })
    }
  }
  for (const record of shared.records) {
    if (record.name.toLowerCase().includes(needle)) {
      results.push({ id: `record-${record.id}`, kind: 'Data Record', label: record.name, sublabel: record.category, to: '/data' })
    }
  }
  for (const item of shared.activity) {
    if (item.message.toLowerCase().includes(needle)) {
      results.push({ id: `activity-${item.id}`, kind: 'Activity', label: item.message, to: '/activity' })
    }
  }

  return results.slice(0, 8)
}

function AdministrativeDashboardShell() {
  const { path } = useRouter()
  const shared = useAdminDashboardData()
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
        placeholder: 'Search KPIs, departments, approvals, records…',
      }}
    >
      <Component />
    </DemoShell>
  )
}

/**
 * Custom Administrative Dashboard: a standalone, dedicated dashboard product
 * with its own in-memory store (see data/demos/admin-dashboard/store.tsx).
 * Not wired into the Integrated Platform or any other demo this stage.
 */
export function AdministrativeDashboard() {
  return (
    <AdminDashboardDataProvider>
      <AdministrativeDashboardShell />
    </AdminDashboardDataProvider>
  )
}
