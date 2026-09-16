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

/**
 * Optional grouping of sidebar nav items by section label. When a demo
 * supplies `groups`, DemoSidebar renders labelled sections instead of one
 * flat list — used by the integrated platform, which combines more modules
 * than a single-purpose demo like BMS or HRMS.
 */
export interface DemoNavGroup {
  label: string
  /** Subset of `DemoNavItem.key` values from the demo's flat nav list, in display order. */
  keys: string[]
}

/** One global-search result row, shown in the topbar search dropdown. */
export interface GlobalSearchResult {
  id: string
  /** Short entity-type label shown next to the result, e.g. "Customer". */
  kind: string
  label: string
  sublabel?: string
  /** Path suffix appended to the demo's base route. */
  to: string
}
