import { createContext, useContext } from 'react'
import type {
  ActivityItem,
  ApplicantStatus,
  Customer,
  CustomerInput,
  Employee,
  EmployeeInput,
  Invoice,
  LeaveRequest,
  Order,
  OrderInput,
  Product,
  ProductInput,
} from './types'
import type {
  seedApplicantsList,
  seedAttendanceDates,
  seedAttendanceRecords,
  seedDocuments,
  seedInterviewSchedule,
  seedJobOpenings,
  seedStockMovements,
} from './seed'

export interface IntegratedDataContextValue {
  customers: Customer[]
  products: Product[]
  orders: Order[]
  invoices: Invoice[]
  employees: Employee[]
  leaveRequests: LeaveRequest[]
  activity: ActivityItem[]

  // Read-only reused module data — not mutated in this stage, kept here so
  // pages have one place to read a consistent snapshot when inside the
  // integrated platform.
  stockMovements: typeof seedStockMovements
  jobOpenings: typeof seedJobOpenings
  applicants: typeof seedApplicantsList
  interviews: typeof seedInterviewSchedule
  attendanceRecords: typeof seedAttendanceRecords
  attendanceDates: typeof seedAttendanceDates
  documents: typeof seedDocuments

  addCustomer: (values: CustomerInput) => void
  updateCustomer: (id: string, values: CustomerInput) => void
  deleteCustomer: (id: string) => void

  addProduct: (values: ProductInput) => void
  updateProduct: (id: string, values: ProductInput) => void
  deleteProduct: (id: string) => void

  addOrder: (input: OrderInput) => void
  markInvoicePaid: (id: string) => void

  addEmployee: (values: EmployeeInput) => void
  updateEmployee: (id: string, values: EmployeeInput) => void
  deleteEmployee: (id: string) => void

  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void
  updateApplicantStatus: (id: string, status: ApplicantStatus) => void
}

export const IntegratedDataContext = createContext<IntegratedDataContextValue | null>(null)

/** Reads the shared store. Throws outside a provider — use for integrated-only pages. */
export function useIntegratedData(): IntegratedDataContextValue {
  const context = useContext(IntegratedDataContext)
  if (!context) throw new Error('useIntegratedData must be used within an IntegratedDataProvider')
  return context
}

/**
 * Reads the shared store if one is present, otherwise `null`. Lets a page
 * component work both standalone (local state, no provider — BMS/HRMS) and
 * inside the integrated platform (shared state) without duplicating itself.
 */
export function useOptionalIntegratedData(): IntegratedDataContextValue | null {
  return useContext(IntegratedDataContext)
}
