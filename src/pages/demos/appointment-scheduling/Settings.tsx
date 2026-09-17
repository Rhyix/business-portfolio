import { useId, useState } from 'react'
import { Bell, Building2, CalendarClock, SlidersHorizontal } from 'lucide-react'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'

type SettingsTab = 'general' | 'rules' | 'notifications' | 'calendar'

const tabs: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'rules', label: 'Booking Rules', icon: SlidersHorizontal },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'calendar', label: 'Calendar Preferences', icon: CalendarClock },
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

/** Settings page: demo-only general, booking-rule, notification and calendar-preference panels, backed by local state. */
export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const tabListId = useId()

  const [teamName, setTeamName] = useState('AETEX Scheduling Team')
  const [contactEmail, setContactEmail] = useState('scheduling@demo-aetex.example')
  const [timezone, setTimezone] = useState('Asia/Manila')
  const [savedNotice, setSavedNotice] = useState(false)

  const [defaultDuration, setDefaultDuration] = useState('30')
  const [slotInterval, setSlotInterval] = useState('30')
  const [allowSameDayBooking, setAllowSameDayBooking] = useState(true)
  const [requireConfirmation, setRequireConfirmation] = useState(true)
  const [cancellationWindow, setCancellationWindow] = useState('24')

  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [bookingConfirmations, setBookingConfirmations] = useState(true)
  const [staffScheduleAlerts, setStaffScheduleAlerts] = useState(false)

  const [defaultView, setDefaultView] = useState<'day' | 'week' | 'month'>('day')
  const [showWeekends, setShowWeekends] = useState(true)

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
            Demo scheduling-team details for this sample workspace — unrelated to AETEX Tech Solution's own information.
          </p>
          <FormField id="settings-team-name" label="Team name">
            <input id="settings-team-name" value={teamName} onChange={(event) => setTeamName(event.target.value)} className={demoControlStyles} />
          </FormField>
          <FormField id="settings-contact-email" label="Scheduling contact email">
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

      {activeTab === 'rules' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-rules-panel`}
          aria-labelledby={`${tabListId}-rules-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField id="settings-default-duration" label="Default appointment duration (minutes)">
              <input
                id="settings-default-duration"
                type="number"
                min={5}
                step={5}
                value={defaultDuration}
                onChange={(event) => setDefaultDuration(event.target.value)}
                className={demoControlStyles}
              />
            </FormField>
            <FormField id="settings-slot-interval" label="Booking slot interval (minutes)">
              <select id="settings-slot-interval" value={slotInterval} onChange={(event) => setSlotInterval(event.target.value)} className={demoControlStyles}>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="60">60</option>
              </select>
            </FormField>
          </div>
          <FormField id="settings-cancellation-window" label="Minimum cancellation notice (hours)">
            <input
              id="settings-cancellation-window"
              type="number"
              min={0}
              value={cancellationWindow}
              onChange={(event) => setCancellationWindow(event.target.value)}
              className={demoControlStyles}
            />
          </FormField>
          <ToggleRow
            label="Allow same-day booking"
            description="Let customers book an appointment for the current day, if a slot is still available."
            checked={allowSameDayBooking}
            onChange={setAllowSameDayBooking}
          />
          <ToggleRow
            label="Require staff confirmation"
            description="New bookings start as Pending until a staff member confirms them."
            checked={requireConfirmation}
            onChange={setRequireConfirmation}
          />
        </div>
      ) : null}

      {activeTab === 'notifications' ? (
        <div role="tabpanel" id={`${tabListId}-notifications-panel`} aria-labelledby={`${tabListId}-notifications-tab`} className="space-y-3">
          <ToggleRow
            label="Appointment reminders"
            description="Send a reminder to customers ahead of their scheduled appointment."
            checked={appointmentReminders}
            onChange={setAppointmentReminders}
          />
          <ToggleRow
            label="Booking confirmations"
            description="Notify customers when their appointment is confirmed."
            checked={bookingConfirmations}
            onChange={setBookingConfirmations}
          />
          <ToggleRow
            label="Staff schedule alerts"
            description="Notify staff when their weekly availability is changed."
            checked={staffScheduleAlerts}
            onChange={setStaffScheduleAlerts}
          />
        </div>
      ) : null}

      {activeTab === 'calendar' ? (
        <div
          role="tabpanel"
          id={`${tabListId}-calendar-panel`}
          aria-labelledby={`${tabListId}-calendar-tab`}
          className="space-y-4 rounded-2xl border border-ink-200/80 bg-white p-5 sm:p-6"
        >
          <FormField id="settings-default-view" label="Default calendar view">
            <select
              id="settings-default-view"
              value={defaultView}
              onChange={(event) => setDefaultView(event.target.value as 'day' | 'week' | 'month')}
              className={demoControlStyles}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </FormField>
          <ToggleRow
            label="Show weekends"
            description="Include Saturday and Sunday in the Week and Month calendar views."
            checked={showWeekends}
            onChange={setShowWeekends}
          />
        </div>
      ) : null}
    </div>
  )
}
