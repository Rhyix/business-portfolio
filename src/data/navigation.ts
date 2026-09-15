import type { NavItem } from '../types/content'

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

/** Section ids watched by the navbar to highlight the active link. */
export const sectionIds: readonly string[] = primaryNavigation.map((item) =>
  item.href.replace('#', ''),
)