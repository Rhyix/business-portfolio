export interface RailSection {
  /** Rail item's own section id — must match a real `<section id>`. */
  id: string
  label: string
  href: string
  /**
   * Sections that exist on the page but have no rail entry of their own —
   * while one of these crosses the viewport middle, this item stays lit, so
   * the progress readout never goes stale or non-monotonic.
   */
  absorbs?: readonly string[]
}

/** The 8 stops shown by SectionRail — a separate list from primaryNavigation, which drives the navbar and footer and must stay unchanged. */
export const railSections: readonly RailSection[] = [
  { id: 'home', label: 'Home', href: '#home', absorbs: ['why-us'] },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'platform', label: 'Platform', href: '#platform' },
  { id: 'solutions', label: 'Solutions', href: '#solutions' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'process', label: 'Process', href: '#process' },
  { id: 'technology', label: 'Stack', href: '#technology' },
  { id: 'contact', label: 'Contact', href: '#contact', absorbs: ['get-started'] },
]

/**
 * Zero-padded position of a section within the dial's sequence, for the
 * matching index shown in that section's heading. Derived from `railSections`
 * so the page and the dial can never disagree about what `04 / 08` means.
 */
export function sectionIndexLabel(id: string): string | undefined {
  const index = railSections.findIndex((section) => section.id === id)
  return index === -1 ? undefined : String(index + 1).padStart(2, '0')
}

/**
 * Every real section id on the page, in document order, mapped to its rail
 * item index. Hand-built rather than derived from `absorbs` — folding needs
 * true document order, which a data table can't reconstruct on its own.
 */
export const railObservedSections: readonly { sectionId: string; itemIndex: number }[] = [
  { sectionId: 'home', itemIndex: 0 },
  { sectionId: 'why-us', itemIndex: 0 },
  { sectionId: 'services', itemIndex: 1 },
  { sectionId: 'platform', itemIndex: 2 },
  { sectionId: 'solutions', itemIndex: 3 },
  { sectionId: 'about', itemIndex: 4 },
  { sectionId: 'process', itemIndex: 5 },
  { sectionId: 'technology', itemIndex: 6 },
  { sectionId: 'get-started', itemIndex: 7 },
  { sectionId: 'contact', itemIndex: 7 },
]
