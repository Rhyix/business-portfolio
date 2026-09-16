import { Sparkles } from 'lucide-react'
import { cn } from '../../lib/cn'

interface DemoNoticeProps {
  variant?: 'badge' | 'inline'
  className?: string
}

/**
 * Communicates that the surrounding application is a portfolio demo built on
 * fictional sample data, not a deployed client system.
 */
export function DemoNotice({ variant = 'badge', className }: DemoNoticeProps) {
  if (variant === 'inline') {
    return (
      <p className={cn('inline-flex items-center gap-1.5 text-xs text-ink-500', className)}>
        <Sparkles className="size-3.5 text-accent-600" aria-hidden="true" />
        Sample data shown for demonstration purposes only.
      </p>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-700',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-accent-600" aria-hidden="true" />
      Demo Mode
    </span>
  )
}
