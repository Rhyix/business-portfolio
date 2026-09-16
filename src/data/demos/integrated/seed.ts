import { initialCustomers } from '../business-management/customers'
import { initialProducts } from '../business-management/products'
import { initialOrders } from '../business-management/orders'
import { initialInvoices } from '../business-management/invoices'
import { stockMovements } from '../business-management/inventory'
import { employees as seedEmployees } from '../human-resources/employees'
import { attendanceRecords, attendanceDates } from '../human-resources/attendance'
import { leaveRequests as seedLeaveRequests } from '../human-resources/leave'
import { jobOpenings, applicants as seedApplicants, interviewSchedule } from '../human-resources/recruitment'
import { employeeDocuments } from '../human-resources/documents'
import type { ActivityItem } from './types'

/**
 * Initial state for the integrated platform's shared demo store.
 * Reuses the same fictional records already shipped with the standalone
 * Business Management System and Human Resource Management System demos,
 * rather than inventing a second data set.
 */
export const seedCustomers = initialCustomers
export const seedProducts = initialProducts
export const seedOrders = initialOrders
export const seedInvoices = initialInvoices
export const seedStockMovements = stockMovements

export const seedEmployeesList = seedEmployees
export const seedAttendanceRecords = attendanceRecords
export const seedAttendanceDates = attendanceDates
export const seedLeaveRequestsList = seedLeaveRequests
export const seedJobOpenings = jobOpenings
export const seedApplicantsList = seedApplicants
export const seedInterviewSchedule = interviewSchedule
export const seedDocuments = employeeDocuments

/** Starting activity feed, mixing business and workforce events for a realistic session opener. */
export const seedActivity: ActivityItem[] = [
  {
    id: 'act-seed-1',
    type: 'order.created',
    message: 'ORD-5012 created for Jefferson Cruz (Corrugated Shipping Box, Medium × 800).',
    timestamp: '2026-09-13',
  },
  {
    id: 'act-seed-2',
    type: 'applicant.shortlisted',
    message: 'Noel Fabros was shortlisted for Full Stack Developer.',
    timestamp: '2026-09-15',
  },
  {
    id: 'act-seed-3',
    type: 'leave.approved',
    message: "Remedios Santiago's sick leave request was approved.",
    timestamp: '2026-09-15',
  },
  {
    id: 'act-seed-4',
    type: 'invoice.paid',
    message: 'INV-3010 for Jefferson Cruz was marked paid.',
    timestamp: '2026-09-13',
  },
  {
    id: 'act-seed-5',
    type: 'leave.submitted',
    message: 'Rafael Buenaventura submitted a personal leave request.',
    timestamp: '2026-09-14',
  },
]
