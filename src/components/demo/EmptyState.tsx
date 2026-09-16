import type { ReactNode } from 'react'
import { IconFrame } from '../ui/IconFrame'
import type { IconComponent } from '../../types/content'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon?: IconComponent
  title: string
  message?: string
  action?: ReactNode
  className?: string
}

/** Placeholder shown when a filtered table or list has no matching records. */
export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? <IconFrame icon={icon} size="md" /> : null}
      <div>
        <p className="text-sm font-medium text-ink-800">{title}</p>
        {message ? <p className="mt-1 text-sm text-ink-500">{message}</p> : null}
      </div>
      {action}
    </div>
  )
}
