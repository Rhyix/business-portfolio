/**
 * Entity shapes for the Recruitment Management System demo.
 * Every record produced from these types is fictional sample data — see the
 * DemoNotice component shown throughout the demo shell.
 */

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'

export type VacancyStatus = 'Draft' | 'Open' | 'Paused' | 'Closed'

export interface Vacancy {
  id: string
  title: string
  department: string
  employmentType: EmploymentType
  location: string
  postedDate: string
  description: string
  requirements: string[]
  status: VacancyStatus
}

/** The full hiring pipeline, in order. Assessment sits between Interview and Shortlisted. */
export type ApplicantStage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Assessment'
  | 'Shortlisted'
  | 'Hired'
  | 'Rejected'

export type ApplicantSource = 'Job Board' | 'Referral' | 'Company Website' | 'LinkedIn' | 'Agency'

export interface TimelineEntry {
  id: string
  message: string
  date: string
}

export interface Applicant {
  id: string
  name: string
  vacancyId: string
  positionTitle: string
  appliedDate: string
  stage: ApplicantStage
  experienceYears: number
  experienceSummary: string
  skills: string[]
  education: string
  source: ApplicantSource
  email: string
  phone: string
  timeline: TimelineEntry[]
  /** Free-text note captured when a hiring decision (hired/rejected) is made. */
  decisionNotes?: string
}

export type InterviewFormat = 'Video Call' | 'Phone' | 'In Person'
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled'

export interface Interview {
  id: string
  applicantId: string
  candidateName: string
  positionTitle: string
  interviewer: string
  date: string
  time: string
  format: InterviewFormat
  status: InterviewStatus
  notes: string
}

export type AssessmentType = 'Technical' | 'Behavioral' | 'Written' | 'Practical'
export type AssessmentStatus = 'Pending' | 'In Progress' | 'Completed'

export interface Assessment {
  id: string
  applicantId: string
  candidateName: string
  positionTitle: string
  type: AssessmentType
  date: string
  score: number | null
  status: AssessmentStatus
}

export type Recommendation = 'Strongly Recommend' | 'Recommend' | 'Needs Review' | 'Do Not Recommend'

export interface Evaluation {
  id: string
  applicantId: string
  candidateName: string
  positionTitle: string
  communication: number
  technicalSkills: number
  problemSolving: number
  cultureFit: number
  recommendation: Recommendation
  notes: string
  evaluatedDate: string
}

export type RecruitmentActivityType =
  | 'applicant.submitted'
  | 'applicant.stage_changed'
  | 'interview.scheduled'
  | 'assessment.completed'
  | 'applicant.shortlisted'
  | 'hiring.decided'

export interface RecruitmentActivityItem {
  id: string
  type: RecruitmentActivityType
  message: string
  timestamp: string
}

/** Fields supplied by the vacancy add/edit form. */
export type VacancyInput = Pick<
  Vacancy,
  'title' | 'department' | 'employmentType' | 'location' | 'description' | 'requirements' | 'status'
>

/** Fields supplied by the applicant add/edit form. */
export type ApplicantInput = Pick<
  Applicant,
  'name' | 'vacancyId' | 'positionTitle' | 'experienceYears' | 'experienceSummary' | 'skills' | 'education' | 'source' | 'email' | 'phone'
>

/** Fields supplied by the interview add/edit form. */
export type InterviewInput = Pick<
  Interview,
  'applicantId' | 'candidateName' | 'positionTitle' | 'interviewer' | 'date' | 'time' | 'format' | 'status' | 'notes'
>

/** Fields supplied by the assessment add/edit form. */
export type AssessmentInput = Pick<
  Assessment,
  'applicantId' | 'candidateName' | 'positionTitle' | 'type' | 'date' | 'score' | 'status'
>

/** Fields supplied by the evaluation add/edit form. */
export type EvaluationInput = Pick<
  Evaluation,
  'applicantId' | 'candidateName' | 'positionTitle' | 'communication' | 'technicalSkills' | 'problemSolving' | 'cultureFit' | 'recommendation' | 'notes'
>

/**
 * Reusable event payload emitted whenever a hiring decision is made.
 * Not consumed anywhere in Stage 9 — kept as a clean extension point so
 * Stage 10 can subscribe to hiring outcomes (e.g. to create an Employee
 * record in the Integrated Platform) without reshaping this module.
 */
export interface HiringDecisionEvent {
  applicantId: string
  applicantName: string
  positionTitle: string
  decision: 'Hired' | 'Rejected'
  notes?: string
  date: string
}
