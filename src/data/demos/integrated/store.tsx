import { useCallback, useEffect, useRef, useState } from 'react'
import { readDemoValue, useDemoPersistence } from '../../../lib/demoPersistence'
import type { ReactNode } from 'react'
import { IntegratedDataContext } from './context'
import type { IntegratedDataContextValue } from './context'
import { reconcileHires } from '../../../lib/integrationBridge'
import {
  seedApplicantsList,
  seedAttendanceDates,
  seedAttendanceRecords,
  seedCustomers,
  seedDocuments,
  seedEmployeesList,
  seedInterviewSchedule,
  seedInvoices,
  seedJobOpenings,
  seedLeaveRequestsList,
  seedOrders,
  seedProducts,
  seedStockMovements,
  seedActivity,
} from './seed'
import type {
  ActivityItem,
  ActivityType,
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

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Shared in-memory demo store for the integrated platform. A lightweight
 * custom store (useState + plain updater functions) rather than a reducer or
 * a state library — the entity set is small and every update is a simple
 * array replace, so the extra ceremony wasn't warranted.
 *
 * Reused directly by any page that calls `useOptionalIntegratedData()`: the
 * same Customers/Orders/Employees/Leave/Recruitment page components render
 * inside the standalone BMS/HRMS demos (local state, no provider) and inside
 * this integrated platform (shared state, provider present).
 */
/** Namespace for this demo's persisted entities (see src/lib/demoPersistence.ts). */
const SYSTEM = 'integrated' as const

export function IntegratedDataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => readDemoValue(SYSTEM, 'customers', seedCustomers))
  const [products, setProducts] = useState<Product[]>(() => readDemoValue(SYSTEM, 'products', seedProducts))
  const [orders, setOrders] = useState<Order[]>(() => readDemoValue(SYSTEM, 'orders', seedOrders))
  const [invoices, setInvoices] = useState<Invoice[]>(() => readDemoValue(SYSTEM, 'invoices', seedInvoices))
  const [employees, setEmployees] = useState<Employee[]>(() => readDemoValue(SYSTEM, 'employees', seedEmployeesList))
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => readDemoValue(SYSTEM, 'leaveRequests', seedLeaveRequestsList))
  const [applicants, setApplicants] = useState(() => readDemoValue(SYSTEM, 'applicants', seedApplicantsList))
  const [activity, setActivity] = useState<ActivityItem[]>(() => readDemoValue(SYSTEM, 'activity', seedActivity))

  // Mirrors each entity into localStorage whenever it changes, so a visitor's
  // session survives a refresh. Write-only: the seeds above already read it.
  useDemoPersistence(SYSTEM, 'customers', customers)
  useDemoPersistence(SYSTEM, 'products', products)
  useDemoPersistence(SYSTEM, 'orders', orders)
  useDemoPersistence(SYSTEM, 'invoices', invoices)
  useDemoPersistence(SYSTEM, 'employees', employees)
  useDemoPersistence(SYSTEM, 'leaveRequests', leaveRequests)
  useDemoPersistence(SYSTEM, 'applicants', applicants)
  useDemoPersistence(SYSTEM, 'activity', activity)

  const nextCustomerId = useRef(1015)
  const nextProductId = useRef(2015)
  const nextOrderId = useRef(5013)
  const nextEmployeeId = useRef(1017)
  const nextActivityId = useRef(1)

  const logActivity = useCallback((type: ActivityType, message: string) => {
    setActivity((current) =>
      [{ id: `act-${nextActivityId.current++}`, type, message, timestamp: today() }, ...current].slice(0, 25),
    )
  }, [])

  const addCustomer = useCallback(
    (values: CustomerInput) => {
      const newCustomer: Customer = {
        id: `CUS-${nextCustomerId.current++}`,
        ...values,
        orders: 0,
        joined: today(),
      }
      setCustomers((current) => [newCustomer, ...current])
      logActivity('customer.added', `${newCustomer.name} was added as a new customer.`)
    },
    [logActivity],
  )

  const updateCustomer = useCallback((id: string, values: CustomerInput) => {
    setCustomers((current) => current.map((customer) => (customer.id === id ? { ...customer, ...values } : customer)))
  }, [])

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((current) => current.filter((customer) => customer.id !== id))
  }, [])

  const addProduct = useCallback(
    (values: ProductInput) => {
      const newProduct: Product = { id: `PRD-${nextProductId.current++}`, ...values }
      setProducts((current) => [newProduct, ...current])
      logActivity('product.updated', `${newProduct.name} was added to the catalogue.`)
    },
    [logActivity],
  )

  const updateProduct = useCallback(
    (id: string, values: ProductInput) => {
      setProducts((current) => current.map((product) => (product.id === id ? { ...product, ...values } : product)))
      logActivity('product.updated', `${values.name} was updated.`)
    },
    [logActivity],
  )

  const deleteProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id))
  }, [])

  const addOrder = useCallback(
    (input: OrderInput) => {
      const customer = customers.find((item) => item.id === input.customerId)
      const product = products.find((item) => item.id === input.productId)
      if (!customer || !product) return

      const quantity = Math.max(1, Math.round(input.quantity))
      const newOrder: Order = {
        id: `ORD-${nextOrderId.current++}`,
        customerName: customer.name,
        date: today(),
        items: [{ productName: product.name, quantity, unitPrice: product.price }],
        total: product.price * quantity,
        status: 'Pending',
      }

      setOrders((current) => [newOrder, ...current])
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, stock: Math.max(0, item.stock - quantity) } : item,
        ),
      )
      setCustomers((current) =>
        current.map((item) => (item.id === customer.id ? { ...item, orders: item.orders + 1 } : item)),
      )
      logActivity(
        'order.created',
        `${newOrder.id} created for ${customer.name} (${product.name} × ${quantity}).`,
      )
    },
    [customers, products, logActivity],
  )

  const markInvoicePaid = useCallback(
    (id: string) => {
      const invoice = invoices.find((item) => item.id === id)
      if (!invoice || invoice.status === 'Paid') return
      setInvoices((current) => current.map((item) => (item.id === id ? { ...item, status: 'Paid' } : item)))
      logActivity('invoice.paid', `${invoice.id} for ${invoice.customerName} was marked paid.`)
    },
    [invoices, logActivity],
  )

  const addEmployee = useCallback(
    (values: EmployeeInput) => {
      const newEmployee: Employee = { id: `EMP-${nextEmployeeId.current++}`, ...values, joined: today() }
      setEmployees((current) => [newEmployee, ...current])
      logActivity('employee.added', `${newEmployee.name} joined ${newEmployee.department} as ${newEmployee.position}.`)
    },
    [logActivity],
  )

  // Tracks which recruitment applicant IDs this mount has already turned
  // into an Employee, so React StrictMode's double effect invocation (dev
  // only) can't create a duplicate — see reconcileHires below.
  const reconciledHireApplicantIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Turns each queued-or-already-synced hire from the bridge into an
    // Employee, reusing the Employee ID a previous visit assigned.
    //
    // The Employee list itself now persists (see useDemoPersistence above), so
    // a hire reconciled on an earlier visit is already in the list when this
    // runs. The guard inside setEmployees is what stops it being re-created on
    // every reload — before persistence the list always started from seed, so
    // an unconditional insert was correct and is no longer.
    // See src/lib/integrationBridge.ts.
    reconcileHires((record) => {
      if (reconciledHireApplicantIds.current.has(record.applicantId)) {
        return record.employeeId ?? ''
      }
      reconciledHireApplicantIds.current.add(record.applicantId)

      const id = record.employeeId ?? `EMP-${nextEmployeeId.current++}`
      const newEmployee: Employee = {
        id,
        name: record.applicantName,
        department: record.department,
        position: record.positionTitle,
        employmentType: record.employmentType,
        status: 'Active',
        email: record.email,
        phone: record.phone,
        joined: record.hiredDate,
        source: 'Recruitment System',
        recruitmentApplicantId: record.applicantId,
      }
      let created = false
      setEmployees((current) => {
        // Checked against current state rather than a mount-scoped ref, so a
        // record persisted by an earlier visit counts as already reconciled.
        if (current.some((employee) => employee.recruitmentApplicantId === record.applicantId)) {
          return current
        }
        created = true
        return [newEmployee, ...current]
      })
      if (created) {
        logActivity(
          'employee.added',
          `${newEmployee.name} joined ${newEmployee.department} as ${newEmployee.position} — added from Recruitment System.`,
        )
      }
      return id
    })
  }, [logActivity])

  const updateEmployee = useCallback((id: string, values: EmployeeInput) => {
    setEmployees((current) => current.map((employee) => (employee.id === id ? { ...employee, ...values } : employee)))
  }, [])

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id))
  }, [])

  const updateLeaveStatus = useCallback(
    (id: string, status: 'Approved' | 'Rejected') => {
      const request = leaveRequests.find((item) => item.id === id)
      if (!request) return
      setLeaveRequests((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
      logActivity(
        status === 'Approved' ? 'leave.approved' : 'leave.rejected',
        `${request.employeeName}'s ${request.type.toLowerCase()} request was ${status.toLowerCase()}.`,
      )
    },
    [leaveRequests, logActivity],
  )

  const updateApplicantStatus = useCallback(
    (id: string, status: ApplicantStatus) => {
      const applicant = applicants.find((item) => item.id === id)
      if (!applicant) return

      setApplicants((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))

      if (status === 'Hired') {
        const opening = seedJobOpenings.find((job) => job.id === applicant.positionId)
        const newEmployee: Employee = {
          id: `EMP-${nextEmployeeId.current++}`,
          name: applicant.name,
          department: opening?.department ?? 'General',
          position: applicant.positionTitle,
          employmentType: opening?.employmentType ?? 'Full-time',
          status: 'Active',
          email: applicant.email,
          phone: applicant.phone,
          joined: today(),
        }
        setEmployees((current) => [newEmployee, ...current])
        logActivity(
          'applicant.hired',
          `${applicant.name} was hired as ${applicant.positionTitle} and added to Employees.`,
        )
      } else if (status === 'Shortlisted') {
        logActivity('applicant.shortlisted', `${applicant.name} was shortlisted for ${applicant.positionTitle}.`)
      }
    },
    [applicants, logActivity],
  )

  const value: IntegratedDataContextValue = {
    customers,
    products,
    orders,
    invoices,
    employees,
    leaveRequests,
    activity,
    stockMovements: seedStockMovements,
    jobOpenings: seedJobOpenings,
    applicants,
    interviews: seedInterviewSchedule,
    attendanceRecords: seedAttendanceRecords,
    attendanceDates: seedAttendanceDates,
    documents: seedDocuments,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    markInvoicePaid,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    updateLeaveStatus,
    updateApplicantStatus,
  }

  return <IntegratedDataContext.Provider value={value}>{children}</IntegratedDataContext.Provider>
}
