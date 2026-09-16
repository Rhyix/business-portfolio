import { useId, useState } from 'react'
import { Bell, Building2, SlidersHorizontal } from 'lucide-react'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'

type SettingsTab = 'profile' | 'preferences' | 'notifications'

const tabs: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: 'profile', label: 'Business profile', icon: Building2 },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { key: 'notifications', label: 'Notifications', icon: Bell },
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

/** Settings page: demo-only business profile, preference and notification panels, backed by local state. */
export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const tabListId = useId()

  const [businessName, setBusinessName] = useState('Demo Retail Co.')
  const [businessEmail, setBusinessEmail] = useState('operations@demoretail.example')
  const [businessPhone, setBusinessPhone] = useState('+63 917 555 0100')
  const [savedNotice, setSavedNotice] = useState(false)

  const handleSaveProfile = () => {
    setSavedNotice(true)
    window.setTimeout(() => setSavedNotice(false), 2000)
  }

  const [currency, setCurrency] = useState('PHP')
  const [timezone, setTimezone] = useState('Asia/Manila')
  const [dateFormat, setDateFormat] = useState('MMM D, YYYY')

  const [emailAlerts, setEmailAlerts] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)

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

      {activeTab === 'profile' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-profile-panel`}
          aria-labelledby={`${tabListId}-profile-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <p className="text-xs text-ink-500">
            Demo business details for this sample workspace — unrelated to AETEX Tech Solution's own
            information.
          </p>
          <FormField id="settings-business-name" label="Business name">
            <input
              id="settings-business-name"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <FormField id="settings-business-email" label="Contact email">
            <input
              id="settings-business-email"
              type="email"
              value={businessEmail}
              onChange={(event) => setBusinessEmail(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <FormField id="settings-business-phone" label="Contact phone">
            <input
              id="settings-business-phone"
              type="tel"
              value={businessPhone}
              onChange={(event) => setBusinessPhone(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <div className="flex items-center justify-end gap-3 pt-2">
            {savedNotice ? (
              <span role="status" className="text-xs font-medium text-emerald-600">
                Saved (demo only)
              </span>
            ) : null}
            <Button type="button" size="md" onClick={handleSaveProfile}>
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
          <FormField id="settings-currency" label="Currency">
            <select
              id="settings-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className={demoControlStyles}
            >
              <option value="PHP">Philippine Peso (₱)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </FormField>
          <FormField id="settings-timezone" label="Timezone">
            <select
              id="settings-timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className={demoControlStyles}
            >
              <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
              <option value="UTC">UTC</option>
            </select>
          </FormField>
          <FormField id="settings-date-format" label="Date format">
            <select
              id="settings-date-format"
              value={dateFormat}
              onChange={(event) => setDateFormat(event.target.value)}
              className={demoControlStyles}
            >
              <option value="MMM D, YYYY">MMM D, YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
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
            label="Email alerts"
            description="Receive a daily email summary of orders and invoices."
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />
          <ToggleRow
            label="Low-stock alerts"
            description="Notify the team when a product falls below its reorder level."
            checked={lowStockAlerts}
            onChange={setLowStockAlerts}
          />
          <ToggleRow
            label="Weekly summary"
            description="Send a weekly performance digest every Monday morning."
            checked={weeklySummary}
            onChange={setWeeklySummary}
          />
        </div>
      ) : null}
    </div>
  )
}
