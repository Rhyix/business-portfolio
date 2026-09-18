import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonTone = 'light' | 'dark'

const baseStyles =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 ease-out-expo'

const variantStyles: Record<ButtonTone, Record<ButtonVariant, string>> = {
  light: {
    primary: 'bg-ink-950 text-white hover:bg-ink-800',
    secondary:
      'border border-ink-200 bg-white text-ink-800 shadow-soft hover:border-ink-300 hover:bg-ink-50',
    ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  },
  // Used on the site's dark sections (FeaturedPlatform, CallToAction) — a
  // light-on-dark control set so a primary CTA still reads as the brightest
  // object on the page instead of disappearing into the ink-975 ground.
  dark: {
    primary: 'bg-white text-ink-950 hover:bg-ink-100',
    secondary: 'border border-ink-400 text-white hover:bg-ink-900',
    ghost: 'text-ink-300 hover:bg-ink-900 hover:text-white',
  },
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.9375rem]',
}

/**
 * Button's visual styling as a plain class string, for the rare case where a
 * non-<button>/<a> element (e.g. the router's internal Link) needs to look
 * like a Button without duplicating these class lists.
 */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
  tone: ButtonTone = 'light',
): string {
  return cn(baseStyles, variantStyles[tone][variant], sizeStyles[size], className)
}
