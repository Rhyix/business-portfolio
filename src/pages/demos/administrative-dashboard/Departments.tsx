import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { StatCard } from '../../../components/demo/StatCard'
import { StatusBadge } from '../../../components/demo/StatusBadge'
import { Modal } from '../../../components/demo/Modal'
import { DemoNotice } from '../../../components/demo/DemoNotice'
import { FormField } from '../../../sections/contact/FormField'
import { demoControlStyles } from '../../../components/demo/formControlStyles'
import { Button } from '../../../components/ui/Button'
import { Users, ClipboardList, Gauge } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { formatNumber } from '../../../lib/format'
import { useAdminDashboardData } from '../../../data/demos/admin-dashboard/context'
import { averagePerformance, totalHeadcount, totalOpenRequests } from '../../../data/demos/admin-dashboard/types'
import type { Department, DepartmentInput, DepartmentStatus } from '../../../data/demos/admin-dashboard/types'

const statusOptions: DepartmentStatus[] = ['Active', 'Inactive']

interface DepartmentEditFormProps {
  department: Department
  onClose: () => void
  onSubmit: (values: DepartmentInput) => void
}

function DepartmentEditForm({ department, onClose, onSubmit }: DepartmentEditFormProps) {
  const [headcount, setHeadcount] = useState(String(department.headcount))
  const [openRequests, setOpenRequests] = useState(String(department.openRequests))
  const [performance, setPerformance] = useState(String(department.performance))
  const [status, setStatus] = useState<DepartmentStatus>(department.status)

  const handleTextChange = (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => setter(event.target.value)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      headcount: Math.max(0, Number(headcount) || 0),
      openRequests: Math.max(0, Number(openRequests) || 0),
      performance: Math.min(100, Math.max(0, Number(performance) || 0)),
      status,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-ink-600">{department.description}</p>
      <div className="grid grid-cols-2 gap-4">
        <FormField id="dept-headcount" label="Headcount">
          <input id="dept-headcount" type="number" min={0} value={headcount} onChange={handleTextChange(setHeadcount)} className={demoControlStyles} />
        </FormField>
        <FormField id="dept-open-requests" label="Open requests">
          <input id="dept-open-requests" type="number" min={0} value={openRequests} onChange={handleTextChange(setOpenRequests)} className={demoControlStyles} />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField id="dept-performance" label="Performance (%)">
          <input id="dept-performance" type="number" min={0} max={100} value={performance} onChange={handleTextChange(setPerformance)} className={demoControlStyles} />
        </FormField>
        <FormField id="dept-status" label="Status">
          <select id="dept-status" value={status} onChange={(event) => setStatus(event.target.value as DepartmentStatus)} className={demoControlStyles}>
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
          Save changes
        </Button>
      </div>
    </form>
  )
}

/** Departments: a fixed 6-department organisation. Card grid with summary metrics and an editable detail view. */
export function Departments() {
  const { departments, updateDepartment } = useAdminDashboardData()
  const [detailDeptId, setDetailDeptId] = useState<string | null>(null)

  const detailDepartment = detailDeptId ? (departments.find((department) => department.id === detailDeptId) ?? null) : null

  return (
    <div className="space-y-6">
      <DemoNotice variant="inline" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Headcount" value={formatNumber(totalHeadcount(departments))} icon={Users} />
        <StatCard label="Open Requests" value={formatNumber(totalOpenRequests(departments))} icon={ClipboardList} />
        <StatCard label="Avg. Performance" value={`${averagePerformance(departments)}%`} icon={Gauge} />
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {departments.map((department) => (
          <li key={department.id} className="rounded-2xl border border-ink-200/80 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-ink-900">{department.name}</p>
              <StatusBadge status={department.status} />
            </div>
            <p className="mt-1 text-xs text-ink-500">{department.description}</p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-ink-500">Headcount</dt>
                <dd className="mt-0.5 text-ink-900">{formatNumber(department.headcount)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-500">Open Requests</dt>
                <dd className="mt-0.5 text-ink-900">{formatNumber(department.openRequests)}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-ink-700">Performance</span>
                <span className="text-ink-500">{department.performance}%</span>
              </div>
              <div className="h-2 rounded-full bg-ink-100">
                <div
                  className={cn('h-2 rounded-full', department.performance >= 80 ? 'bg-emerald-500' : department.performance >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${Math.max(department.performance, 2)}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={() => setDetailDeptId(department.id)}>
                View details
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal open={detailDepartment !== null} onClose={() => setDetailDeptId(null)} title={detailDepartment?.name ?? 'Department'} description="Department detail and performance">
        {detailDepartment ? (
          <DepartmentEditForm
            department={detailDepartment}
            onClose={() => setDetailDeptId(null)}
            onSubmit={(values) => updateDepartment(detailDepartment.id, values)}
          />
        ) : null}
      </Modal>
    </div>
  )
}
