import { cn } from '../../lib/cn'

export type CardHoverTone = 'clickable' | 'static' | 'cell'

const hoverStyles: Record<CardHoverTone, string> = {
  // Has a real link/button target — the lift signals "this leads somewhere."
  clickable: 'transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-card',
  // No click target of its own — shadow only, so hover honestly reflects what's interactive.
  static: 'transition-all duration-200 ease-out-expo hover:shadow-card',
  // De-boxed hairline cells (Solutions, Process): no shadow to drop, so the
  // rule itself "charges" darker instead — pairs with a sibling index/mockup
  // that each consumer tints on hover (e.g. `group-hover:text-accent-600`).
  cell: 'transition-colors duration-200 ease-out-expo hover:border-ink-900',
}

/**
 * A card's existing `transition-colors` utility and this one both set the
 * CSS `transition-property`, so they can't layer — the later one in
 * Tailwind's generated stylesheet order simply wins outright, silently
 * dropping whichever set of properties lost. `transition-all` sidesteps
 * that by covering colors *and* transform/shadow in one declaration, so
 * every hover state on the card (existing border/bg tint included) ends up
 * on the same `ease-out-expo` timing instead of any silently reverting to
 * Tailwind's default easing. See src/lib/motion.ts for that shared curve.
 */
export function cardHoverClassName(tone: CardHoverTone, className?: string): string {
  return cn(hoverStyles[tone], className)
}
