import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Centred content wrapper that owns the horizontal rhythm of every section.
 * `dial-gutter` holds the content clear of the permanently-open System Dial
 * from 1280px up; section backgrounds are unaffected because Section owns
 * those, so the dark chapters still bleed to the viewport edge.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('dial-gutter mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)}>
      {children}
    </div>
  )
}