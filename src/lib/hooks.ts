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
 * Id of the section currently crossing the middle of the viewport.
 * `sectionIds` must be a stable reference (module-level data) to avoid
 * re-creating the observer on every render.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) setActiveId(visibleEntry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
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

  useEffect(() => {
    const entries = sections
      .map((section) => ({ ...section, element: document.getElementById(section.sectionId) }))
      .filter((section): section is SectionProgressEntry & { element: HTMLElement } => section.element !== null)

    if (entries.length === 0) return

    const visible = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) visible.set(record.target.id, record.isIntersecting)

        const hit = entries.find((section) => visible.get(section.sectionId))
        if (!hit) return

        setState((previous) =>
          previous.activeSectionId === hit.sectionId
            ? previous
            : { activeIndex: hit.itemIndex, activeSectionId: hit.sectionId },
        )
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    entries.forEach((section) => observer.observe(section.element))
    return () => observer.disconnect()
  }, [sections])

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

/** True while any `[data-tone="dark"]` section is crossing the middle of the viewport. */
export function useDarkGroundAtMiddle(): boolean {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-tone="dark"]'))
    if (targets.length === 0) return

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
    return () => observer.disconnect()
  }, [])

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
