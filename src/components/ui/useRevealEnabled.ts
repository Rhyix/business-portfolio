import { useReducedMotion } from 'motion/react'

const supportsIntersectionObserver =
  typeof window !== 'undefined' && 'IntersectionObserver' in window

/**
 * Shared guard for every scroll-triggered entrance primitive (`Reveal`,
 * `RevealStagger`): returns `false` when the visitor prefers reduced motion,
 * or when the browser has no IntersectionObserver to drive `whileInView` —
 * in either case, callers should render static, already-visible content
 * instead of the animated variant.
 */
export function useRevealEnabled(): boolean {
  const prefersReducedMotion = useReducedMotion()
  return !prefersReducedMotion && supportsIntersectionObserver
}
