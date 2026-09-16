import type {
  Customer,
  Product,
  Order,
  Invoice,
  StockMovement,
} from '../business-management/types'
import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  JobOpening,
  Applicant,
  ApplicantStatus,
  InterviewSchedule,
  EmployeeDocument,
} from '../human-resources/types'

export type {
  Customer,
  Product,
  Order,
  Invoice,
  StockMovement,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  JobOpening,
  Applicant,
  ApplicantStatus,
  InterviewSchedule,
  EmployeeDocument,
}

/** Fields supplied by the Customer add/edit form. */
export type CustomerInput = Pick<Customer, 'name' | 'email' | 'phone' | 'company' | 'status'>

/** Fields supplied by the Product add/edit form. */
export type ProductInput = Pick<
  Product,
  'name' | 'sku' | 'category' | 'price' | 'stock' | 'reorderLevel' | 'status'
>

/** Fields supplied by the Employee add/edit form. */
export type EmployeeInput = Pick<
  Employee,
  'name' | 'department' | 'position' | 'employmentType' | 'status' | 'email' | 'phone'
>

/** Minimal input for the integrated platform's "Create order" quick action. */
export interface OrderInput {
  customerId: string
  productId: string
  quantity: number
}

/**
 * Event types the integrated activity feed can record. Kept as a union
 * (rather than a free-form string) so every producer and the feed renderer
 * agree on the vocabulary.
 */
export type ActivityType =
  | 'order.created'
  | 'customer.added'
  | 'employee.added'
  | 'leave.submitted'
  | 'leave.approved'
  | 'leave.rejected'
  | 'product.updated'
  | 'applicant.shortlisted'
  | 'applicant.hired'
  | 'invoice.paid'

export interface ActivityItem {
  id: string
  type: ActivityType
  message: string
  timestamp: string
}
