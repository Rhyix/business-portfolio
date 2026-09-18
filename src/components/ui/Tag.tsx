import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface TagProps {
  children: ReactNode
  tone?: 'light' | 'dark'
  className?: string
}

/** Small pill used for technologies and other short metadata. */
export function Tag({ children, tone = 'light', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-medium',
        tone === 'dark' ? 'border-ink-800 bg-ink-900 text-ink-300' : 'border-ink-200/80 bg-ink-50 text-ink-600',
        className,
      )}
    >
      {children}
    </span>
  )
}