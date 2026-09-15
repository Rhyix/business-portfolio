import type { SocialLink } from '../types/content'

export interface CompanyProfile {
  /** Brand name shown in the navigation, footer and page copy. */
  name: string
  /** Short mark used by the logo until a real logo asset is available. */
  monogram: string
  /** One-line positioning statement. */
  tagline: string
  /** Short company summary used in the footer. */
  description: string
  email: string
  phone: string
  location: string
  /** Add real profile URLs here. An empty list hides the footer social block. */
  social: SocialLink[]
}

/**
 * PLACEHOLDER CONTENT — single source of truth for brand and contact details.
 * Replace the values below with the real business information; no component or
 * layout change is required.
 */
export const company: CompanyProfile = {
  name: 'Your Company',
  monogram: 'YC',
  tagline: 'Custom software solutions built for your business.',
  description:
    'We design, develop and maintain custom web systems, business management software and responsive web applications, built around your requirements.',
  email: 'hello@yourcompany.com',
  phone: '+00 000 0000',
  // PLACEHOLDER: add a city/region once a physical office location is confirmed.
  location: 'Remote',
  social: [],
}

/** Footer copyright line, e.g. "© 2026 Your Company. All rights reserved." */
export function buildCopyright(year: number = new Date().getFullYear()): string {
  return `© ${year} ${company.name}. All rights reserved.`
}