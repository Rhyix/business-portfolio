/**
 * Entity shapes for the Human Resource Management System demo.
 * Every record produced from these types is fictional sample data — see the
 * DemoNotice component shown throughout the demo shell.
 */

export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'

export interface Employee {
  id: string
  name: string
  department: string
  position: string
  employmentType: EmploymentType
  status: EmployeeStatus
  email: string
  phone: string
  joined: string
  /** Present when this record was created from a Recruitment System hire — e.g. "Recruitment System". */
  source?: string
  /** The originating Recruitment System applicant ID, for duplicate-sync protection and cross-linking. */
  recruitmentApplicantId?: string
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'On Leave'

export interface AttendanceRecord {
  id: string
  employeeName: string
  department: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: AttendanceStatus
}

export type LeaveType = 'Vacation Leave' | 'Sick Leave' | 'Emergency Leave' | 'Personal Leave'
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected'

export interface LeaveRequest {
  id: string
  employeeName: string
  department: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  status: LeaveStatus
  reason: string
}

export type JobOpeningStatus = 'Open' | 'Closed'

export interface JobOpening {
  id: string
  title: string
  department: string
  employmentType: EmploymentType
  location: string
  openings: number
  status: JobOpeningStatus
  postedDate: string
}

export type ApplicantStatus = 'Applied' | 'Screening' | 'Interview' | 'Shortlisted' | 'Rejected' | 'Hired'

export interface Applicant {
  id: string
  name: string
  positionId: string
  positionTitle: string
  status: ApplicantStatus
  appliedDate: string
  email: string
  phone: string
}

export interface InterviewSchedule {
  id: string
  applicantName: string
  positionTitle: string
  date: string
  time: string
  interviewer: string
  mode: 'In-person' | 'Video call' | 'Phone call'
}

export type DocumentType =
  | 'Employment Contract'
  | 'Government ID'
  | 'Certificate'
  | 'Medical Clearance'
  | 'Training Certificate'

export type DocumentStatus = 'Valid' | 'Expiring Soon' | 'Expired' | 'Missing'

export interface EmployeeDocument {
  id: string
  employeeName: string
  type: DocumentType
  uploaded: string | null
  expiry: string | null
  status: DocumentStatus
}
