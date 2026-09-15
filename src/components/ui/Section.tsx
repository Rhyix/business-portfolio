import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionProps {
  id: string
  children: ReactNode
  /** Id of the section heading, exposed through aria-labelledby. */
  labelledBy?: string
  className?: string
}

/** Semantic page section with consistent vertical rhythm and anchor offset. */
export function Section({ id, children, labelledBy, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative scroll-mt-24 py-20 sm:py-24 lg:py-32', className)}
    >
      {children}
    </section>
  )
}