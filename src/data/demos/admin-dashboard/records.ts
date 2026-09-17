import type { DataRecord } from './types'

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

export const initialRecords: DataRecord[] = [
  { id: 'REC-1', name: 'Facilities Maintenance Log Q3', category: 'Facilities', department: 'Operations', value: 128000, status: 'Active', updatedDate: daysAgo(2) },
  { id: 'REC-2', name: 'Vendor Contract — Office Supplies', category: 'Contracts', department: 'Administration', value: 340000, status: 'Active', updatedDate: daysAgo(10) },
  { id: 'REC-3', name: 'Annual Compliance Filing', category: 'Compliance', department: 'Finance', value: 0, status: 'Needs Review', updatedDate: daysAgo(1) },
  { id: 'REC-4', name: 'Employee Onboarding Batch — September', category: 'HR', department: 'Human Resources', value: 0, status: 'Active', updatedDate: daysAgo(3) },
  { id: 'REC-5', name: 'IT Asset Inventory — Laptops', category: 'IT Assets', department: 'IT', value: 2400000, status: 'Active', updatedDate: daysAgo(5) },
  { id: 'REC-6', name: 'Q2 Expense Reconciliation', category: 'Finance', department: 'Finance', value: 890000, status: 'Closed', updatedDate: daysAgo(20) },
  { id: 'REC-7', name: 'Vendor Contract — Cleaning Services', category: 'Contracts', department: 'Administration', value: 96000, status: 'Active', updatedDate: daysAgo(15) },
  { id: 'REC-8', name: 'Warehouse Lease Renewal', category: 'Facilities', department: 'Operations', value: 1200000, status: 'Pending', updatedDate: daysAgo(4) },
  { id: 'REC-9', name: 'Sales Territory Realignment', category: 'Procurement', department: 'Sales', value: 0, status: 'Needs Review', updatedDate: daysAgo(2) },
  { id: 'REC-10', name: 'Payroll Audit — August', category: 'HR', department: 'Human Resources', value: 0, status: 'Closed', updatedDate: daysAgo(18) },
  { id: 'REC-11', name: 'Server Hardware Refresh', category: 'IT Assets', department: 'IT', value: 780000, status: 'Pending', updatedDate: daysAgo(6) },
  { id: 'REC-12', name: 'Insurance Policy Renewal', category: 'Compliance', department: 'Administration', value: 220000, status: 'Active', updatedDate: daysAgo(9) },
  { id: 'REC-13', name: 'Customer Contract — North Region', category: 'Contracts', department: 'Sales', value: 1650000, status: 'Active', updatedDate: daysAgo(7) },
  { id: 'REC-14', name: 'Budget Reallocation — Marketing', category: 'Finance', department: 'Finance', value: 150000, status: 'Needs Review', updatedDate: daysAgo(3) },
  { id: 'REC-15', name: 'Facilities Safety Inspection', category: 'Facilities', department: 'Operations', value: 0, status: 'Closed', updatedDate: daysAgo(25) },
  { id: 'REC-16', name: 'Software License Audit', category: 'IT Assets', department: 'IT', value: 320000, status: 'Active', updatedDate: daysAgo(4) },
]
