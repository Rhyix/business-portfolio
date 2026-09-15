import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionHeadingProps {
  /** Small label rendered above the title. */
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  /** Id applied to the <h2> so the parent section can reference it. */
  id?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

/** Shared eyebrow + title + description block used by every content section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = 'left',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const isDark = tone === 'dark'

  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <p
          className={cn(
            'mb-4 text-xs font-semibold tracking-[0.16em] uppercase',
            isDark ? 'text-accent-300' : 'text-accent-600',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className={cn('text-title font-semibold', isDark && 'text-white')}>
        {title}
      </h2>
      {description ? (
        <p className={cn('mt-5 text-lead', isDark ? 'text-ink-300' : 'text-ink-500')}>
          {description}
        </p>
      ) : null}
    </div>
  )
}