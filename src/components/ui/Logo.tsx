import { company } from '../../data/company'
import { cn } from '../../lib/cn'

interface LogoProps {
  className?: string
  tone?: 'light' | 'dark'
  href?: string
}

/**
 * Monogram + wordmark, driven by src/data/company.ts.
 * Replace the monogram block with a real logo asset when one is available.
 */
export function Logo({ className, tone = 'light', href = '#home' }: LogoProps) {
  const isDark = tone === 'dark'
  const [brandName, ...descriptorWords] = company.name.trim().split(' ')
  const descriptor = descriptorWords.join(' ')

  return (
    <a href={href} className={cn('group inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-9 place-items-center rounded-xl text-[0.8rem] font-semibold tracking-tight transition-colors duration-200',
          isDark ? 'bg-white text-ink-950' : 'bg-ink-950 text-white group-hover:bg-accent-600',
        )}
      >
        {company.monogram}
      </span>
      <span
        className={cn(
          'text-[0.95rem] font-semibold tracking-tight',
          isDark ? 'text-white' : 'text-ink-900',
        )}
      >
        {brandName}
        {descriptor ? (
          <span
            className={cn(
              'hidden font-medium sm:inline',
              isDark ? 'text-ink-300' : 'text-ink-500',
            )}
          >
            {' '}
            {descriptor}
          </span>
        ) : null}
      </span>
    </a>
  )
}