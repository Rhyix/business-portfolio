import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { fadeInUp } from '../../lib/motion'

interface RevealProps {
  children: ReactNode
  /** Delay in seconds, used to stagger sibling elements. */
  delay?: number
  className?: string
}

/**
 * Fades and lifts its children into view once.
 * Falls back to static content when the user prefers reduced motion.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const variants = useMemo(() => fadeInUp(delay), [delay])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}