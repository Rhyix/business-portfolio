import { useId, useState } from 'react'
import { Bell, Building2, LayoutDashboard, Monitor } from 'lucide-react'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import { DASHBOARD_WIDGETS, DATE_RANGE_OPTIONS } from '../../../data/demos/admin-dashboard/types'
import type { DashboardWidgetId } from '../../../data/demos/admin-dashboard/types'

type SettingsTab = 'general' | 'dashboard' | 'notifications' | 'display'

const tabs: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'dashboard', label: 'Dashboard Preferences', icon: LayoutDashboard },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'display', label: 'Display', icon: Monitor },
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

/** Settings: demo-only General/Notifications/Display panels backed by local state, plus a Dashboard Preferences tab that reads/writes the same shared state the Dashboard page itself uses. */
export function Settings() {
  const { visibleWidgetIds, setVisibleWidgets, dateRange, setDateRange } = useAdminDashboardData()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const tabListId = useId()

  const [workspaceName, setWorkspaceName] = useState('AETEX Administrative Workspace')
  const [contactEmail, setContactEmail] = useState('admin@demo-aetex.example')
  const [timezone, setTimezone] = useState('Asia/Manila')
  const [savedNotice, setSavedNotice] = useState(false)

  const [approvalAlerts, setApprovalAlerts] = useState(true)
  const [kpiAlerts, setKpiAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')

  const handleSaveGeneral = () => {
    setSavedNotice(true)
    window.setTimeout(() => setSavedNotice(false), 2000)
  }

  const toggleDefaultWidget = (id: DashboardWidgetId) => {
    setVisibleWidgets(visibleWidgetIds.includes(id) ? visibleWidgetIds.filter((widgetId) => widgetId !== id) : [...visibleWidgetIds, id])
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
            Demo workspace details for this sample environment — unrelated to AETEX Tech Solution's own information.
          </p>
          <FormField id="settings-workspace-name" label="Workspace name">
            <input id="settings-workspace-name" value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} className={demoControlStyles} />
          </FormField>
          <FormField id="settings-contact-email" label="Contact email">
            <input
              id="settings-contact-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
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

      {activeTab === 'dashboard' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-dashboard-panel`}
          aria-labelledby={`${tabListId}-dashboard-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <p className="text-xs text-ink-500">
            These controls read and write the same dashboard state as "Customize Dashboard" — changes here appear on the Dashboard page immediately.
          </p>
          <FormField id="settings-date-range" label="Default date range">
            <select id="settings-date-range" value={dateRange} onChange={(event) => setDateRange(event.target.value as typeof dateRange)} className={demoControlStyles}>
              {DATE_RANGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
          <div>
            <p className="mb-2 text-sm font-medium text-ink-800">Default visible widgets</p>
            <div className="space-y-2">
              {DASHBOARD_WIDGETS.map((widget) => (
                <label key={widget.id} className="flex items-center gap-2.5 rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm text-ink-700">
                  <input
                    type="checkbox"
                    checked={visibleWidgetIds.includes(widget.id)}
                    onChange={() => toggleDefaultWidget(widget.id)}
                    className="size-4 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-100"
                  />
                  {widget.title}
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === 'notifications' ? (
        <div role="tabpanel" id={`${tabListId}-notifications-panel`} aria-labelledby={`${tabListId}-notifications-tab`} className="space-y-3">
          <ToggleRow label="Approval alerts" description="Notify when a new request needs a decision." checked={approvalAlerts} onChange={setApprovalAlerts} />
          <ToggleRow label="KPI alerts" description="Notify when a KPI moves to Attention or Below Target." checked={kpiAlerts} onChange={setKpiAlerts} />
          <ToggleRow label="Weekly digest" description="A weekly summary of dashboard activity." checked={weeklyDigest} onChange={setWeeklyDigest} />
        </div>
      ) : null}

      {activeTab === 'display' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-display-panel`}
          aria-labelledby={`${tabListId}-display-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <FormField id="settings-density" label="Density">
            <select id="settings-density" value={density} onChange={(event) => setDensity(event.target.value as 'comfortable' | 'compact')} className={demoControlStyles}>
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </FormField>
          <p className="text-xs text-ink-500">Density is a demo-only preference and does not currently change table row height.</p>
        </div>
      ) : null}
    </div>
  )
}
