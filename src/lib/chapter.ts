import { createContext, useContext, useEffect, useState } from 'react'
import type { RefObject } from 'react'

/**
 * True once the surrounding section has opened as a "chapter". `null` means
 * there is no chapter boundary above the consumer, which lets <ChapterReveal />
 * fall back to per-element scroll reveal outside of a <Section>.
 */
export const ChapterContext = createContext<boolean | null>(null)

const supportsIntersectionObserver =
  typeof window !== 'undefined' && 'IntersectionObserver' in window

/**
 * Latches true the first time `ref`'s element is meaningfully on screen —
 * its top crossing 75% of the viewport — and never flips back. One observer
 * per section replaces one per revealed element, and the latch is what makes
 * rapid scrolling incapable of retriggering or interleaving a chapter.
 */
export function useChapterActivation(ref: RefObject<HTMLElement | null>): boolean {
  // Without IntersectionObserver there is nothing to drive the chapter, so it
  // starts open and every ChapterReveal renders its content immediately.
  const [activated, setActivated] = useState(!supportsIntersectionObserver)

  useEffect(() => {
    if (!supportsIntersectionObserver) return
    const element = ref.current
    if (!element) return

    let observed = false

    const observer = new IntersectionObserver(
      (records) => {
        observed = true
        if (records.some((record) => record.isIntersecting)) {
          setActivated(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -25% 0px' },
    )

    observer.observe(element)

    // An observer always reports its target's initial state shortly after
    // observe(). Silence means the environment isn't delivering callbacks at
    // all, so open the chapter rather than leave the section permanently
    // invisible. A working observer reports within a frame or two, long
    // before this fires, so the choreography is unaffected.
    const failsafe = window.setTimeout(() => {
      if (!observed) setActivated(true)
    }, 1200)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [ref])

  return activated
}

/** Chapter state of the nearest <Section>, or null when there isn't one. */
export function useChapterActivated(): boolean | null {
  return useContext(ChapterContext)
}
