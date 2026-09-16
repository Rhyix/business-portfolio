import { TrendingDown, TrendingUp } from 'lucide-react'
import { IconFrame } from '../ui/IconFrame'
import type { IconComponent } from '../../types/content'
import { cn } from '../../lib/cn'

interface StatCardProps {
  label: string
  value: string
  icon: IconComponent
  delta?: { value: string; direction: 'up' | 'down' }
  className?: string
}

/** Summary metric tile used on the dashboard and reports pages. */
export function StatCard({ label, value, icon, delta, className }: StatCardProps) {
  return (
    <div
      className={cn('rounded-2xl border border-ink-200/80 bg-white p-5 shadow-soft', className)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{label}</p>
        <IconFrame icon={icon} size="sm" />
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">{value}</p>
      {delta ? (
        <p
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-xs font-medium',
            delta.direction === 'up' ? 'text-emerald-600' : 'text-red-600',
          )}
        >
          {delta.direction === 'up' ? (
            <TrendingUp className="size-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="size-3.5" aria-hidden="true" />
          )}
          {delta.value}
        </p>
      ) : null}
    </div>
  )
}
