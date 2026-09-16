import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { RecruitmentDataContext } from './context'
import { initialVacancies } from './vacancies'
import { initialApplicants } from './applicants'
import { initialInterviews } from './interviews'
import { initialAssessments } from './assessments'
import { initialEvaluations } from './evaluations'
import { initialActivity } from './activity'
import type {
  Applicant,
  ApplicantInput,
  ApplicantStage,
  Assessment,
  AssessmentInput,
  Evaluation,
  EvaluationInput,
  HiringDecisionEvent,
  Interview,
  InterviewInput,
  RecruitmentActivityItem,
  RecruitmentActivityType,
  Vacancy,
  VacancyInput,
} from './types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

interface RecruitmentDataProviderProps {
  children: ReactNode
  /**
   * Called whenever an applicant is hired or rejected. Not used within this
   * demo — a clean extension point so a future stage can sync hiring
   * outcomes into the Integrated Platform without this module needing any
   * knowledge of that system.
   */
  onHiringDecision?: (event: HiringDecisionEvent) => void
}

/**
 * Shared in-memory demo store for the Recruitment Management System. A
 * lightweight custom store (useState + plain updater functions), scoped
 * entirely to this demo — it does not read or write the Integrated
 * Platform's store.
 */
export function RecruitmentDataProvider({ children, onHiringDecision }: RecruitmentDataProviderProps) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies)
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants)
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews)
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments)
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations)
  const [activity, setActivity] = useState<RecruitmentActivityItem[]>(initialActivity)

  const nextVacancyId = useRef(111)
  const nextApplicantId = useRef(221)
  const nextInterviewId = useRef(311)
  const nextAssessmentId = useRef(411)
  const nextEvaluationId = useRef(508)
  const nextTimelineId = useRef(1)
  const nextActivityId = useRef(1)

  const logActivity = useCallback((type: RecruitmentActivityType, message: string) => {
    setActivity((current) =>
      [{ id: `ract-${nextActivityId.current++}`, type, message, timestamp: today() }, ...current].slice(0, 25),
    )
  }, [])

  const addVacancy = useCallback(
    (values: VacancyInput) => {
      const newVacancy: Vacancy = { id: `VAC-${nextVacancyId.current++}`, ...values, postedDate: today() }
      setVacancies((current) => [newVacancy, ...current])
      logActivity('applicant.submitted', `${newVacancy.title} was posted as a new vacancy.`)
    },
    [logActivity],
  )

  const updateVacancy = useCallback((id: string, values: VacancyInput) => {
    setVacancies((current) => current.map((vacancy) => (vacancy.id === id ? { ...vacancy, ...values } : vacancy)))
  }, [])

  const deleteVacancy = useCallback((id: string) => {
    setVacancies((current) => current.filter((vacancy) => vacancy.id !== id))
  }, [])

  const addApplicant = useCallback(
    (values: ApplicantInput) => {
      const newApplicant: Applicant = {
        id: `APP-${nextApplicantId.current++}`,
        ...values,
        appliedDate: today(),
        stage: 'Applied',
        timeline: [{ id: `evt-${nextTimelineId.current++}`, message: `Application submitted for ${values.positionTitle}.`, date: today() }],
      }
      setApplicants((current) => [newApplicant, ...current])
      logActivity('applicant.submitted', `${newApplicant.name} applied for ${newApplicant.positionTitle}.`)
    },
    [logActivity],
  )

  const updateApplicant = useCallback((id: string, values: ApplicantInput) => {
    setApplicants((current) => current.map((applicant) => (applicant.id === id ? { ...applicant, ...values } : applicant)))
  }, [])

  const applyStageChange = useCallback(
    (applicantId: string, stage: ApplicantStage, notes?: string) => {
      const applicant = applicants.find((item) => item.id === applicantId)
      if (!applicant) return

      const timelineMessage =
        stage === 'Hired'
          ? `Hired as ${applicant.positionTitle}.`
          : stage === 'Rejected'
            ? `Not selected for ${applicant.positionTitle}.`
            : `Moved to ${stage}.`

      setApplicants((current) =>
        current.map((item) =>
          item.id === applicantId
            ? {
                ...item,
                stage,
                decisionNotes: stage === 'Hired' || stage === 'Rejected' ? notes : item.decisionNotes,
                timeline: [...item.timeline, { id: `evt-${nextTimelineId.current++}`, message: timelineMessage, date: today() }],
              }
            : item,
        ),
      )

      if (stage === 'Hired' || stage === 'Rejected') {
        logActivity('hiring.decided', `${applicant.name} was marked ${stage.toLowerCase()} for ${applicant.positionTitle}.`)
        onHiringDecision?.({
          applicantId,
          applicantName: applicant.name,
          positionTitle: applicant.positionTitle,
          decision: stage,
          notes,
          date: today(),
        })
      } else if (stage === 'Shortlisted') {
        logActivity('applicant.shortlisted', `${applicant.name} was shortlisted for ${applicant.positionTitle}.`)
      } else {
        logActivity('applicant.stage_changed', `${applicant.name} moved to ${stage} for ${applicant.positionTitle}.`)
      }
    },
    [applicants, logActivity, onHiringDecision],
  )

  const updateApplicantStage = useCallback(
    (id: string, stage: ApplicantStage) => applyStageChange(id, stage),
    [applyStageChange],
  )

  const markHired = useCallback((applicantId: string, notes?: string) => applyStageChange(applicantId, 'Hired', notes), [applyStageChange])
  const rejectApplicant = useCallback((applicantId: string, notes?: string) => applyStageChange(applicantId, 'Rejected', notes), [applyStageChange])
  const returnToPipeline = useCallback((applicantId: string) => applyStageChange(applicantId, 'Shortlisted'), [applyStageChange])

  const addInterview = useCallback(
    (values: InterviewInput) => {
      const newInterview: Interview = { id: `INT-${nextInterviewId.current++}`, ...values }
      setInterviews((current) => [newInterview, ...current])
      logActivity('interview.scheduled', `Interview scheduled with ${newInterview.candidateName} for ${newInterview.positionTitle}.`)
    },
    [logActivity],
  )

  const updateInterview = useCallback((id: string, values: InterviewInput) => {
    setInterviews((current) => current.map((interview) => (interview.id === id ? { ...interview, ...values } : interview)))
  }, [])

  const addAssessment = useCallback(
    (values: AssessmentInput) => {
      const newAssessment: Assessment = { id: `ASM-${nextAssessmentId.current++}`, ...values }
      setAssessments((current) => [newAssessment, ...current])
    },
    [],
  )

  const updateAssessment = useCallback(
    (id: string, values: AssessmentInput) => {
      setAssessments((current) => current.map((assessment) => (assessment.id === id ? { ...assessment, ...values } : assessment)))
      if (values.status === 'Completed') {
        logActivity('assessment.completed', `${values.candidateName} completed the ${values.type.toLowerCase()} assessment for ${values.positionTitle}.`)
      }
    },
    [logActivity],
  )

  const addEvaluation = useCallback((values: EvaluationInput) => {
    const newEvaluation: Evaluation = { id: `EVL-${nextEvaluationId.current++}`, ...values, evaluatedDate: today() }
    setEvaluations((current) => [newEvaluation, ...current])
  }, [])

  const updateEvaluation = useCallback((id: string, values: EvaluationInput) => {
    setEvaluations((current) => current.map((evaluation) => (evaluation.id === id ? { ...evaluation, ...values } : evaluation)))
  }, [])

  const value = {
    vacancies,
    applicants,
    interviews,
    assessments,
    evaluations,
    activity,
    addVacancy,
    updateVacancy,
    deleteVacancy,
    addApplicant,
    updateApplicant,
    updateApplicantStage,
    addInterview,
    updateInterview,
    addAssessment,
    updateAssessment,
    addEvaluation,
    updateEvaluation,
    markHired,
    rejectApplicant,
    returnToPipeline,
  }

  return <RecruitmentDataContext.Provider value={value}>{children}</RecruitmentDataContext.Provider>
}
