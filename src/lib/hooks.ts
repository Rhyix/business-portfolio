import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/** True once the page has been scrolled past `threshold` pixels. */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > threshold,
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}


/**
 * Runs `attach` against the elements `resolve` finds now, and again whenever
 * that set changes. Several sections swap between a pinned and a static
 * layout at a breakpoint, which replaces their element; an observer holding
 * the old one would silently stop reporting. Mutations are coalesced to one
 * check per frame, and `attach` only re-runs when the elements differ.
 */
function watchElements<T extends Element>(resolve: () => T[], attach: (elements: T[]) => () => void): () => void {
  let current = resolve()
  let detach = attach(current)
  let frame = 0

  const mutations = new MutationObserver(() => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const next = resolve()
      const same = next.length === current.length && next.every((element, index) => element === current[index])
      if (same) return
      detach()
      current = next
      detach = attach(current)
    })
  })
  mutations.observe(document.body, { childList: true, subtree: true })

  return () => {
    cancelAnimationFrame(frame)
    mutations.disconnect()
    detach()
  }
}

interface SectionProgressEntry {
  sectionId: string
  itemIndex: number
}

/**
 * Tracks a zero-based `activeIndex` into a fixed-size list of rail items,
 * given a flattened, document-order table mapping every real section id to
 * the rail item it belongs to (see `src/data/sectionRail.ts`). Resolution
 * happens in document order rather than IntersectionObserver callback-batch
 * order, so the index advances monotonically as the visitor scrolls.
 * `sections` must be a stable, module-level reference.
 */
export function useSectionProgress(sections: readonly SectionProgressEntry[]): {
  activeIndex: number
  activeSectionId: string | null
} {
  const [state, setState] = useState<{ activeIndex: number; activeSectionId: string | null }>({
    activeIndex: 0,
    activeSectionId: null,
  })

  useEffect(
    () =>
      watchElements(
        () =>
          sections
            .map((section) => document.getElementById(section.sectionId))
            .filter((element): element is HTMLElement => element !== null),
        (elements) => {
          const visible = new Map<string, boolean>()

          const observer = new IntersectionObserver(
            (records) => {
              for (const record of records) visible.set(record.target.id, record.isIntersecting)

              const hit = sections.find((section) => visible.get(section.sectionId))
              if (!hit) return

              setState((previous) =>
                previous.activeSectionId === hit.sectionId
                  ? previous
                  : { activeIndex: hit.itemIndex, activeSectionId: hit.sectionId },
              )
            },
            { rootMargin: '-45% 0px -45% 0px' },
          )

          elements.forEach((element) => observer.observe(element))
          return () => observer.disconnect()
        },
      ),
    [sections],
  )

  return state
}

const COMPACT_MOTION_QUERY = '(max-width: 639px)'

/**
 * True on small screens, where chapter choreography uses a tighter ladder and
 * less travel. Subscribes to the media query rather than resize, so it costs
 * nothing until the breakpoint is actually crossed.
 */
export function useCompactMotion(): boolean {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(COMPACT_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(COMPACT_MOTION_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setCompact(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return compact
}

/** Live result of a CSS media query, updated only when the query flips. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    list.addEventListener('change', handleChange)
    return () => list.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

/** True while any `[data-tone="dark"]` ground is crossing the middle of the viewport. */
export function useDarkGroundAtMiddle(): boolean {
  const [dark, setDark] = useState(false)

  useEffect(
    () =>
      watchElements(
        // The dial marks itself dark in response to this hook, so it is never a ground.
        () => Array.from(document.querySelectorAll<HTMLElement>('[data-tone="dark"]:not([data-mode])')),
        (targets) => {
          const visible = new Set<Element>()

          const observer = new IntersectionObserver(
            (records) => {
              for (const record of records) {
                if (record.isIntersecting) visible.add(record.target)
                else visible.delete(record.target)
              }
              setDark(visible.size > 0)
            },
            { rootMargin: '-50% 0px -50% 0px' },
          )

          targets.forEach((target) => observer.observe(target))
          return () => {
            observer.disconnect()
            // A ground that was removed while on screen must not leave the dial dark.
            setDark(false)
          }
        },
      ),
    [],
  )

  return dark
}


/**
 * Calls `onOutside` when a pointer press lands outside the returned ref's
 * element. Used by dropdown-style menus (notifications, user menu).
 */
export function useClickOutside<T extends HTMLElement>(
  active: boolean,
  onOutside: () => void,
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active) return

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        onOutside()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [active, onOutside])

  return ref
}
