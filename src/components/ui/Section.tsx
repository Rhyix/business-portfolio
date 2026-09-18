import { useRef } from 'react'
import type { ReactNode } from 'react'
import { ChapterContext, useChapterActivation } from '../../lib/chapter'
import { cn } from '../../lib/cn'

interface SectionProps {
  id: string
  children: ReactNode
  /** Id of the section heading, exposed through aria-labelledby. */
  labelledBy?: string
  /**
   * Visual tone. "dark" sets the near-black ground plus the lighter focus
   * ring required on that background; "muted" is a quiet off-white band for
   * short beats between chapters; "light" adds nothing and inherits the page.
   */
  tone?: 'light' | 'muted' | 'dark'
  /** "feature" gives the section extra vertical room — reserved for the one flagship section. */
  size?: 'default' | 'feature'
  /** Set false to drop this section's bottom padding, so it merges with a same-tone section directly below it instead of reading as two stacked blocks. */
  seam?: boolean
  className?: string
}

const toneStyles: Record<'light' | 'muted' | 'dark', string> = {
  light: '',
  muted: 'bg-ink-50 border-y border-ink-200/70',
  dark: 'bg-ink-975 text-ink-300',
}

/**
 * Top/bottom padding kept as separate declarations (rather than one `py-*`
 * shorthand) so `seam={false}` can swap in `pb-0` cleanly — a `py-*` utility
 * and a later `pb-0` both set padding-bottom, but Tailwind places responsive
 * variants in a later CSS layer than base utilities regardless of class
 * order, so a bare `pb-0` can never win against `lg:py-32`. Choosing one
 * complete padding-bottom utility string or the other in JS (never both)
 * sidesteps that layer-ordering pitfall entirely.
 */
const sizeStyles: Record<'default' | 'feature', { pt: string; pb: string }> = {
  default: { pt: 'pt-20 sm:pt-24 lg:pt-32', pb: 'pb-20 sm:pb-24 lg:pb-32' },
  feature: { pt: 'pt-20 sm:pt-28 lg:pt-40', pb: 'pb-20 sm:pb-28 lg:pb-40' },
}

/** Semantic page section with consistent vertical rhythm and anchor offset. */
export function Section({
  id,
  children,
  labelledBy,
  tone = 'light',
  size = 'default',
  seam = true,
  className,
}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const activated = useChapterActivation(sectionRef)

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === 'dark' ? 'dark' : undefined}
      className={cn(
        'relative scroll-mt-24',
        sizeStyles[size].pt,
        seam ? sizeStyles[size].pb : 'pb-0',
        toneStyles[tone],
        className,
      )}
    >
      <ChapterContext.Provider value={activated}>{children}</ChapterContext.Provider>
    </section>
  )
}