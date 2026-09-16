/**
 * Entity shapes for the Inventory Management System demo.
 * Every record produced from these types is fictional sample data — see the
 * DemoNotice component shown throughout the demo shell.
 */

export type ProductCategory =
  | 'Electronics'
  | 'Furniture'
  | 'Office Supplies'
  | 'Packaging'
  | 'Raw Materials'
  | 'Safety Equipment'

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  warehouseId: string
  price: number
  stock: number
  /**
   * Units already allocated to pending sales but not yet shipped. Seeded as a
   * static fictional number — this demo has no order/reservation workflow of
   * its own, so nothing currently writes to this field after seeding.
   */
  reserved: number
  reorderLevel: number
  /** Pure lifecycle flag — stock-health is always computed, never stored (see computeStockTier). */
  discontinued: boolean
}

/** Fields supplied by the product add/edit form. */
export type ProductInput = Pick<
  Product,
  'name' | 'sku' | 'category' | 'warehouseId' | 'price' | 'stock' | 'reorderLevel' | 'discontinued'
>

/**
 * Stock-health tier derived from stock vs. reorder level — never stored on
 * Product, always computed, so it can never drift out of sync with a stock
 * change. Two label maps below convert the same tier into each page's own
 * vocabulary instead of duplicating the threshold logic per page.
 */
export type StockTier = 'out' | 'critical' | 'low' | 'healthy'

export function computeStockTier(stock: number, reorderLevel: number): StockTier {
  if (stock <= 0) return 'out'
  if (reorderLevel > 0 && stock <= reorderLevel * 0.5) return 'critical'
  if (reorderLevel > 0 && stock <= reorderLevel) return 'low'
  return 'healthy'
}

export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Discontinued'

const tierToProductStatus: Record<StockTier, ProductStatus> = {
  out: 'Out of Stock',
  critical: 'Low Stock',
  low: 'Low Stock',
  healthy: 'In Stock',
}

/** Products.tsx's simpler 3-state view (plus Discontinued, which overrides stock health entirely). */
export function getProductStatus(product: Pick<Product, 'stock' | 'reorderLevel' | 'discontinued'>): ProductStatus {
  if (product.discontinued) return 'Discontinued'
  return tierToProductStatus[computeStockTier(product.stock, product.reorderLevel)]
}

export type StockStatus = 'Healthy' | 'Low' | 'Critical' | 'Out of Stock'

const tierToStockStatus: Record<StockTier, StockStatus> = {
  out: 'Out of Stock',
  critical: 'Critical',
  low: 'Low',
  healthy: 'Healthy',
}

/** Stock.tsx's full 4-tier view. */
export function getStockStatus(product: Pick<Product, 'stock' | 'reorderLevel'>): StockStatus {
  return tierToStockStatus[computeStockTier(product.stock, product.reorderLevel)]
}

export type WarehouseStatus = 'Active' | 'Inactive'

export interface Warehouse {
  id: string
  name: string
  location: string
  manager: string
  /** Storage capacity in units. */
  capacity: number
  status: WarehouseStatus
}

/** Fields supplied by the warehouse add/edit form. */
export type WarehouseInput = Pick<Warehouse, 'name' | 'location' | 'manager' | 'capacity' | 'status'>

export type SupplierStatus = 'Active' | 'Inactive'

export interface Supplier {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  category: string
  status: SupplierStatus
}

/** Fields supplied by the supplier add/edit form. */
export type SupplierInput = Pick<Supplier, 'name' | 'contactName' | 'email' | 'phone' | 'category' | 'status'>

export type StockMovementType = 'Stock In' | 'Stock Out' | 'Transfer' | 'Adjustment'

export interface StockMovement {
  id: string
  productId: string
  productName: string
  warehouseId: string
  warehouseName: string
  type: StockMovementType
  quantity: number
  /** e.g. a purchase order id, or a short free-text note for manual adjustments. */
  reference: string
  date: string
  user: string
}

export type PurchaseOrderStatus = 'Draft' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled'

export interface PurchaseOrderItem {
  productId: string
  productName: string
  quantity: number
  unitCost: number
  receivedQuantity: number
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  warehouseId: string
  warehouseName: string
  items: PurchaseOrderItem[]
  orderDate: string
  expectedDate: string
  status: PurchaseOrderStatus
}

/** Fields supplied by the create-purchase-order form. */
export interface PurchaseOrderInput {
  supplierId: string
  warehouseId: string
  expectedDate: string
  status: 'Draft' | 'Ordered'
  items: { productId: string; quantity: number; unitCost: number }[]
}

export function purchaseOrderTotal(order: Pick<PurchaseOrder, 'items'>): number {
  return order.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
}

export type InventoryActivityType =
  | 'product.added'
  | 'product.discontinued'
  | 'stock.received'
  | 'stock.adjusted'
  | 'warehouse.updated'
  | 'supplier.updated'
  | 'po.created'
  | 'po.cancelled'
  | 'product.low_stock'

export interface InventoryActivityItem {
  id: string
  type: InventoryActivityType
  message: string
  timestamp: string
}
