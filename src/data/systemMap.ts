/**
 * Coordinate space for the Hero system map. The rendering container is
 * locked to this aspect ratio (aspect-[7/5]), so one coordinate unit is the
 * same pixel distance on both axes at every viewport width — a connector's
 * length/angle computed once from these numbers translates directly into a
 * CSS width%/rotate with no per-breakpoint recomputation.
 */
export const SYSTEM_MAP_VIEW = { width: 560, height: 400 } as const

export const systemMapCore = {
  label: 'AETEX',
  /** Lifted verbatim from platformArchitecture (src/data/platform.ts) so the
   *  Hero diagram and the Featured Platform section describe the same idea
   *  in the same words. */
  sublabel: 'Shared business data',
  x: 280,
  y: 200,
} as const

export interface SystemMapNode {
  id: string
  label: string
  x: number
  y: number
  /** Which side of the node its label sits on, so no label crosses the core. */
  side: 'left' | 'right'
  /** Exactly one node is true — the map's single persistent, non-looping highlight. */
  active?: boolean
}

/** Six modules around the shared-data core — each name maps to a real demo app on the site. */
export const systemMapNodes: readonly SystemMapNode[] = [
  { id: 'operations', label: 'Operations', x: 444.5, y: 124, side: 'right', active: true },
  { id: 'reports', label: 'Reports', x: 444.5, y: 276, side: 'right' },
  { id: 'people', label: 'People & HR', x: 280, y: 48, side: 'right' },
  { id: 'recruitment', label: 'Recruitment', x: 280, y: 352, side: 'right' },
  { id: 'inventory', label: 'Inventory', x: 115.5, y: 124, side: 'left' },
  { id: 'scheduling', label: 'Scheduling', x: 115.5, y: 276, side: 'left' },
]
