import { company } from '../../data/company'
import { cn } from '../../lib/cn'

interface LogoProps {
  className?: string
  /** Picks the artwork: "dark" is the white-stroke variant for dark grounds. */
  tone?: 'light' | 'dark'
  href?: string
}

/** Intrinsic size of both brand files — set on the img so no layout shift occurs. */
const LOGO_WIDTH = 948
const LOGO_HEIGHT = 200

/**
 * The AETEX wordmark. Two official files carry the same artwork with the
 * non-blue strokes swapped — navy for light grounds, white for dark — and an
 * identical blue accent, so `tone` selects the file rather than restyling it.
 * The artwork itself is never filtered or recoloured.
 *
 * Both files are trimmed flush to the ink on all four sides, so the rendered
 * box *is* the visible mark and height translates 1:1 into presence. Clear
 * space therefore has to come from layout, which is what the header's gap and
 * the sizes below account for: the wordmark stays at or under the 44px
 * hamburger the header is already built around, so it never drives the bar
 * taller, yet it keeps more breathing room than that control does.
 */
export function Logo({ className, tone = 'light', href = '#home' }: LogoProps) {
  const src = tone === 'dark' ? '/brand/aetex-logo-2.png' : '/brand/aetex-logo-1.png'

  return (
    <a href={href} className={cn('inline-flex shrink-0 items-center rounded-md outline-offset-4', className)}>
      <img
        src={src}
        alt={company.name}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        decoding="async"
        className="h-9 w-auto sm:h-10 lg:h-11"
      />
    </a>
  )
}
