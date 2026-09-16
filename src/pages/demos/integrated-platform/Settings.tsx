import { useId, useState } from 'react'
import { Bell, Building2, Clock, SlidersHorizontal } from 'lucide-react'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'

type SettingsTab = 'organization' | 'preferences' | 'notifications' | 'attendance'

const tabs: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: 'organization', label: 'Organization', icon: Building2 },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'attendance', label: 'Attendance Rules', icon: Clock },
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
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
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

/**
 * Platform-wide settings: organization profile, preferences, notifications
 * and attendance rules. Demo-only UI backed by local state — no backend
 * persistence, consistent with every other demo settings page.
 */
export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('organization')
  const tabListId = useId()

  const [orgName, setOrgName] = useState('Demo Organisation Inc.')
  const [contactEmail, setContactEmail] = useState('ops@demo-organisation.example')
  const [contactPhone, setContactPhone] = useState('+63 917 555 0200')
  const [savedNotice, setSavedNotice] = useState(false)

  const [currency, setCurrency] = useState('PHP')
  const [timezone, setTimezone] = useState('Asia/Manila')
  const [weekStart, setWeekStart] = useState('Monday')

  const [orderAlerts, setOrderAlerts] = useState(true)
  const [leaveAlerts, setLeaveAlerts] = useState(true)
  const [inventoryAlerts, setInventoryAlerts] = useState(true)
  const [recruitmentAlerts, setRecruitmentAlerts] = useState(false)

  const [workStart, setWorkStart] = useState('09:00')
  const [workEnd, setWorkEnd] = useState('18:00')
  const [gracePeriod, setGracePeriod] = useState('10')

  const handleSaveOrganization = () => {
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

      {activeTab === 'organization' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-organization-panel`}
          aria-labelledby={`${tabListId}-organization-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <p className="text-xs text-ink-500">
            Demo organisation details for this sample workspace — unrelated to AETEX Tech Solution's own
            information.
          </p>
          <FormField id="platform-org-name" label="Organisation name">
            <input
              id="platform-org-name"
              value={orgName}
              onChange={(event) => setOrgName(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <FormField id="platform-contact-email" label="Contact email">
            <input
              id="platform-contact-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <FormField id="platform-contact-phone" label="Contact phone">
            <input
              id="platform-contact-phone"
              type="tel"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedNotice ? (
              <span role="status" className="text-xs font-medium text-emerald-600">
                Saved (demo only)
              </span>
            ) : null}
            <Button type="button" size="md" onClick={handleSaveOrganization}>
              Save changes
            </Button>
          </div>
        </div>
      ) : null}

      {activeTab === 'preferences' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-preferences-panel`}
          aria-labelledby={`${tabListId}-preferences-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <FormField id="platform-currency" label="Currency">
            <select
              id="platform-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className={demoControlStyles}
            >
              <option value="PHP">Philippine Peso (₱)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </FormField>
          <FormField id="platform-timezone" label="Timezone">
            <select
              id="platform-timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className={demoControlStyles}
            >
              <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="UTC">UTC</option>
            </select>
          </FormField>
          <FormField id="platform-week-start" label="Work week starts on">
            <select
              id="platform-week-start"
              value={weekStart}
              onChange={(event) => setWeekStart(event.target.value)}
              className={demoControlStyles}
            >
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
            </select>
          </FormField>
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
            label="Order alerts"
            description="Notify the team when a new order is created."
            checked={orderAlerts}
            onChange={setOrderAlerts}
          />
          <ToggleRow
            label="Leave request alerts"
            description="Notify HR staff when a leave request needs a decision."
            checked={leaveAlerts}
            onChange={setLeaveAlerts}
          />
          <ToggleRow
            label="Inventory alerts"
            description="Notify the team when a product falls below its reorder level."
            checked={inventoryAlerts}
            onChange={setInventoryAlerts}
          />
          <ToggleRow
            label="Recruitment updates"
            description="Notify HR staff about new applicants and interview schedules."
            checked={recruitmentAlerts}
            onChange={setRecruitmentAlerts}
          />
        </div>
      ) : null}

      {activeTab === 'attendance' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-attendance-panel`}
          aria-labelledby={`${tabListId}-attendance-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField id="platform-work-start" label="Work day starts">
              <input
                id="platform-work-start"
                type="time"
                value={workStart}
                onChange={(event) => setWorkStart(event.target.value)}
                className={demoControlStyles}
              />
            </FormField>
            <FormField id="platform-work-end" label="Work day ends">
              <input
                id="platform-work-end"
                type="time"
                value={workEnd}
                onChange={(event) => setWorkEnd(event.target.value)}
                className={demoControlStyles}
              />
            </FormField>
          </div>
          <FormField id="platform-grace-period" label="Late grace period (minutes)">
            <input
              id="platform-grace-period"
              type="number"
              min={0}
              step={1}
              value={gracePeriod}
              onChange={(event) => setGracePeriod(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
        </div>
      ) : null}
    </div>
  )
}
