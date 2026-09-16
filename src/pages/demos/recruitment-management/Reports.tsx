import { useMemo } from 'react'
import { ChartCard } from '../../../components/demo/ChartCard'
import { BarChart } from '../../../components/demo/BarChart'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { formatNumber } from '../../../lib/format'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { ApplicantStage, InterviewStatus } from '../../../data/demos/recruitment/types'

const stageOrder: ApplicantStage[] = ['Applied', 'Screening', 'Interview', 'Assessment', 'Shortlisted', 'Hired', 'Rejected']
const interviewStatusOrder: InterviewStatus[] = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled']

const stageTone: Record<ApplicantStage, string> = {
  Applied: 'bg-ink-300',
  Screening: 'bg-amber-500',
  Interview: 'bg-accent-500',
  Assessment: 'bg-amber-500',
  Shortlisted: 'bg-emerald-400',
  Hired: 'bg-emerald-600',
  Rejected: 'bg-red-400',
}

const interviewTone: Record<InterviewStatus, string> = {
  Scheduled: 'bg-accent-500',
  Completed: 'bg-emerald-500',
  Cancelled: 'bg-red-400',
  Rescheduled: 'bg-amber-500',
}

function ProgressBreakdown({ rows }: { rows: { label: string; count: number; percent: number; tone: string }[] }) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-700">{row.label}</span>
            <span className="text-ink-500">
              {row.count} · {row.percent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-ink-100">
            <div className={`h-2 rounded-full ${row.tone}`} style={{ width: `${Math.max(row.percent, 2)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Reports: applications by stage, positions, funnel, interviews, assessment scores and hire/reject outcomes. */
export function Reports() {
  const { applicants, interviews, assessments } = useRecruitmentData()

  const applicationsByStage = useMemo(
    () => stageOrder.map((stage) => ({ label: stage, value: applicants.filter((applicant) => applicant.stage === stage).length })),
    [applicants],
  )

  const applicantsByPosition = useMemo(() => {
    const counts = new Map<string, number>()
    for (const applicant of applicants) {
      counts.set(applicant.positionTitle, (counts.get(applicant.positionTitle) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [applicants])

  const hiringFunnel = useMemo(() => {
    const total = applicants.length || 1
    return stageOrder.map((stage) => {
      const count = applicants.filter((applicant) => applicant.stage === stage).length
      return { label: stage, count, percent: Math.round((count / total) * 100), tone: stageTone[stage] }
    })
  }, [applicants])

  const interviewBreakdown = useMemo(() => {
    const total = interviews.length || 1
    return interviewStatusOrder.map((status) => {
      const count = interviews.filter((interview) => interview.status === status).length
      return { label: status, count, percent: Math.round((count / total) * 100), tone: interviewTone[status] }
    })
  }, [interviews])

  const assessmentScoresByType = useMemo(() => {
    const totals = new Map<string, { sum: number; count: number }>()
    for (const assessment of assessments) {
      if (assessment.score === null) continue
      const existing = totals.get(assessment.type) ?? { sum: 0, count: 0 }
      totals.set(assessment.type, { sum: existing.sum + assessment.score, count: existing.count + 1 })
    }
    return Array.from(totals.entries()).map(([label, { sum, count }]) => ({ label, value: Math.round(sum / count) }))
  }, [assessments])

  const hiresVsRejections = useMemo(() => {
    const hired = applicants.filter((applicant) => applicant.stage === 'Hired').length
    const rejected = applicants.filter((applicant) => applicant.stage === 'Rejected').length
    return [
      { label: 'Hired', value: hired },
      { label: 'Rejected', value: rejected },
    ]
  }, [applicants])

  const completedInterviews = interviews.filter((interview) => interview.status === 'Completed').length

  return (
    <div className="space-y-8">
      <DemoNotice variant="inline" />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Applications by stage" subtitle="Current candidates across the pipeline">
          <BarChart data={applicationsByStage} formatValue={formatNumber} />
        </ChartCard>
        <ChartCard title="Applicants by position" subtitle="Top open roles by candidate volume">
          <BarChart data={applicantsByPosition} formatValue={formatNumber} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Hiring funnel" subtitle="Share of candidates at each stage">
          <ProgressBreakdown rows={hiringFunnel} />
        </ChartCard>
        <ChartCard title="Interviews" subtitle={`${completedInterviews} of ${interviews.length} completed`}>
          <ProgressBreakdown rows={interviewBreakdown} />
        </ChartCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Assessment scores" subtitle="Average score by assessment type">
          <BarChart data={assessmentScoresByType} formatValue={(value) => `${value}/100`} />
        </ChartCard>
        <ChartCard title="Hires vs rejections" subtitle="Final outcomes recorded in this demo">
          <BarChart data={hiresVsRejections} formatValue={formatNumber} />
        </ChartCard>
      </div>
    </div>
  )
}
