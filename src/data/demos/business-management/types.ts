/**
 * Entity shapes for the Business Management System demo.
 * Every record produced from these types is fictional sample data — see the
 * DemoNotice component shown throughout the demo shell.
 */

export type CustomerStatus = 'Active' | 'Lead' | 'Inactive'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: CustomerStatus
  orders: number
  joined: string
}

export type ProductStatus = 'Active' | 'Draft' | 'Discontinued'

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  reorderLevel: number
  status: ProductStatus
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled'

export interface OrderItem {
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  customerName: string
  date: string
  items: OrderItem[]
  total: number
  status: OrderStatus
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue'

export interface Invoice {
  id: string
  orderId: string
  customerName: string
  date: string
  dueDate: string
  amount: number
  status: InvoiceStatus
}

export type StockMovementType = 'Restock' | 'Sale' | 'Adjustment'

export interface StockMovement {
  id: string
  productName: string
  type: StockMovementType
  quantity: number
  date: string
}
