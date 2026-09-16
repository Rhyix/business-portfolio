import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { fadeInUpItem, staggerContainer } from '../../lib/motion'
import { useRevealEnabled } from './useRevealEnabled'

interface RevealStaggerProps {
  children: ReactNode
  /** Seconds between each item's entrance. Kept small — this is for a handful of grouped items, not a list. */
  staggerChildren?: number
  className?: string
}

interface RevealStaggerItemProps {
  children: ReactNode
  className?: string
}

/**
 * Scroll-triggered entrance for a small, fixed set of already-grouped visual
 * blocks (e.g. a decorative dashboard's sidebar / stat tiles / chart / rows)
 * that today fade in as one inert unit. Wraps `RevealStagger.Item` children
 * in one `whileInView` container instead of giving each item its own
 * IntersectionObserver — cheaper, and correct for content that's really one
 * visual unit. NOT intended for per-leaf animation (e.g. every bar in a
 * chart) — see `Reveal` for the sitewide per-section entrance pattern.
 * Falls back to static, already-visible content under reduced motion or
 * without IntersectionObserver support, via the same guard `Reveal` uses.
 */
export function RevealStagger({ children, staggerChildren = 0.06, className }: RevealStaggerProps) {
  const revealEnabled = useRevealEnabled()

  if (!revealEnabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer(staggerChildren)}
    >
      {children}
    </m.div>
  )
}

/** One grouped item inside a `RevealStagger` — timing comes from the parent's staggerChildren. */
function RevealStaggerItem({ children, className }: RevealStaggerItemProps) {
  return (
    <m.div className={className} variants={fadeInUpItem()}>
      {children}
    </m.div>
  )
}

RevealStagger.Item = RevealStaggerItem
