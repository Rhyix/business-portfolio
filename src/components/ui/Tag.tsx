import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface TagProps {
  children: ReactNode
  className?: string
}

/** Small pill used for technologies and other short metadata. */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-ink-200/80 bg-ink-50 px-2.5 py-1 text-[0.7rem] font-medium text-ink-600',
        className,
      )}
    >
      {children}
    </span>
  )
}