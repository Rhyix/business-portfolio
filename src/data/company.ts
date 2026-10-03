import type { SocialLink } from '../types/content'

export interface CompanyProfile {
  /** Brand name shown in the navigation, footer and page copy. */
  name: string
  /** Short mark used by the logo until a real logo asset is available. */
  monogram: string
  /** One-line positioning statement. */
  tagline: string
  /**
   * Short company summary. Rendered in the footer and mirrored by the
   * Organization JSON-LD description in index.html, so it has to read as a
   * standalone sentence about the business rather than footer-only filler.
   */
  description: string
  email: string
  phone: string
  location: string
  /** Add real profile URLs here. An empty list hides the footer social block. */
  social: SocialLink[]
}

/**
 * Single source of truth for brand and contact details. Every surface that
 * shows contact information — Contact, Footer, CallToAction, FormSuccess —
 * reads from here, so a change lands everywhere at once.
 */
export const company: CompanyProfile = {
  name: 'AETEX Tech Solution',
  monogram: 'A',
  tagline: 'Custom software solutions built for your business.',
  description:
    'We build custom web systems for organisations whose processes do not fit off-the-shelf software — business platforms, dashboards and the databases and integrations behind them.',
  email: 'aetextechsolutions@gmail.com',
  /**
   * Display format. Every `tel:` link derives from this by stripping all but
   * digits and the leading `+`, so the spacing is presentational only and
   * reformatting it cannot break the link.
   */
  phone: '+63 961 394 6736',
  /** The business operates remotely. This is not a postal address. */
  location: 'Remote',
  social: [],
}

/** Footer copyright line, e.g. "© 2026 AETEX Tech Solution. All rights reserved." */
export function buildCopyright(year: number = new Date().getFullYear()): string {
  return `© ${year} ${company.name}. All rights reserved.`
}