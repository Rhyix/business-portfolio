import { createContext, useContext } from 'react'
import type { Applicant, ApplicantStatus, Employee, LeaveRequest, LeaveStatus } from './types'

/**
 * Fields supplied by the Employee add/edit form. Defined here rather than
 * imported from the integrated demo's types, which already re-exports these
 * entities *from* this module — importing back would invert the dependency.
 * Deliberately identical to the integrated store's equivalent so the same page
 * component can call either store with the same values.
 */
export type EmployeeInput = Pick<
  Employee,
  'name' | 'department' | 'position' | 'employmentType' | 'status' | 'email' | 'phone'
>

/**
 * Standalone Human Resource Management System state.
 *
 * A subset of the integrated platform's contract, covering only what this demo
 * lets a visitor change on its own. Attendance and Documents stay read-only
 * outside the integrated platform, so they are not held here.
 */
export interface HumanResourcesContextValue {
  employees: Employee[]
  leaveRequests: LeaveRequest[]
  applicants: Applicant[]
  addEmployee: (values: EmployeeInput) => void
  updateEmployee: (id: string, values: EmployeeInput) => void
  deleteEmployee: (id: string) => void
  updateLeaveStatus: (id: string, status: LeaveStatus) => void
  updateApplicantStatus: (id: string, status: ApplicantStatus) => void
}

export const HumanResourcesContext = createContext<HumanResourcesContextValue | null>(null)

/**
 * The standalone store, or `null` when rendering inside the integrated
 * platform. Pages read this only in the branch where
 * `useOptionalIntegratedData()` returned null; the platform never mounts this
 * provider, so the two can never both supply the same page.
 */
export function useOptionalHumanResourcesData(): HumanResourcesContextValue | null {
  return useContext(HumanResourcesContext)
}
