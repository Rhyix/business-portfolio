import type { ReactNode } from 'react'
import { ChapterReveal } from './ChapterReveal'
import { cn } from '../../lib/cn'

interface SectionHeadingProps {
  /** Small label rendered above the title, as a node + rule + mono-label rail. */
  eyebrow?: string
  /** Position in the System Dial's sequence, e.g. "02" — see sectionIndexLabel. */
  index?: string
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

/**
 * Shared eyebrow + title + description block used by every content section.
 * The three parts arrive as the opening rungs of their section's chapter
 * ladder (see <ChapterReveal />), so a section reads as coming online rather
 * than simply being present. Vertical margins live on the wrappers, not the
 * inner elements, so the rhythm survives the extra block boxes.
 */
export function SectionHeading({
  eyebrow,
  index,
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
        <ChapterReveal step={0} className="mb-5">
          <p
            className={cn(
              'flex items-center gap-2.5',
              align === 'center' && 'justify-center',
              isDark ? 'text-accent-300' : 'text-accent-600',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('size-1.5 shrink-0 rounded-full', isDark ? 'bg-accent-400' : 'bg-accent-500')}
            />
            <span aria-hidden="true" className={cn('h-px w-10 shrink-0', isDark ? 'bg-ink-800' : 'bg-ink-200')} />
            {index ? (
              <span aria-hidden="true" className={cn('label-mono', isDark ? 'text-ink-500' : 'text-ink-400')}>
                {index}
              </span>
            ) : null}
            <span className="label-mono font-medium">{eyebrow}</span>
          </p>
        </ChapterReveal>
      ) : null}
      <ChapterReveal step={1}>
        <h2
          id={id}
          className={cn(size === 'headline' ? 'text-headline' : 'text-title', 'font-semibold', isDark && 'text-white')}
        >
          {title}
        </h2>
      </ChapterReveal>
      {description ? (
        <ChapterReveal step={2} className="mt-5">
          <p className={cn('text-lead', isDark ? 'text-ink-300' : 'text-ink-500')}>{description}</p>
        </ChapterReveal>
      ) : null}
    </div>
  )
}