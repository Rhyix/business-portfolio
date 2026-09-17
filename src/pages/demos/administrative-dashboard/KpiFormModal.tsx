import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Modal } from '../../../components/demo/Modal'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/cn'
import { deriveKpiStatus } from '../../../data/demos/admin-dashboard/types'
import type { Kpi, KpiCategory, KpiInput, KpiStatus, KpiUnit } from '../../../data/demos/admin-dashboard/types'

const categoryOptions: KpiCategory[] = ['Financial', 'Operational', 'Workforce', 'Customer', 'Compliance']
const statusOptions: KpiStatus[] = ['On Track', 'Attention', 'Below Target']

type FieldErrors = Partial<Record<'metric' | 'currentValue' | 'target', string>>

interface KpiFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: KpiInput) => void
  editingKpi: Kpi | null
}

/** Add/edit dialog for a single KPI. No backend — state lives in the shared admin-dashboard store. */
export function KpiFormModal({ open, onClose, onSubmit, editingKpi }: KpiFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingKpi ? 'Edit KPI' : 'Add KPI'}
      description={editingKpi ? `Update details for ${editingKpi.metric}.` : 'Track a new metric against target.'}
    >
      {open ? <KpiForm onClose={onClose} onSubmit={onSubmit} editingKpi={editingKpi} /> : null}
    </Modal>
  )
}

function KpiForm({ onClose, onSubmit, editingKpi }: { onClose: () => void; onSubmit: (values: KpiInput) => void; editingKpi: Kpi | null }) {
  const [metric, setMetric] = useState(editingKpi?.metric ?? '')
  const [category, setCategory] = useState<KpiCategory>(editingKpi?.category ?? categoryOptions[0])
  const [currentValue, setCurrentValue] = useState(editingKpi ? String(editingKpi.currentValue) : '')
  const [target, setTarget] = useState(editingKpi ? String(editingKpi.target) : '')
  const [unit, setUnit] = useState<KpiUnit>(editingKpi?.unit ?? 'number')
  const [changePct, setChangePct] = useState(editingKpi ? String(editingKpi.changePct) : '0')
  const [status, setStatus] = useState<KpiStatus>(editingKpi?.status ?? 'On Track')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleTextChange = (setter: (value: string) => void, field: keyof FieldErrors) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value)
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const suggestStatus = () => {
    if (currentValue.trim() && target.trim()) {
      setStatus(deriveKpiStatus(Number(currentValue), Number(target)))
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!metric.trim()) nextErrors.metric = 'Enter a metric name.'
    if (!currentValue.trim() || Number(currentValue) < 0) nextErrors.currentValue = 'Enter a valid current value.'
    if (!target.trim() || Number(target) < 0) nextErrors.target = 'Enter a valid target.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      metric,
      category,
      currentValue: Number(currentValue),
      target: Number(target),
      unit,
      changePct: Number(changePct) || 0,
      status,
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      <FormField id="kpi-metric" label="Metric" error={errors.metric}>
        <input
          id="kpi-metric"
          type="text"
          value={metric}
          onChange={handleTextChange(setMetric, 'metric')}
          aria-invalid={errors.metric ? true : undefined}
          className={cn(demoControlStyles, errors.metric && 'border-red-300')}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="kpi-category" label="Category">
          <select id="kpi-category" value={category} onChange={(event) => setCategory(event.target.value as KpiCategory)} className={demoControlStyles}>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="kpi-unit" label="Unit">
          <select id="kpi-unit" value={unit} onChange={(event) => setUnit(event.target.value as KpiUnit)} className={demoControlStyles}>
            <option value="number">Number</option>
            <option value="currency">Currency</option>
            <option value="percent">Percent</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="kpi-current" label="Current value" error={errors.currentValue}>
          <input
            id="kpi-current"
            type="number"
            step="0.01"
            value={currentValue}
            onChange={(event) => {
              handleTextChange(setCurrentValue, 'currentValue')(event)
            }}
            onBlur={suggestStatus}
            aria-invalid={errors.currentValue ? true : undefined}
            className={cn(demoControlStyles, errors.currentValue && 'border-red-300')}
          />
        </FormField>
        <FormField id="kpi-target" label="Target" error={errors.target}>
          <input
            id="kpi-target"
            type="number"
            step="0.01"
            value={target}
            onChange={(event) => {
              handleTextChange(setTarget, 'target')(event)
            }}
            onBlur={suggestStatus}
            aria-invalid={errors.target ? true : undefined}
            className={cn(demoControlStyles, errors.target && 'border-red-300')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="kpi-change" label="Change (%)">
          <input id="kpi-change" type="number" step="0.1" value={changePct} onChange={(event) => setChangePct(event.target.value)} className={demoControlStyles} />
        </FormField>
        <FormField id="kpi-status" label="Status">
          <select id="kpi-status" value={status} onChange={(event) => setStatus(event.target.value as KpiStatus)} className={demoControlStyles}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="md">
          {editingKpi ? 'Save changes' : 'Add KPI'}
        </Button>
      </div>
    </form>
  )
}
