import type { ComponentType } from 'react'
import { useRouter } from '../../../lib/useRouter'
import { DemoShell } from '../../../components/demo/DemoShell'
import {
  appName,
  basePath,
  demoNavItems,
  demoNotifications,
} from '../../../data/demos/human-resources/navigation'
import { Dashboard } from './Dashboard'
import { Employees } from './Employees'
import { Attendance } from './Attendance'
import { Leave } from './Leave'
import { Recruitment } from './Recruitment'
import { Documents } from './Documents'
import { Reports } from './Reports'
import { Settings } from './Settings'

interface DemoRoute {
  key: string
  title: string
  Component: ComponentType
}

const routes: Record<string, DemoRoute> = {
  '': { key: 'dashboard', title: 'Dashboard', Component: Dashboard },
  '/employees': { key: 'employees', title: 'Employees', Component: Employees },
  '/attendance': { key: 'attendance', title: 'Attendance', Component: Attendance },
  '/leave': { key: 'leave', title: 'Leave Requests', Component: Leave },
  '/recruitment': { key: 'recruitment', title: 'Recruitment', Component: Recruitment },
  '/documents': { key: 'documents', title: 'Documents', Component: Documents },
  '/reports': { key: 'reports', title: 'Reports', Component: Reports },
  '/settings': { key: 'settings', title: 'Settings', Component: Settings },
}

/**
 * Second demo system: a fictional Human Resource Management System shown as
 * a sample solution inside the AETEX portfolio. Reuses the same DemoShell,
 * router and design tokens as the Business Management System demo. All data
 * is in-memory — there is no backend, database or real authentication.
 */
export function HumanResourceManagement() {
  const { path } = useRouter()
  const subPath = path.slice(basePath.length)
  const route = routes[subPath] ?? routes['']
  const { Component } = route

  return (
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
  )
}
