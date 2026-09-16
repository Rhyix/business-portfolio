import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ChartCardProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

/** Card shell for a chart or other data visualisation, with a title row. */
export function ChartCard({ title, subtitle, action, children, className }: ChartCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ink-200/80 bg-white p-5 shadow-soft sm:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}
