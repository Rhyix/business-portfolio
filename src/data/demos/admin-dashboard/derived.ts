import { readDemoValue } from '../../../lib/demoPersistence'
import type { DemoSystem } from '../../../lib/demoPersistence'
// Type-only imports are erased at build time, so naming another demo's shapes
// costs this chunk nothing and creates no runtime import edge.
import type { Product } from '../inventory/types'
import type { Order } from '../business-management/types'
import type { LeaveRequest } from '../human-resources/types'
import type { Appointment } from '../appointments/types'
import type { Applicant } from '../recruitment/types'

/**
 * Inventory's own low-stock rule, restated rather than imported: pulling the
 * helper in would add a real runtime import from this demo's chunk into
 * another's. The threshold is one comparison and is documented in
 * src/data/demos/inventory/types.ts (`computeStockTier`) — if that rule
 * changes, this is the one line to update with it.
 */
function isAtOrBelowReorderLevel(product: Product): boolean {
  if (product.discontinued) return false
  return product.reorderLevel > 0 && product.stock <= product.reorderLevel
}

/**
 * Read-only view of what the other demo systems have persisted.
 *
 * The Administrative Dashboard's job is to reflect the rest of the business, so
 * these indicators are read from the other demos' own localStorage namespaces
 * rather than from a second copy of their seed data. Deliberately one-way and
 * import-free: nothing here imports another demo's store, provider or context,
 * so there is no cross-demo coupling and no circular dependency — only the
 * shared persistence helper and type-only imports, which are erased at build
 * time and add nothing to this demo's chunk.
 *
 * A system that has never been opened has nothing persisted. That is reported
 * as `available: false` rather than faked with a seed, which is both honest and
 * a fair demonstration of how separate systems feed a reporting layer.
 */

export interface DerivedIndicator {
  id: string
  label: string
  /** Null when the source system has not been opened in this browser yet. */
  value: number | null
  /** Short description of what the number counts. */
  detail: string
  /** Which demo produces it, for the "open it to populate" affordance. */
  sourceSystem: string
  sourceHref: string
  available: boolean
}

function count<T>(rows: T[] | null, predicate: (row: T) => boolean): number | null {
  return rows === null ? null : rows.filter(predicate).length
}

/** Returns the persisted rows, or null when the system has never been opened. */
function rowsOrNull<T>(system: DemoSystem, entity: string): T[] | null {
  const sentinel: T[] | null = null
  return readDemoValue<T[] | null>(system, entity, sentinel)
}

/**
 * Snapshot of the indicators the dashboard can derive right now. Called on
 * mount, so returning to the dashboard re-reads — no interval, no observer and
 * no subscription, because demo pages already remount on navigation.
 */
export function readDerivedIndicators(): DerivedIndicator[] {
  const orders = rowsOrNull<Order>('integrated', 'orders')
  const leave = rowsOrNull<LeaveRequest>('integrated', 'leaveRequests')
  const products = rowsOrNull<Product>('inventory', 'products')
  const appointments = rowsOrNull<Appointment>('appointments', 'appointments')
  const applicants = rowsOrNull<Applicant>('recruitment', 'applicants')

  return [
    {
      id: 'open-orders',
      label: 'Open orders',
      value: count(orders, (order) => order.status === 'Pending' || order.status === 'Processing'),
      detail: 'Orders still pending or processing',
      sourceSystem: 'Integrated Business Management Platform',
      sourceHref: '/solutions/integrated-business-management-platform/orders',
      available: orders !== null,
    },
    {
      id: 'pending-leave',
      label: 'Leave awaiting approval',
      value: count(leave, (request) => request.status === 'Pending'),
      detail: 'Requests not yet approved or rejected',
      sourceSystem: 'Integrated Business Management Platform',
      sourceHref: '/solutions/integrated-business-management-platform/leave',
      available: leave !== null,
    },
    {
      id: 'low-stock',
      label: 'Items at or below reorder level',
      value: count(products, isAtOrBelowReorderLevel),
      detail: 'Products needing a purchase order',
      sourceSystem: 'Inventory Management System',
      sourceHref: '/solutions/inventory-management/stock',
      available: products !== null,
    },
    {
      id: 'upcoming-appointments',
      label: 'Upcoming appointments',
      value: count(
        appointments,
        (appointment) => appointment.status === 'Pending' || appointment.status === 'Confirmed',
      ),
      detail: 'Booked but not yet completed',
      sourceSystem: 'Appointment & Scheduling System',
      sourceHref: '/solutions/appointment-scheduling/appointments',
      available: appointments !== null,
    },
    {
      id: 'active-pipeline',
      label: 'Candidates in pipeline',
      value: count(
        applicants,
        (applicant) => applicant.stage !== 'Hired' && applicant.stage !== 'Rejected',
      ),
      detail: 'Neither hired nor rejected yet',
      sourceSystem: 'Recruitment Management System',
      sourceHref: '/solutions/recruitment-management/pipeline',
      available: applicants !== null,
    },
  ]
}
