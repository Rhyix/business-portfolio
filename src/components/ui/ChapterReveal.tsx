import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { m } from 'motion/react'
import { CHAPTER_STEP, fadeInUp } from '../../lib/motion'
import { useChapterActivated } from '../../lib/chapter'
import { useRevealEnabled } from './useRevealEnabled'

interface ChapterRevealProps {
  children: ReactNode
  /** Rung on the chapter's entrance ladder — 0 arrives first, 4 last. */
  step?: 0 | 1 | 2 | 3 | 4
  className?: string
}

/**
 * Entrance for a section's lead block — the part on screen when the chapter
 * opens. Unlike <Reveal>, every ChapterReveal in a section shares one trigger
 * (the <Section>'s activation), so their `step` values read as one coordinated
 * sequence instead of independent scroll reveals.
 *
 * Deliberately NOT used for content deeper in a tall section: that would fire
 * while the visitor is still nowhere near it, leaving it already-animated and
 * inert on arrival. Deeper content keeps <Reveal>.
 */
export function ChapterReveal({ children, step = 0, className }: ChapterRevealProps) {
  const revealEnabled = useRevealEnabled()
  const activated = useChapterActivated()
  const variants = useMemo(() => fadeInUp(step * CHAPTER_STEP), [step])

  if (!revealEnabled) {
    return <div className={className}>{children}</div>
  }

  // No chapter boundary above us — behave exactly like <Reveal>.
  if (activated === null) {
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

  return (
    <m.div
      className={className}
      initial="hidden"
      animate={activated ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </m.div>
  )
}
