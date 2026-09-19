import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { ChapterContext, useChapterActivation, useChapterState } from '../../lib/chapter'

interface ChapterBoundaryProps {
  children: ReactNode
  className?: string
}

/**
 * Opens a chapter at block scale, the way <Section> opens one at section
 * scale — a chapter is composable.
 *
 * Exists because a section taller than the viewport activates while its lower
 * content is still below the fold: folding that content into the section's own
 * chapter would animate it where nobody can see it, leaving it inert on
 * arrival. Wrapping such a block in its own boundary gives it a second, later
 * activation while keeping one observer for the whole group.
 */
export function ChapterBoundary({ children, className }: ChapterBoundaryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const activated = useChapterActivation(ref)
  const parent = useChapterState()

  // Direction, intensity and replay come from the section — a block is part of
  // its chapter, not a chapter of its own. Only the *latch* is local, so
  // scrolling still can't open this block while it is below the fold; a
  // deliberate dial arrival, which lands the block on screen, opens it with
  // the rest of the section.
  const value = useMemo(
    () => ({
      activated: activated || (parent?.intensity === 'strong' && parent.activated),
      replayKey: parent?.replayKey ?? 0,
      direction: parent?.direction ?? ('forward' as const),
      intensity: parent?.intensity ?? ('subtle' as const),
    }),
    [activated, parent],
  )

  return (
    <div ref={ref} className={className}>
      <ChapterContext.Provider value={value}>{children}</ChapterContext.Provider>
    </div>
  )
}
