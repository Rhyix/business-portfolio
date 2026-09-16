import { createContext, useContext } from 'react'
import type {
  Applicant,
  ApplicantInput,
  ApplicantStage,
  Assessment,
  AssessmentInput,
  Evaluation,
  EvaluationInput,
  Interview,
  InterviewInput,
  RecruitmentActivityItem,
  Vacancy,
  VacancyInput,
} from './types'

export interface RecruitmentDataContextValue {
  vacancies: Vacancy[]
  applicants: Applicant[]
  interviews: Interview[]
  assessments: Assessment[]
  evaluations: Evaluation[]
  activity: RecruitmentActivityItem[]

  addVacancy: (values: VacancyInput) => void
  updateVacancy: (id: string, values: VacancyInput) => void
  deleteVacancy: (id: string) => void

  addApplicant: (values: ApplicantInput) => void
  updateApplicant: (id: string, values: ApplicantInput) => void
  updateApplicantStage: (id: string, stage: ApplicantStage) => void

  addInterview: (values: InterviewInput) => void
  updateInterview: (id: string, values: InterviewInput) => void

  addAssessment: (values: AssessmentInput) => void
  updateAssessment: (id: string, values: AssessmentInput) => void

  addEvaluation: (values: EvaluationInput) => void
  updateEvaluation: (id: string, values: EvaluationInput) => void

  markHired: (applicantId: string, notes?: string) => void
  rejectApplicant: (applicantId: string, notes?: string) => void
  returnToPipeline: (applicantId: string) => void

  /** NotSynced until Hired; Ready once Hired but not yet sent; Synced once queued for the Integrated Platform. */
  getIntegrationStatus: (applicantId: string) => IntegrationStatus
  /** The real Employee ID once the Integrated Platform has created the record — undefined until then. */
  getIntegrationEmployeeId: (applicantId: string) => string | undefined
  /** User-triggered — queues a Hired applicant for Employee creation in the Integrated Platform. Idempotent. */
  syncApplicantToPlatform: (applicantId: string) => SyncOutcome
}

export type IntegrationStatus = 'NotSynced' | 'Ready' | 'Synced'

export type SyncOutcome = { ok: true } | { ok: false; error: string }

export const RecruitmentDataContext = createContext<RecruitmentDataContextValue | null>(null)

/** Reads the recruitment demo's shared store. Must be used within RecruitmentDataProvider. */
export function useRecruitmentData(): RecruitmentDataContextValue {
  const context = useContext(RecruitmentDataContext)
  if (!context) throw new Error('useRecruitmentData must be used within a RecruitmentDataProvider')
  return context
}
