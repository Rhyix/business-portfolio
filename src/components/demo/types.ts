import type { IconComponent } from '../../types/content'

/** Sidebar navigation entry, shared by every demo application shell. */
export interface DemoNavItem {
  key: string
  label: string
  icon: IconComponent
  /** Path suffix appended to the demo's base route; '' is the dashboard root. */
  to: string
}

/** Topbar notification entry, shared by every demo application shell. */
export interface DemoNotification {
  id: string
  title: string
  detail: string
}
