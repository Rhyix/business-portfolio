import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { railObservedSections } from '../data/sectionRail'
import { useSectionProgress } from './hooks'
import { NavigationContext } from './useNavigation'
import type { NavigationTransition, NavigationValue } from './useNavigation'

/** How long a dial commit stays "in flight" before we stop suppressing scroll transitions. */
const DIAL_SETTLE_MS = 1400

interface NavState {
  prevIndex: number
  transition: NavigationTransition | null
  /** Destination of a dial commit still being scrolled to, or null. */
  pendingTo: number | null
  key: number
}

/**
 * Owns which section is the current system state, and why it changed.
 *
 * It holds the page's only section-progress observer — the System Dial reads
 * `activeIndex` from here rather than running its own — so direction has a
 * single source of truth and there is no second observer to keep in sync.
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const { activeIndex, activeSectionId } = useSectionProgress(railObservedSections)
  const [state, setState] = useState<NavState>(() => ({
    prevIndex: activeIndex,
    transition: null,
    pendingTo: null,
    key: 0,
  }))
  const settleTimerRef = useRef<number | null>(null)

  // Derived during render rather than in an effect: direction is then correct
  // on the very first render that sees the new index, and no cascading render
  // is scheduled. React supports setState during render of the same component
  // for exactly this "adjust state when an input changes" case; the guard
  // below always converges because prevIndex is set to activeIndex.
  if (state.prevIndex !== activeIndex) {
    setState((current) => {
      // A dial commit is mid-flight: the smooth scroll passes through
      // intermediate sections, and none of them should announce themselves.
      if (current.pendingTo !== null) {
        return {
          ...current,
          prevIndex: activeIndex,
          pendingTo: activeIndex === current.pendingTo ? null : current.pendingTo,
        }
      }

      const key = current.key + 1
      return {
        prevIndex: activeIndex,
        pendingTo: null,
        key,
        transition: {
          toIndex: activeIndex,
          direction: activeIndex > current.prevIndex ? 'forward' : 'backward',
          source: 'scroll',
          key,
        },
      }
    })
  }

  const notifyDialCommit = useCallback((toIndex: number) => {
    if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null
      setState((current) => (current.pendingTo === null ? current : { ...current, pendingTo: null }))
    }, DIAL_SETTLE_MS)

    setState((current) => {
      const key = current.key + 1
      return {
        ...current,
        pendingTo: toIndex,
        key,
        transition: {
          toIndex,
          direction: toIndex > current.prevIndex ? 'forward' : 'backward',
          source: 'dial',
          key,
        },
      }
    })
  }, [])

  useEffect(
    () => () => {
      if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current)
    },
    [],
  )

  // Published for the CSS that de-emphasises whichever section is no longer
  // the active state; keeps that relationship declarative instead of threading
  // props through every section.
  const { transition } = state
  useEffect(() => {
    const root = document.documentElement
    root.dataset.navDirection = transition?.direction ?? 'forward'
    root.dataset.navSource = transition?.source ?? 'scroll'
  }, [transition])

  const value = useMemo<NavigationValue>(
    () => ({ activeIndex, activeSectionId, transition, notifyDialCommit }),
    [activeIndex, activeSectionId, transition, notifyDialCommit],
  )

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}
