import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { HumanResourcesContext } from './context'
import type { EmployeeInput, HumanResourcesContextValue } from './context'
import { readDemoValue, useDemoPersistence } from '../../../lib/demoPersistence'
import { employees as seedEmployees } from './employees'
import { leaveRequests as seedLeaveRequests } from './leave'
import { applicants as seedApplicants } from './recruitment'
import type { Applicant, ApplicantStatus, Employee, LeaveRequest, LeaveStatus } from './types'

/** Namespace for this demo's persisted entities (see src/lib/demoPersistence.ts). */
const SYSTEM = 'human-resources' as const

/**
 * Standalone state for the Human Resource Management System demo.
 *
 * The Employees, Leave and Recruitment pages previously held this in their own
 * `useState`, so a change made on one vanished as soon as the router swapped in
 * another. The logic below is the same logic those pages ran inline, moved up
 * to a provider that outlives the route change and persists between visits.
 *
 * Mirrors the integrated platform store's action names so a page calls the same
 * method whichever store it is talking to, and is a strict subset of it.
 *
 * One deliberate difference from the integrated store: moving an applicant to
 * "Hired" here does **not** create an Employee record. That cross-module
 * consequence belongs to the integrated platform, which is where the two
 * modules actually share a data model; reproducing it standalone would invent a
 * workflow this demo does not otherwise have.
 */
export function HumanResourcesDataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() =>
    readDemoValue(SYSTEM, 'employees', seedEmployees),
  )
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() =>
    readDemoValue(SYSTEM, 'leaveRequests', seedLeaveRequests),
  )
  const [applicants, setApplicants] = useState<Applicant[]>(() =>
    readDemoValue(SYSTEM, 'applicants', seedApplicants),
  )

  useDemoPersistence(SYSTEM, 'employees', employees)
  useDemoPersistence(SYSTEM, 'leaveRequests', leaveRequests)
  useDemoPersistence(SYSTEM, 'applicants', applicants)

  // Seeded past the highest id in the sample data, matching the counter the
  // Employees page used before.
  const nextEmployeeId = useRef(1017)

  const addEmployee = useCallback((values: EmployeeInput) => {
    const newEmployee: Employee = {
      id: `EMP-${nextEmployeeId.current}`,
      ...values,
      joined: new Date().toISOString().slice(0, 10),
    }
    nextEmployeeId.current += 1
    setEmployees((current) => [newEmployee, ...current])
  }, [])

  const updateEmployee = useCallback((id: string, values: EmployeeInput) => {
    setEmployees((current) =>
      current.map((employee) => (employee.id === id ? { ...employee, ...values } : employee)),
    )
  }, [])

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id))
  }, [])

  const updateLeaveStatus = useCallback((id: string, status: LeaveStatus) => {
    setLeaveRequests((current) =>
      current.map((request) => (request.id === id ? { ...request, status } : request)),
    )
  }, [])

  const updateApplicantStatus = useCallback((id: string, status: ApplicantStatus) => {
    setApplicants((current) =>
      current.map((applicant) => (applicant.id === id ? { ...applicant, status } : applicant)),
    )
  }, [])

  const value = useMemo<HumanResourcesContextValue>(
    () => ({
      employees,
      leaveRequests,
      applicants,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      updateLeaveStatus,
      updateApplicantStatus,
    }),
    [
      employees,
      leaveRequests,
      applicants,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      updateLeaveStatus,
      updateApplicantStatus,
    ],
  )

  return <HumanResourcesContext.Provider value={value}>{children}</HumanResourcesContext.Provider>
}
