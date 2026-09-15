import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionProps {
  id: string
  children: ReactNode
  /** Id of the section heading, exposed through aria-labelledby. */
  labelledBy?: string
  /**
   * Visual tone. "dark" sets the near-black band plus the lighter focus ring
   * required on that background; "light" adds nothing and inherits the page.
   */
  tone?: 'light' | 'dark'
  className?: string
}

const toneStyles: Record<'light' | 'dark', string> = {
  light: '',
  dark: 'bg-ink-950 text-ink-300',
}

/** Semantic page section with consistent vertical rhythm and anchor offset. */
export function Section({ id, children, labelledBy, tone = 'light', className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === 'dark' ? 'dark' : undefined}
      className={cn(
        'relative scroll-mt-24 py-20 sm:py-24 lg:py-32',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </section>
  )
}