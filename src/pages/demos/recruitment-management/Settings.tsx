import { useId, useState } from 'react'
import { Bell, Building2, SlidersHorizontal, Star } from 'lucide-react'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'

type SettingsTab = 'general' | 'workflow' | 'notifications' | 'criteria'

const tabs: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'workflow', label: 'Recruitment Workflow', icon: SlidersHorizontal },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'criteria', label: 'Evaluation Criteria', icon: Star },
]

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-ink-200/80 bg-white p-4">
      <span>
        <span className="block text-sm font-medium text-ink-900">{label}</span>
        <span className="block text-xs text-ink-500">{description}</span>
      </span>
      <span className="relative inline-flex shrink-0 items-center">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
        <span
          aria-hidden="true"
          className="h-6 w-11 rounded-full bg-ink-200 transition-colors duration-200 peer-checked:bg-accent-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-600"
        />
        <span
          aria-hidden="true"
          className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-soft transition-transform duration-200 peer-checked:translate-x-5"
        />
      </span>
    </label>
  )
}

/** Settings page: demo-only general, workflow, notification and evaluation-criteria panels, backed by local state. */
export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const tabListId = useId()

  const [teamName, setTeamName] = useState('AETEX Talent Acquisition')
  const [recruitingEmail, setRecruitingEmail] = useState('talent@demo-aetex.example')
  const [timezone, setTimezone] = useState('Asia/Manila')
  const [savedNotice, setSavedNotice] = useState(false)

  const [defaultPipeline, setDefaultPipeline] = useState('Standard (7 stages)')
  const [autoArchive, setAutoArchive] = useState(true)
  const [requireEvaluation, setRequireEvaluation] = useState(true)
  const [screeningWindow, setScreeningWindow] = useState('5')

  const [newApplicantAlerts, setNewApplicantAlerts] = useState(true)
  const [interviewReminders, setInterviewReminders] = useState(true)
  const [hiringDecisionAlerts, setHiringDecisionAlerts] = useState(false)

  const [minRecommendationScore, setMinRecommendationScore] = useState('3')
  const [requireAllDimensions, setRequireAllDimensions] = useState(true)

  const handleSaveGeneral = () => {
    setSavedNotice(true)
    window.setTimeout(() => setSavedNotice(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <DemoNotice variant="inline" />

      <div role="tablist" aria-label="Settings sections" id={tabListId} className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.key === activeTab

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`${tabListId}-${tab.key}-tab`}
              aria-selected={isActive}
              aria-controls={`${tabListId}-${tab.key}-panel`}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive ? 'bg-ink-950 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'general' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-general-panel`}
          aria-labelledby={`${tabListId}-general-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <p className="text-xs text-ink-500">
            Demo recruiting-team details for this sample workspace — unrelated to AETEX Tech Solution's own information.
          </p>
          <FormField id="settings-team-name" label="Team name">
            <input id="settings-team-name" value={teamName} onChange={(event) => setTeamName(event.target.value)} className={demoControlStyles} />
          </FormField>
          <FormField id="settings-recruiting-email" label="Recruiting contact email">
            <input
              id="settings-recruiting-email"
              type="email"
              value={recruitingEmail}
              onChange={(event) => setRecruitingEmail(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <FormField id="settings-timezone" label="Timezone">
            <select id="settings-timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} className={demoControlStyles}>
              <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="UTC">UTC</option>
            </select>
          </FormField>
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedNotice ? (
              <span role="status" className="text-xs font-medium text-emerald-600">
                Saved (demo only)
              </span>
            ) : null}
            <Button type="button" size="md" onClick={handleSaveGeneral}>
              Save changes
            </Button>
          </div>
        </div>
      ) : null}

      {activeTab === 'workflow' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-workflow-panel`}
          aria-labelledby={`${tabListId}-workflow-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <FormField id="settings-default-pipeline" label="Default pipeline template">
            <select
              id="settings-default-pipeline"
              value={defaultPipeline}
              onChange={(event) => setDefaultPipeline(event.target.value)}
              className={demoControlStyles}
            >
              <option value="Standard (7 stages)">Standard (7 stages)</option>
              <option value="Fast-track (4 stages)">Fast-track (4 stages)</option>
              <option value="Executive (extended)">Executive (extended)</option>
            </select>
          </FormField>
          <FormField id="settings-screening-window" label="Screening window (business days)">
            <input
              id="settings-screening-window"
              type="number"
              min={1}
              step={1}
              value={screeningWindow}
              onChange={(event) => setScreeningWindow(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <ToggleRow
            label="Auto-archive closed vacancies"
            description="Move a vacancy out of the active list once it's marked Closed."
            checked={autoArchive}
            onChange={setAutoArchive}
          />
          <ToggleRow
            label="Require evaluation before hire"
            description="Block a hiring decision until at least one evaluation has been recorded."
            checked={requireEvaluation}
            onChange={setRequireEvaluation}
          />
        </div>
      ) : null}

      {activeTab === 'notifications' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-notifications-panel`}
          aria-labelledby={`${tabListId}-notifications-tab`}
          className="space-y-3"
        >
          <ToggleRow
            label="New applicant alerts"
            description="Notify the recruiting team when a new applicant is added."
            checked={newApplicantAlerts}
            onChange={setNewApplicantAlerts}
          />
          <ToggleRow
            label="Interview reminders"
            description="Send a reminder ahead of each scheduled interview."
            checked={interviewReminders}
            onChange={setInterviewReminders}
          />
          <ToggleRow
            label="Hiring decision alerts"
            description="Notify the recruiting team when a candidate is hired or rejected."
            checked={hiringDecisionAlerts}
            onChange={setHiringDecisionAlerts}
          />
        </div>
      ) : null}

      {activeTab === 'criteria' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-criteria-panel`}
          aria-labelledby={`${tabListId}-criteria-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <p className="text-xs text-ink-500">
            Controls how evaluations (communication, technical skills, problem solving, culture fit) feed into hiring recommendations.
          </p>
          <FormField id="settings-min-score" label="Minimum average score to recommend hire (1–5)">
            <select
              id="settings-min-score"
              value={minRecommendationScore}
              onChange={(event) => setMinRecommendationScore(event.target.value)}
              className={demoControlStyles}
            >
              {[2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </FormField>
          <ToggleRow
            label="Require all four dimensions"
            description="Each evaluation must score communication, technical skills, problem solving and culture fit."
            checked={requireAllDimensions}
            onChange={setRequireAllDimensions}
          />
        </div>
      ) : null}
    </div>
  )
}
