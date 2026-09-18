import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionHeadingProps {
  /** Small label rendered above the title, as a node + rule + mono-label rail. */
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  /** Id applied to the <h2> so the parent section can reference it. */
  id?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  /** "headline" is the chapter tier — reserved for FeaturedPlatform and CallToAction. */
  size?: 'title' | 'headline'
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
  size = 'title',
  className,
}: SectionHeadingProps) {
  const isDark = tone === 'dark'

  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <p
          className={cn(
            'mb-5 flex items-center gap-2.5',
            align === 'center' && 'justify-center',
            isDark ? 'text-accent-300' : 'text-accent-600',
          )}
        >
          <span
            aria-hidden="true"
            className={cn('size-1.5 shrink-0 rounded-full', isDark ? 'bg-accent-400' : 'bg-accent-500')}
          />
          <span aria-hidden="true" className={cn('h-px w-10 shrink-0', isDark ? 'bg-ink-800' : 'bg-ink-200')} />
          <span className="label-mono font-medium">{eyebrow}</span>
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(size === 'headline' ? 'text-headline' : 'text-title', 'font-semibold', isDark && 'text-white')}
      >
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