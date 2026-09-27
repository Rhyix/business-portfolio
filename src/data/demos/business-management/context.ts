import { createContext, useContext } from 'react'
import type { Customer, Product } from './types'

/**
 * Form payloads, defined here rather than imported from the integrated demo's
 * types. That module already re-exports these entities *from* this one, so
 * importing back would invert the dependency; the shapes are one `Pick` each
 * and are deliberately identical to the integrated store's equivalents so the
 * same page component can call either store with the same values.
 */
export type CustomerInput = Pick<Customer, 'name' | 'email' | 'phone' | 'company' | 'status'>
export type ProductInput = Pick<
  Product,
  'name' | 'sku' | 'category' | 'price' | 'stock' | 'reorderLevel' | 'status'
>

/**
 * Standalone Business Management System state.
 *
 * Deliberately a subset of the integrated platform's contract: only the
 * entities this demo lets a visitor change on its own. Orders, Invoices and
 * Inventory stay read-only outside the integrated platform — their action
 * controls only render when the shared store is present — so putting them here
 * would add workflows the demo intentionally reserves for the platform.
 */
export interface BusinessManagementContextValue {
  customers: Customer[]
  products: Product[]
  addCustomer: (values: CustomerInput) => void
  updateCustomer: (id: string, values: CustomerInput) => void
  deleteCustomer: (id: string) => void
  addProduct: (values: ProductInput) => void
  updateProduct: (id: string, values: ProductInput) => void
  deleteProduct: (id: string) => void
}

export const BusinessManagementContext = createContext<BusinessManagementContextValue | null>(null)

/**
 * The standalone store, or `null` when the caller is rendering inside the
 * integrated platform instead.
 *
 * Pages read this only in the branch where `useOptionalIntegratedData()`
 * returned null, so the two providers never both supply the same page. That
 * separation is structural — the platform never mounts this provider — rather
 * than something the pages have to arbitrate.
 */
export function useOptionalBusinessManagementData(): BusinessManagementContextValue | null {
  return useContext(BusinessManagementContext)
}
