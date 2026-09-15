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
