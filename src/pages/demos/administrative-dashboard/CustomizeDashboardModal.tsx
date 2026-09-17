import { useState } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { DASHBOARD_WIDGETS, DATE_RANGE_OPTIONS } from '../../../data/demos/admin-dashboard/types'
import type { DashboardDateRange, DashboardWidgetId } from '../../../data/demos/admin-dashboard/types'

interface CustomizeDashboardModalProps {
  open: boolean
  onClose: () => void
  initialVisibleWidgetIds: DashboardWidgetId[]
  initialDateRange: DashboardDateRange
  onDone: (visibleWidgetIds: DashboardWidgetId[], dateRange: DashboardDateRange) => void
}

/**
 * "Customize Dashboard" panel: show/hide widgets and change the date range.
 * Explicitly no drag-and-drop — visibility toggles only, fixed widget order.
 * Uses local draft state committed only on "Done", matching every other
 * demo's Settings-style "commit via an explicit action" idiom.
 */
export function CustomizeDashboardModal({ open, onClose, initialVisibleWidgetIds, initialDateRange, onDone }: CustomizeDashboardModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Customize Dashboard" description="Choose what appears on your dashboard.">
      {open ? (
        <CustomizePanel
          initialVisibleWidgetIds={initialVisibleWidgetIds}
          initialDateRange={initialDateRange}
          onClose={onClose}
          onDone={onDone}
        />
      ) : null}
    </Modal>
  )
}

function CustomizePanel({
  initialVisibleWidgetIds,
  initialDateRange,
  onClose,
  onDone,
}: Omit<CustomizeDashboardModalProps, 'open'>) {
  const [draftVisibleIds, setDraftVisibleIds] = useState<DashboardWidgetId[]>(initialVisibleWidgetIds)
  const [draftDateRange, setDraftDateRange] = useState<DashboardDateRange>(initialDateRange)

  const toggleWidget = (id: DashboardWidgetId) => {
    setDraftVisibleIds((current) => (current.includes(id) ? current.filter((widgetId) => widgetId !== id) : [...current, id]))
  }

  const handleResetLayout = () => {
    setDraftVisibleIds(DASHBOARD_WIDGETS.map((widget) => widget.id))
  }

  const handleDone = () => {
    onDone(draftVisibleIds, draftDateRange)
    onClose()
  }

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-medium text-ink-800">Visible widgets</legend>
        <div className="mt-2 space-y-2">
          {DASHBOARD_WIDGETS.map((widget) => (
            <label key={widget.id} className="flex items-start gap-3 rounded-xl border border-ink-200/80 bg-white p-3.5">
              <input
                type="checkbox"
                checked={draftVisibleIds.includes(widget.id)}
                onChange={() => toggleWidget(widget.id)}
                className="mt-0.5 size-4 shrink-0 rounded border-ink-300 text-accent-600 focus:ring-2 focus:ring-accent-100"
              />
              <span>
                <span className="block text-sm font-medium text-ink-900">{widget.title}</span>
                <span className="block text-xs text-ink-500">{widget.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FormField id="dashboard-date-range" label="Date range">
        <select
          id="dashboard-date-range"
          value={draftDateRange}
          onChange={(event) => setDraftDateRange(event.target.value as DashboardDateRange)}
          className={demoControlStyles}
        >
          {DATE_RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200/80 pt-4">
        <Button type="button" variant="secondary" size="md" onClick={handleResetLayout}>
          Reset Layout
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="md" onClick={handleDone}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
