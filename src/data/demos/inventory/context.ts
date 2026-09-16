import { createContext, useContext } from 'react'
import type {
  InventoryActivityItem,
  Product,
  ProductInput,
  PurchaseOrder,
  PurchaseOrderInput,
  StockMovement,
  Supplier,
  SupplierInput,
  Warehouse,
  WarehouseInput,
} from './types'

export interface InventoryDataContextValue {
  products: Product[]
  warehouses: Warehouse[]
  suppliers: Supplier[]
  purchaseOrders: PurchaseOrder[]
  movements: StockMovement[]
  activity: InventoryActivityItem[]

  addProduct: (values: ProductInput) => void
  updateProduct: (id: string, values: ProductInput) => void
  discontinueProduct: (id: string) => void

  addWarehouse: (values: WarehouseInput) => void
  updateWarehouse: (id: string, values: WarehouseInput) => void
  deactivateWarehouse: (id: string) => void

  addSupplier: (values: SupplierInput) => void
  updateSupplier: (id: string, values: SupplierInput) => void
  deactivateSupplier: (id: string) => void

  /** Manual stock adjustment (e.g. cycle count correction), independent of any purchase order. */
  adjustStock: (productId: string, quantityDelta: number, reference: string) => void

  addPurchaseOrder: (values: PurchaseOrderInput) => void
  markPurchaseOrderOrdered: (id: string) => void
  cancelPurchaseOrder: (id: string) => void
  /** Applies a delivery against a purchase order: updates stock, logs a movement, and advances PO status. */
  receivePurchaseOrder: (id: string, lines: { productId: string; quantityReceived: number }[]) => void

  /** Set by a "Create Purchase Order" action from a low-stock context; read once and cleared by the Purchase Orders page. */
  pendingPurchaseOrderProductId: string | null
  setPendingPurchaseOrderProductId: (productId: string | null) => void
}

export const InventoryDataContext = createContext<InventoryDataContextValue | null>(null)

/** Reads the inventory demo's shared store. Must be used within InventoryDataProvider. */
export function useInventoryData(): InventoryDataContextValue {
  const context = useContext(InventoryDataContext)
  if (!context) throw new Error('useInventoryData must be used within an InventoryDataProvider')
  return context
}
