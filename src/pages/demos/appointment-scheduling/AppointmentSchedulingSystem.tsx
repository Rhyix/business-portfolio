import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { useRouter } from '../../../lib/useRouter'
import { DemoShell } from '../../../components/demo/DemoShell'
import type { GlobalSearchResult } from '../../../components/demo/types'
import { AppointmentsDataProvider } from '../../../data/demos/appointments/store'
import { useAppointmentsData } from '../../../data/demos/appointments/context'
import type { AppointmentsDataContextValue } from '../../../data/demos/appointments/context'
import { appName, basePath, demoNavGroups, demoNavItems, demoNotifications } from '../../../data/demos/appointments/navigation'
import { Dashboard } from './Dashboard'
import { Calendar } from './Calendar'
import { Appointments } from './Appointments'
import { Customers } from './Customers'
import { Services } from './Services'
import { Staff } from './Staff'
import { Availability } from './Availability'
import { Reminders } from './Reminders'
import { Reports } from './Reports'
import { Settings } from './Settings'
import { BookAppointmentFlow } from './BookAppointmentFlow'

interface AppointmentRoute {
  key: string
  title: string
  Component: ComponentType
}

const routes: Record<string, AppointmentRoute> = {
  '': { key: 'dashboard', title: 'Dashboard', Component: Dashboard },
  '/calendar': { key: 'calendar', title: 'Calendar', Component: Calendar },
  '/appointments': { key: 'appointments', title: 'Appointments', Component: Appointments },
  '/customers': { key: 'customers', title: 'Customers', Component: Customers },
  '/services': { key: 'services', title: 'Services', Component: Services },
  '/staff': { key: 'staff', title: 'Staff', Component: Staff },
  '/availability': { key: 'availability', title: 'Availability', Component: Availability },
  '/reminders': { key: 'reminders', title: 'Reminders', Component: Reminders },
  '/reports': { key: 'reports', title: 'Reports', Component: Reports },
  '/settings': { key: 'settings', title: 'Settings', Component: Settings },
}

function buildSearchResults(shared: AppointmentsDataContextValue, query: string): GlobalSearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: GlobalSearchResult[] = []

  for (const appointment of shared.appointments) {
    if (
      appointment.customerName.toLowerCase().includes(needle) ||
      appointment.id.toLowerCase().includes(needle) ||
      appointment.serviceName.toLowerCase().includes(needle)
    ) {
      results.push({ id: `apt-${appointment.id}`, kind: 'Appointment', label: `${appointment.customerName} — ${appointment.serviceName}`, sublabel: appointment.id, to: '/appointments' })
    }
  }
  for (const customer of shared.customers) {
    if (customer.name.toLowerCase().includes(needle) || customer.email.toLowerCase().includes(needle)) {
      results.push({ id: `customer-${customer.id}`, kind: 'Customer', label: customer.name, sublabel: customer.email, to: '/customers' })
    }
  }
  for (const service of shared.services) {
    if (service.name.toLowerCase().includes(needle)) {
      results.push({ id: `service-${service.id}`, kind: 'Service', label: service.name, sublabel: service.category, to: '/services' })
    }
  }
  for (const staffMember of shared.staff) {
    if (staffMember.name.toLowerCase().includes(needle) || staffMember.role.toLowerCase().includes(needle)) {
      results.push({ id: `staff-${staffMember.id}`, kind: 'Staff', label: staffMember.name, sublabel: staffMember.role, to: '/staff' })
    }
  }

  return results.slice(0, 8)
}

function AppointmentSchedulingShell() {
  const { path } = useRouter()
  const shared = useAppointmentsData()
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
        placeholder: 'Search appointments, customers, services, staff…',
      }}
    >
      <Component />
      <BookAppointmentFlow />
    </DemoShell>
  )
}

/**
 * Appointment & Scheduling System: a standalone, dedicated scheduling
 * product with its own in-memory store (see data/demos/appointments/store.tsx).
 * Not wired into any other demo this stage — see the Stage 14 plan for the
 * clean-boundary rationale.
 */
export function AppointmentSchedulingSystem() {
  return (
    <AppointmentsDataProvider>
      <AppointmentSchedulingShell />
    </AppointmentsDataProvider>
  )
}
