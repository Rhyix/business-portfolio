import { useMemo } from 'react'
import { m } from 'motion/react'
import { drawLineX, drawLineY } from '../../lib/motion'
import { useRevealEnabled } from './useRevealEnabled'
import { cn } from '../../lib/cn'

interface RailProps {
  orientation?: 'horizontal' | 'vertical'
  tone?: 'light' | 'dark'
  /** Evenly spaced accent "joints" drawn along the rail. */
  nodes?: number
  /** Draw the rail in once on scroll-into-view, matching <Reveal>'s gating. */
  animate?: boolean
  delay?: number
  className?: string
}

/**
 * A 1px structural line with optional accent nodes — the site's connected-
 * systems signature (see Stage 16 plan section B). Purely decorative:
 * aria-hidden, no pointer events. Always paired with real text/labels
 * alongside it, so removing color loses no information.
 */
export function Rail({ orientation = 'horizontal', tone = 'light', nodes = 0, animate = true, delay = 0, className }: RailProps) {
  const revealEnabled = useRevealEnabled()
  const isVertical = orientation === 'vertical'
  const variants = useMemo(() => (isVertical ? drawLineY(delay) : drawLineX(delay)), [isVertical, delay])
  const shouldAnimate = animate && revealEnabled

  const lineClassName = cn(
    'relative block',
    isVertical ? 'h-full w-px origin-top' : 'h-px w-full origin-left',
    tone === 'dark' ? 'bg-ink-800' : 'bg-ink-200',
  )

  const nodeMarks =
    nodes > 0
      ? Array.from({ length: nodes }, (_, index) => {
          const position = nodes === 1 ? 50 : (index / (nodes - 1)) * 100
          return (
            <span
              key={index}
              className={cn(
                'absolute size-1.5 rounded-full bg-accent-500',
                tone === 'dark' ? 'ring-4 ring-ink-975' : 'ring-4 ring-ink-50',
                isVertical ? '-left-[3px] -translate-y-1/2' : '-top-[3px] -translate-x-1/2',
              )}
              style={isVertical ? { top: `${position}%` } : { left: `${position}%` }}
            />
          )
        })
      : null

  if (!shouldAnimate) {
    return (
      <span aria-hidden="true" className={cn('pointer-events-none block', className)}>
        <span className={lineClassName}>{nodeMarks}</span>
      </span>
    )
  }

  return (
    <span aria-hidden="true" className={cn('pointer-events-none block', className)}>
      <m.span
        className={lineClassName}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={variants}
      >
        {nodeMarks}
      </m.span>
    </span>
  )
}
