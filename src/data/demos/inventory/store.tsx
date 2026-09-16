import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { InventoryDataContext } from './context'
import { initialProducts } from './products'
import { initialWarehouses } from './warehouses'
import { initialSuppliers } from './suppliers'
import { initialPurchaseOrders } from './purchaseOrders'
import { initialMovements } from './movements'
import { initialActivity } from './activity'
import type {
  InventoryActivityItem,
  InventoryActivityType,
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

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Shared in-memory demo store for the Inventory Management System. A
 * lightweight custom store (useState + plain updater functions), scoped
 * entirely to this demo — it does not read or write the Integrated
 * Platform's or the Business Management System's state (see Stage 13 plan:
 * no cross-demo integration yet).
 */
export function InventoryDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses)
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements)
  const [activity, setActivity] = useState<InventoryActivityItem[]>(initialActivity)
  const [pendingPurchaseOrderProductId, setPendingPurchaseOrderProductId] = useState<string | null>(null)

  const nextProductId = useRef(3019)
  const nextWarehouseId = useRef(105)
  const nextSupplierId = useRef(207)
  const nextPurchaseOrderId = useRef(411)
  const nextMovementId = useRef(513)
  const nextActivityId = useRef(8)

  const logActivity = useCallback((type: InventoryActivityType, message: string) => {
    setActivity((current) =>
      [{ id: `iact-${nextActivityId.current++}`, type, message, timestamp: today() }, ...current].slice(0, 25),
    )
  }, [])

  const addProduct = useCallback(
    (values: ProductInput) => {
      const newProduct: Product = { id: `PRD-${nextProductId.current++}`, ...values, reserved: 0 }
      setProducts((current) => [newProduct, ...current])
      logActivity('product.added', `${newProduct.name} was added to the catalogue.`)
    },
    [logActivity],
  )

  const updateProduct = useCallback((id: string, values: ProductInput) => {
    setProducts((current) => current.map((product) => (product.id === id ? { ...product, ...values } : product)))
  }, [])

  const discontinueProduct = useCallback(
    (id: string) => {
      const product = products.find((item) => item.id === id)
      if (!product) return
      setProducts((current) => current.map((item) => (item.id === id ? { ...item, discontinued: true } : item)))
      logActivity('product.discontinued', `${product.name} was marked discontinued.`)
    },
    [products, logActivity],
  )

  const addWarehouse = useCallback(
    (values: WarehouseInput) => {
      const newWarehouse: Warehouse = { id: `WH-${nextWarehouseId.current++}`, ...values }
      setWarehouses((current) => [newWarehouse, ...current])
      logActivity('warehouse.updated', `${newWarehouse.name} was added as a new warehouse.`)
    },
    [logActivity],
  )

  const updateWarehouse = useCallback(
    (id: string, values: WarehouseInput) => {
      setWarehouses((current) => current.map((warehouse) => (warehouse.id === id ? { ...warehouse, ...values } : warehouse)))
      logActivity('warehouse.updated', `${values.name} was updated.`)
    },
    [logActivity],
  )

  const deactivateWarehouse = useCallback(
    (id: string) => {
      const warehouse = warehouses.find((item) => item.id === id)
      if (!warehouse) return
      setWarehouses((current) => current.map((item) => (item.id === id ? { ...item, status: 'Inactive' } : item)))
      logActivity('warehouse.updated', `${warehouse.name} was deactivated.`)
    },
    [warehouses, logActivity],
  )

  const addSupplier = useCallback(
    (values: SupplierInput) => {
      const newSupplier: Supplier = { id: `SUP-${nextSupplierId.current++}`, ...values }
      setSuppliers((current) => [newSupplier, ...current])
      logActivity('supplier.updated', `${newSupplier.name} was added as a new supplier.`)
    },
    [logActivity],
  )

  const updateSupplier = useCallback(
    (id: string, values: SupplierInput) => {
      setSuppliers((current) => current.map((supplier) => (supplier.id === id ? { ...supplier, ...values } : supplier)))
      logActivity('supplier.updated', `${values.name} was updated.`)
    },
    [logActivity],
  )

  const deactivateSupplier = useCallback(
    (id: string) => {
      const supplier = suppliers.find((item) => item.id === id)
      if (!supplier) return
      setSuppliers((current) => current.map((item) => (item.id === id ? { ...item, status: 'Inactive' } : item)))
      logActivity('supplier.updated', `${supplier.name} was deactivated.`)
    },
    [suppliers, logActivity],
  )

  const adjustStock = useCallback(
    (productId: string, quantityDelta: number, reference: string) => {
      const product = products.find((item) => item.id === productId)
      if (!product || quantityDelta === 0) return

      const newMovement: StockMovement = {
        id: `MOV-${nextMovementId.current++}`,
        productId: product.id,
        productName: product.name,
        warehouseId: product.warehouseId,
        warehouseName: warehouses.find((w) => w.id === product.warehouseId)?.name ?? '',
        type: 'Adjustment',
        quantity: quantityDelta,
        reference,
        date: today(),
        user: 'Admin User',
      }

      setProducts((current) =>
        current.map((item) => (item.id === productId ? { ...item, stock: Math.max(0, item.stock + quantityDelta) } : item)),
      )
      setMovements((current) => [newMovement, ...current])
      logActivity(
        'stock.adjusted',
        `${product.name} adjusted by ${quantityDelta > 0 ? '+' : ''}${quantityDelta} units (${reference}).`,
      )
    },
    [products, warehouses, logActivity],
  )

  const addPurchaseOrder = useCallback(
    (values: PurchaseOrderInput) => {
      const supplier = suppliers.find((item) => item.id === values.supplierId)
      const warehouse = warehouses.find((item) => item.id === values.warehouseId)
      if (!supplier || !warehouse) return

      const newOrder: PurchaseOrder = {
        id: `PO-${nextPurchaseOrderId.current++}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        items: values.items.map((item) => ({
          ...item,
          productName: products.find((product) => product.id === item.productId)?.name ?? '',
          receivedQuantity: 0,
        })),
        orderDate: today(),
        expectedDate: values.expectedDate,
        status: values.status,
      }

      setPurchaseOrders((current) => [newOrder, ...current])
      logActivity('po.created', `${newOrder.id} created for ${supplier.name}.`)
    },
    [suppliers, warehouses, products, logActivity],
  )

  const markPurchaseOrderOrdered = useCallback((id: string) => {
    setPurchaseOrders((current) => current.map((order) => (order.id === id ? { ...order, status: 'Ordered' } : order)))
  }, [])

  const cancelPurchaseOrder = useCallback(
    (id: string) => {
      const order = purchaseOrders.find((item) => item.id === id)
      if (!order) return
      setPurchaseOrders((current) => current.map((item) => (item.id === id ? { ...item, status: 'Cancelled' } : item)))
      logActivity('po.cancelled', `${order.id} for ${order.supplierName} was cancelled.`)
    },
    [purchaseOrders, logActivity],
  )

  const receivePurchaseOrder = useCallback(
    (id: string, lines: { productId: string; quantityReceived: number }[]) => {
      const order = purchaseOrders.find((item) => item.id === id)
      if (!order) return

      // Compute every plain value up front — no side effects (logActivity,
      // ref-counter increments) inside a setState updater, so React 18
      // StrictMode's dev-mode double-invocation of updaters can't double
      // this transaction (matches the pattern in data/demos/integrated/store.tsx).
      const stockDeltas = new Map<string, number>()
      const newMovements: StockMovement[] = []

      const updatedItems = order.items.map((item) => {
        const line = lines.find((entry) => entry.productId === item.productId)
        const remaining = item.quantity - item.receivedQuantity
        const clamped = line ? Math.max(0, Math.min(line.quantityReceived, remaining)) : 0
        if (clamped <= 0) return item

        stockDeltas.set(item.productId, (stockDeltas.get(item.productId) ?? 0) + clamped)
        newMovements.push({
          id: `MOV-${nextMovementId.current++}`,
          productId: item.productId,
          productName: item.productName,
          warehouseId: order.warehouseId,
          warehouseName: order.warehouseName,
          type: 'Stock In',
          quantity: clamped,
          reference: order.id,
          date: today(),
          user: 'Admin User',
        })
        return { ...item, receivedQuantity: item.receivedQuantity + clamped }
      })

      if (newMovements.length === 0) return

      const allReceived = updatedItems.every((item) => item.receivedQuantity >= item.quantity)
      const newStatus = allReceived ? 'Received' : 'Partially Received'
      const totalReceived = newMovements.reduce((sum, movement) => sum + movement.quantity, 0)

      setPurchaseOrders((current) =>
        current.map((item) => (item.id === id ? { ...item, items: updatedItems, status: newStatus } : item)),
      )
      setProducts((current) =>
        current.map((product) =>
          stockDeltas.has(product.id) ? { ...product, stock: product.stock + (stockDeltas.get(product.id) ?? 0) } : product,
        ),
      )
      setMovements((current) => [...newMovements, ...current])
      logActivity('stock.received', `Received ${totalReceived} units against ${order.id} from ${order.supplierName}.`)
    },
    [purchaseOrders, logActivity],
  )

  const value = {
    products,
    warehouses,
    suppliers,
    purchaseOrders,
    movements,
    activity,
    addProduct,
    updateProduct,
    discontinueProduct,
    addWarehouse,
    updateWarehouse,
    deactivateWarehouse,
    addSupplier,
    updateSupplier,
    deactivateSupplier,
    adjustStock,
    addPurchaseOrder,
    markPurchaseOrderOrdered,
    cancelPurchaseOrder,
    receivePurchaseOrder,
    pendingPurchaseOrderProductId,
    setPendingPurchaseOrderProductId,
  }

  return <InventoryDataContext.Provider value={value}>{children}</InventoryDataContext.Provider>
}
