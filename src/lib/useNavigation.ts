import { createContext, useContext } from 'react'
import type { TransitionDirection } from './motion'

export type TransitionSource = 'dial' | 'scroll'

export interface NavigationTransition {
  toIndex: number
  direction: TransitionDirection
  source: TransitionSource
  /** Bumps on every commit — this is what lets a destination replay. */
  key: number
}

export interface NavigationValue {
  activeIndex: number
  activeSectionId: string | null
  transition: NavigationTransition | null
  notifyDialCommit: (toIndex: number) => void
}

export const NavigationContext = createContext<NavigationValue | null>(null)

/** Navigation state, or null outside the marketing shell (e.g. the demo apps). */
export function useNavigation(): NavigationValue | null {
  return useContext(NavigationContext)
}
