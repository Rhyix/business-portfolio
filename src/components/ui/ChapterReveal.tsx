import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { m } from 'motion/react'
import {
  CHAPTER_STEP,
  CHAPTER_STEP_STRONG,
  CHAPTER_TRAVEL,
  CHAPTER_TRAVEL_STRONG,
  COMPACT_CHAPTER_STEP,
  COMPACT_CHAPTER_STEP_STRONG,
  COMPACT_CHAPTER_TRAVEL,
  COMPACT_CHAPTER_TRAVEL_STRONG,
  enterFrom,
} from '../../lib/motion'
import { useChapterState } from '../../lib/chapter'
import { useCompactMotion } from '../../lib/hooks'
import { useRevealEnabled } from './useRevealEnabled'

interface ChapterRevealProps {
  children: ReactNode
  /**
   * Rung on the chapter's entrance ladder — 0 arrives first. Fractional rungs
   * are fine: a grid uses them to space a wave between the integer beats.
   */
  step?: number
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
  const chapter = useChapterState()
  const compact = useCompactMotion()

  const strong = chapter?.intensity === 'strong'
  const rung = compact
    ? strong
      ? COMPACT_CHAPTER_STEP_STRONG
      : COMPACT_CHAPTER_STEP
    : strong
      ? CHAPTER_STEP_STRONG
      : CHAPTER_STEP
  const travel = compact
    ? strong
      ? COMPACT_CHAPTER_TRAVEL_STRONG
      : COMPACT_CHAPTER_TRAVEL
    : strong
      ? CHAPTER_TRAVEL_STRONG
      : CHAPTER_TRAVEL

  const variants = useMemo(
    () => enterFrom(step * rung, travel, chapter?.direction ?? 'forward'),
    [step, rung, travel, chapter?.direction],
  )

  if (!revealEnabled) {
    return <div className={className}>{children}</div>
  }

  // No chapter boundary above us — behave exactly like <Reveal>.
  if (chapter === null) {
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
    // Keying on replayKey remounts on a deliberate re-entry, which is what
    // lets an already-seen chapter play again. It stays 0 for scrolling, so
    // ordinary reading never remounts and never loses focus.
    <m.div
      key={chapter.replayKey}
      className={className}
      initial="hidden"
      animate={chapter.activated ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </m.div>
  )
}
