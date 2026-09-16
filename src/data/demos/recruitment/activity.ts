import type { RecruitmentActivityItem } from './types'

/** Starting activity feed for the Recruitment Management System demo. */
export const initialActivity: RecruitmentActivityItem[] = [
  {
    id: 'ract-1',
    type: 'hiring.decided',
    message: 'Milagros Quibuyen was hired as HR Business Partner.',
    timestamp: '2026-08-26',
  },
  {
    id: 'ract-2',
    type: 'hiring.decided',
    message: 'Isagani Bautista was hired as DevOps Engineer.',
    timestamp: '2026-08-29',
  },
  {
    id: 'ract-3',
    type: 'applicant.shortlisted',
    message: 'Perpetua Nazarro was shortlisted for Sales Development Representative.',
    timestamp: '2026-09-03',
  },
  {
    id: 'ract-4',
    type: 'assessment.completed',
    message: 'Bienvenido Tampoc completed the technical assessment for Senior Frontend Engineer.',
    timestamp: '2026-08-20',
  },
  {
    id: 'ract-5',
    type: 'interview.scheduled',
    message: 'Interview scheduled with Adonis Villaruz for Backend Engineer.',
    timestamp: '2026-09-12',
  },
  {
    id: 'ract-6',
    type: 'applicant.stage_changed',
    message: 'Restie Abenojar moved to Assessment for Backend Engineer.',
    timestamp: '2026-09-02',
  },
  {
    id: 'ract-7',
    type: 'applicant.submitted',
    message: 'Ronaldo Guintu applied for Sales Development Representative.',
    timestamp: '2026-09-13',
  },
]
