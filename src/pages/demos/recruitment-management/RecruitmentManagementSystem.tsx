import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { useRouter } from '../../../lib/useRouter'
import { DemoShell } from '../../../components/demo/DemoShell'
import type { GlobalSearchResult } from '../../../components/demo/types'
import { RecruitmentDataProvider } from '../../../data/demos/recruitment/store'
import { useRecruitmentData } from '../../../data/demos/recruitment/context'
import type { RecruitmentDataContextValue } from '../../../data/demos/recruitment/context'
import { appName, basePath, demoNavGroups, demoNavItems, demoNotifications } from '../../../data/demos/recruitment/navigation'
import { Dashboard } from './Dashboard'
import { Vacancies } from './Vacancies'
import { Applicants } from './Applicants'
import { Pipeline } from './Pipeline'
import { Interviews } from './Interviews'
import { Assessments } from './Assessments'
import { Evaluations } from './Evaluations'
import { Hiring } from './Hiring'
import { Reports } from './Reports'
import { Settings } from './Settings'

interface RecruitmentRoute {
  key: string
  title: string
  Component: ComponentType
}

const routes: Record<string, RecruitmentRoute> = {
  '': { key: 'dashboard', title: 'Dashboard', Component: Dashboard },
  '/vacancies': { key: 'vacancies', title: 'Job Vacancies', Component: Vacancies },
  '/applicants': { key: 'applicants', title: 'Applicants', Component: Applicants },
  '/pipeline': { key: 'pipeline', title: 'Candidate Pipeline', Component: Pipeline },
  '/interviews': { key: 'interviews', title: 'Interviews', Component: Interviews },
  '/assessments': { key: 'assessments', title: 'Assessments', Component: Assessments },
  '/evaluations': { key: 'evaluations', title: 'Evaluations', Component: Evaluations },
  '/hiring': { key: 'hiring', title: 'Hiring Decisions', Component: Hiring },
  '/reports': { key: 'reports', title: 'Reports', Component: Reports },
  '/settings': { key: 'settings', title: 'Settings', Component: Settings },
}

function buildSearchResults(shared: RecruitmentDataContextValue, query: string): GlobalSearchResult[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const results: GlobalSearchResult[] = []

  for (const vacancy of shared.vacancies) {
    if (vacancy.title.toLowerCase().includes(needle) || vacancy.department.toLowerCase().includes(needle)) {
      results.push({ id: `vacancy-${vacancy.id}`, kind: 'Vacancy', label: vacancy.title, sublabel: vacancy.department, to: '/vacancies' })
    }
  }
  for (const applicant of shared.applicants) {
    if (applicant.name.toLowerCase().includes(needle) || applicant.positionTitle.toLowerCase().includes(needle)) {
      results.push({
        id: `applicant-${applicant.id}`,
        kind: 'Applicant',
        label: applicant.name,
        sublabel: applicant.positionTitle,
        to: '/applicants',
      })
    }
  }
  for (const interview of shared.interviews) {
    if (interview.candidateName.toLowerCase().includes(needle) || interview.positionTitle.toLowerCase().includes(needle)) {
      results.push({
        id: `interview-${interview.id}`,
        kind: 'Interview',
        label: interview.candidateName,
        sublabel: `${interview.positionTitle} · ${interview.date}`,
        to: '/interviews',
      })
    }
  }
  for (const assessment of shared.assessments) {
    if (assessment.candidateName.toLowerCase().includes(needle) || assessment.type.toLowerCase().includes(needle)) {
      results.push({
        id: `assessment-${assessment.id}`,
        kind: 'Assessment',
        label: assessment.candidateName,
        sublabel: `${assessment.type} assessment`,
        to: '/assessments',
      })
    }
  }

  return results.slice(0, 8)
}

function RecruitmentShell() {
  const { path } = useRouter()
  const shared = useRecruitmentData()
  const [searchQuery, setSearchQuery] = useState('')

  const subPath = path.slice(basePath.length)
  const route = routes[subPath] ?? routes['']
  const { Component } = route

  const searchResults = useMemo(() => buildSearchResults(shared, searchQuery), [shared, searchQuery])

  return (
    <DemoShell
      appName={appName}
      basePath={basePath}
      navItems={demoNavItems}
      groups={demoNavGroups}
      notifications={demoNotifications}
      activeKey={route.key}
      pageTitle={route.title}
      globalSearch={{
        query: searchQuery,
        onQueryChange: setSearchQuery,
        results: searchResults,
        placeholder: 'Search vacancies, applicants, interviews…',
      }}
    >
      <Component />
    </DemoShell>
  )
}

/**
 * Recruitment Management System: a standalone, dedicated recruitment product
 * with its own in-memory store (see data/demos/recruitment/store.tsx). Not
 * wired into the Integrated Platform this stage — see HiringDecisionEvent
 * for the clean extension point a future stage can use.
 */
export function RecruitmentManagementSystem() {
  return (
    <RecruitmentDataProvider>
      <RecruitmentShell />
    </RecruitmentDataProvider>
  )
}
