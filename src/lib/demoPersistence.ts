import { useEffect } from 'react'

/**
 * Browser-local persistence for the demo applications.
 *
 * The demos have no backend by design, so a visitor's changes previously lived
 * only in React state and disappeared on refresh — which undercut the point of
 * an interactive demo. This stores each entity list under its own namespaced
 * key so a session survives a reload, while staying small enough that it never
 * becomes a database layer.
 *
 * Every read and write is guarded: localStorage throws in private mode, can be
 * disabled outright, and may hold a value written by an older shape of the
 * data. In all of those cases the caller falls back to its seed rather than
 * failing, so a demo is never bricked by bad storage.
 */

/** Keys look like `aetex-demo:inventory:products` — one namespace per system. */
export type DemoSystem =
  | 'integrated'
  | 'recruitment'
  | 'inventory'
  | 'appointments'
  | 'admin-dashboard'
  | 'business-management'
  | 'human-resources'

export function demoKey(system: DemoSystem, entity: string): string {
  return `aetex-demo:${system}:${entity}`
}

/** Reads and parses a namespaced value, returning `fallback` on any failure. */
export function readDemoValue<T>(system: DemoSystem, entity: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(demoKey(system, entity))
    if (raw === null) return fallback
    const parsed = JSON.parse(raw) as T
    // A stored value of the wrong shape is worse than no stored value: an
    // array entity that comes back as an object would break every consumer.
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback
    return parsed
  } catch {
    return fallback
  }
}

/**
 * Writes `value` to its namespaced key whenever it changes. Deliberately
 * write-only and paired with a `useState` seeded by `readDemoValue`, rather
 * than wrapping both in one hook: keeping `useState` in the store means React's
 * lint rules still recognise the setter as stable, so the existing `useCallback`
 * dependency arrays stay correct and untouched.
 *
 * The effect is keyed on the value, so it runs once per committed change. Form
 * fields that hold their own local state as you type never reach storage until
 * the record is actually saved into the store.
 */
export function useDemoPersistence<T>(system: DemoSystem, entity: string, value: T): void {
  useEffect(() => {
    try {
      window.localStorage.setItem(demoKey(system, entity), JSON.stringify(value))
    } catch {
      // Storage full, disabled, or private mode. The demo keeps working from
      // memory for this session; there is nothing useful to tell the visitor.
    }
  }, [system, entity, value])
}

/**
 * Every entity each system persists, so a reset knows what to clear without
 * each Settings page restating it. Kept beside the writer rather than in the
 * demos, because a key that is written here but missing from this list would
 * silently survive a reset.
 */
export const DEMO_ENTITIES: Record<DemoSystem, readonly string[]> = {
  integrated: ['customers', 'products', 'orders', 'invoices', 'employees', 'leaveRequests', 'applicants', 'activity'],
  recruitment: ['vacancies', 'applicants', 'interviews', 'assessments', 'evaluations', 'activity'],
  inventory: ['products', 'warehouses', 'suppliers', 'purchaseOrders', 'movements', 'activity'],
  appointments: ['customers', 'services', 'staff', 'availability', 'appointments', 'reminders', 'activity'],
  'admin-dashboard': ['kpis', 'departments', 'approvals', 'activity', 'visibleWidgets', 'dateRange'],
  // Only what each standalone demo actually lets a visitor change. Orders,
  // invoices, attendance and documents stay read-only outside the integrated
  // platform, so they are seeded fresh rather than persisted.
  'business-management': ['customers', 'products'],
  'human-resources': ['employees', 'leaveRequests', 'applicants'],
}

/**
 * Clears one system's persisted entities, so a visitor who has edited or
 * deleted their way somewhere unhelpful can get the sample data back. The
 * caller reloads afterwards, which re-seeds every store from its own defaults.
 */
export function clearDemoSystem(system: DemoSystem): void {
  try {
    for (const entity of DEMO_ENTITIES[system]) {
      window.localStorage.removeItem(demoKey(system, entity))
    }
  } catch {
    // Nothing persisted means nothing to clear.
  }
}
