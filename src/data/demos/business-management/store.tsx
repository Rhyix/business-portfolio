import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { BusinessManagementContext } from './context'
import type { BusinessManagementContextValue, CustomerInput, ProductInput } from './context'
import { readDemoValue, useDemoPersistence } from '../../../lib/demoPersistence'
import { initialCustomers } from './customers'
import { initialProducts } from './products'
import type { Customer, Product } from './types'

/** Namespace for this demo's persisted entities (see src/lib/demoPersistence.ts). */
const SYSTEM = 'business-management' as const

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Standalone state for the Business Management System demo.
 *
 * The Customers and Products pages previously held this in their own
 * `useState`, which meant a record created on one page vanished the moment the
 * router swapped in another — the page component unmounted and re-seeded. The
 * logic below is the same logic those pages ran inline, moved up to a provider
 * that outlives the route change and persists between visits.
 *
 * Mirrors the integrated platform store's action names on purpose, so a page
 * calls the same method whichever store it is talking to. It is a strict
 * subset: only the entities this demo makes editable on its own.
 *
 * Never mounted inside the integrated platform. That provider owns those pages
 * there, and the two are kept apart by where each is mounted rather than by
 * precedence logic inside the pages.
 */
export function BusinessManagementDataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() =>
    readDemoValue(SYSTEM, 'customers', initialCustomers),
  )
  const [products, setProducts] = useState<Product[]>(() =>
    readDemoValue(SYSTEM, 'products', initialProducts),
  )

  useDemoPersistence(SYSTEM, 'customers', customers)
  useDemoPersistence(SYSTEM, 'products', products)

  // Seeded past the highest id in the sample data, matching the counters the
  // pages used before. Starting from the persisted list instead would risk
  // reusing an id after a delete.
  const nextCustomerId = useRef(1015)
  const nextProductId = useRef(2015)

  const addCustomer = useCallback((values: CustomerInput) => {
    const newCustomer: Customer = {
      id: `CUS-${nextCustomerId.current}`,
      ...values,
      orders: 0,
      joined: today(),
    }
    nextCustomerId.current += 1
    setCustomers((current) => [newCustomer, ...current])
  }, [])

  const updateCustomer = useCallback((id: string, values: CustomerInput) => {
    setCustomers((current) =>
      current.map((customer) => (customer.id === id ? { ...customer, ...values } : customer)),
    )
  }, [])

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((current) => current.filter((customer) => customer.id !== id))
  }, [])

  const addProduct = useCallback((values: ProductInput) => {
    const newProduct: Product = { id: `PRD-${nextProductId.current}`, ...values }
    nextProductId.current += 1
    setProducts((current) => [newProduct, ...current])
  }, [])

  const updateProduct = useCallback((id: string, values: ProductInput) => {
    setProducts((current) =>
      current.map((product) => (product.id === id ? { ...product, ...values } : product)),
    )
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id))
  }, [])

  const value = useMemo<BusinessManagementContextValue>(
    () => ({
      customers,
      products,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [customers, products, addCustomer, updateCustomer, deleteCustomer, addProduct, updateProduct, deleteProduct],
  )

  return (
    <BusinessManagementContext.Provider value={value}>{children}</BusinessManagementContext.Provider>
  )
}
