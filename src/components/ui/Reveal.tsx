import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { fadeInUp } from '../../lib/motion'
import { useRevealEnabled } from './useRevealEnabled'

interface RevealProps {
  children: ReactNode
  /** Delay in seconds, used to stagger sibling elements. */
  delay?: number
  className?: string
}

/**
 * Fades and lifts its children into view once.
 * Falls back to static content when the user prefers reduced motion, or when
 * the browser has no IntersectionObserver to drive `whileInView`.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const revealEnabled = useRevealEnabled()
  const variants = useMemo(() => fadeInUp(delay), [delay])

  if (!revealEnabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
    >
      {children}
    </m.div>
  )
}