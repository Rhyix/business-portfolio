import type { ReactNode } from 'react'
import type { IconComponent } from '../../types/content'
import { cn } from '../../lib/cn'

interface BadgeProps {
  children: ReactNode
  icon?: IconComponent
  className?: string
}

/** Small pill used for eyebrows, categories and status hints. */
export function Badge({ children, icon: Icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-ink-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-ink-600 shadow-soft backdrop-blur-sm',
        className,
      )}
    >
      {Icon ? (
        <Icon className="size-3.5 text-accent-600" strokeWidth={2} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  )
}