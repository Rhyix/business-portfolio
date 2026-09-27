import type { NavItem } from '../types/content'
import { railSections } from './sectionRail'

/** Primary in-page navigation, shared by the navbar and the footer. */
export const primaryNavigation: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

/** Main call to action shown in the navigation bar and the mobile menu. */
export const navigationCta: NavItem = { label: 'Start a Project', href: '#contact' }

/** Section ids represented by a primary-navigation entry. */
export const sectionIds: readonly string[] = primaryNavigation.map((item) =>
  item.href.replace('#', ''),
)

/**
 * The primary-navigation item that should read as active at each of the dial's
 * rail stops.
 *
 * The rail has eight stops but the navigation lists six, so `#platform` and
 * `#technology` have no entry of their own. Each stop therefore resolves to the
 * nearest listed section at or before it, which is what the navbar's own
 * observer used to produce by accident: it watched only the six listed sections,
 * so passing through an unlisted one simply left the previous item highlighted.
 * Deriving it from the two lists keeps that behaviour exactly while removing the
 * second observer, and it cannot drift if either list changes.
 */
const primaryIdByRailIndex: readonly (string | null)[] = (() => {
  const listed = new Set(sectionIds)
  let nearest: string | null = null

  return railSections.map((section) => {
    if (listed.has(section.id)) nearest = section.id
    return nearest
  })
})()

/** Primary-navigation id to highlight for a rail index, or null before the first. */
export function primaryNavIdForRailIndex(index: number): string | null {
  return primaryIdByRailIndex[index] ?? null
}