/**
 * Shared node/line class constants for the interactive-system layer
 * (SectionRail + the Hero SystemMap) — keeps both built from the same two
 * primitives (rule, node) as the rest of the site's "connected systems"
 * language. Not used elsewhere; existing components keep their own inline
 * classes rather than being refactored onto this module.
 */
export const NODE_MARK = 'size-1.5 rounded-full bg-accent-500'
export const NODE_MARK_DARK = 'size-1.5 rounded-full bg-accent-400'
export const NODE_HALO_LIGHT = 'ring-4 ring-white'
export const NODE_HALO_DARK = 'ring-4 ring-ink-975'
export const NODE_IDLE = 'size-1.5 rounded-full bg-ink-300'
export const LINE_LIGHT = 'bg-ink-200'
export const LINE_DARK = 'bg-ink-800'
export const LINE_LIVE = 'bg-accent-500/70'
