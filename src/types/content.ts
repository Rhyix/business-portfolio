import type { LucideIcon } from 'lucide-react'

/** A Lucide icon component, used for decorative section iconography. */
export type IconComponent = LucideIcon

/** An in-page anchor link. */
export interface NavItem {
  label: string
  href: string
}

/** A single trust/value point. */
export interface ValueProp {
  title: string
  description: string
  icon: IconComponent
}

/** A service offered by the business. */
export interface Service {
  title: string
  description: string
  icon: IconComponent
}

/** An external profile link. Rendered only when a real URL is supplied. */
export interface SocialLink {
  label: string
  href: string
}

/** Illustrative system interface rendered on a solution card. */
export type SystemMockupVariant = 'table' | 'people' | 'board' | 'stock' | 'schedule' | 'chart'

/**
 * A representative system the business can build.
 * These are sample solutions, never presented as delivered client projects.
 */
export interface Solution {
  id: string
  /** Short grouping label shown above the title. */
  category: string
  title: string
  description: string
  technologies: string[]
  mockup: SystemMockupVariant
  /** Internal route to an interactive demo, when one exists for this solution. */
  demoHref?: string
  /** Marks the flagship solution so ProjectCard can style it distinctly. */
  featured?: boolean
}

/** A single phase of the development process. */
export interface ProcessStep {
  title: string
  description: string
  icon: IconComponent
}

/** A grouping of the technologies the business works with. */
export interface TechnologyGroup {
  title: string
  description: string
  icon: IconComponent
  technologies: string[]
}
