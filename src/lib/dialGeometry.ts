import { useEffect, useState } from 'react'

/**
 * Degrees between adjacent sections. Not 360/8: an item two steps out would
 * then sit at 90° from the bulge, where x equals the circle's centre — which
 * is off-screen by definition, at every radius. So a 45° step can never show
 * the outer pair of a five-label window. 26° is the largest step that keeps
 * the centre off-screen and all five labels on it; eight sections then span
 * 208°, so the control still reads as a semicircle.
 */
export const STEP_DEG = 26

/** Steps either side of the focus point that stay visible. */
export const WINDOW_RADIUS = 2

/** Clearance between the outermost visible label and the viewport edge. */
const OUTER_MARGIN = 40

/** Width below which the instrument is replaced by a passive indicator. */
export const DIAL_MIN_WIDTH = 1280

const DEG = Math.PI / 180

export interface DialGeometry {
  radius: number
  /** Distance the circle's centre sits *outside* the right viewport edge. */
  centerOffsetX: number
  /** Distance from the right edge to the focus point (the arc's bulge). */
  focusInset: number
}

function radiusFor(viewportWidth: number, viewportHeight: number): number {
  const cap = viewportWidth >= 1440 ? 310 : viewportWidth >= 1024 ? 250 : 200
  return Math.max(190, Math.min(cap, viewportHeight * 0.34))
}

/**
 * The dial's circle. Its centre is off-screen to the right, so only the left
 * flank is visible — an arc bulging leftward into the viewport, deepest at the
 * focus point where the active section sits.
 *
 * The focus inset is derived from the radius rather than hard-coded per
 * breakpoint, so the outermost visible label clears the edge at every viewport
 * size instead of only the ones that happened to get tested.
 */
export function computeDialGeometry(viewportWidth: number, viewportHeight: number): DialGeometry {
  const radius = radiusFor(viewportWidth, viewportHeight)
  const outerRecession = radius * (1 - Math.cos(WINDOW_RADIUS * STEP_DEG * DEG))
  const focusInset = outerRecession + OUTER_MARGIN
  return { radius, focusInset, centerOffsetX: radius - focusInset }
}

/** Angle for an item `offset` steps from the focus point. 180° is the bulge. */
export function angleForOffset(offset: number): number {
  return 180 - offset * STEP_DEG
}

/**
 * Position relative to the dial container's origin — the right viewport edge,
 * vertically centred. x is negative going left into the page.
 */
export function positionForAngle(
  angleDeg: number,
  geometry: DialGeometry,
): { x: number; y: number } {
  const radians = angleDeg * DEG
  return {
    x: geometry.centerOffsetX + geometry.radius * Math.cos(radians),
    y: geometry.radius * Math.sin(radians),
  }
}

/** Smallest signed difference between two angles, wrapping correctly at ±180°. */
export function shortestAngleDelta(fromDeg: number, toDeg: number): number {
  let delta = (toDeg - fromDeg) % 360
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return delta
}

/** Angle of a pointer position around the dial's off-screen centre. */
export function pointerAngle(
  clientX: number,
  clientY: number,
  geometry: DialGeometry,
  viewportWidth: number,
  viewportHeight: number,
): number {
  const centerX = viewportWidth + geometry.centerOffsetX
  const centerY = viewportHeight / 2
  return Math.atan2(clientY - centerY, clientX - centerX) / DEG
}

/** SVG path for an arc of the dial circle, centred on the focus point. */
export function arcPath(spreadDeg: number, radius: number, pad: number): string {
  const cx = radius + pad
  const cy = radius + pad
  const from = (180 - spreadDeg) * DEG
  const to = (180 + spreadDeg) * DEG
  const x1 = cx + radius * Math.cos(from)
  const y1 = cy + radius * Math.sin(from)
  const x2 = cx + radius * Math.cos(to)
  const y2 = cy + radius * Math.sin(to)
  const largeArc = spreadDeg * 2 > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
}

/**
 * Visual weight by distance (in steps) from the focus point. At rest the
 * integer distances land on 1 / 0.6 / 0.28 / 0 — five perceivable labels and
 * a sixth at zero. The continuous form means items fade in and out of the
 * window while turning rather than popping.
 */
export function weightForOffset(distance: number, flat: boolean) {
  const opacity =
    distance <= 1
      ? 1 - 0.4 * distance
      : distance <= 2
        ? 0.6 - 0.32 * (distance - 1)
        : Math.max(0, 0.28 * (1 - (distance - 2) / 0.6))

  // Reduced motion drops the depth cues but keeps the hierarchy: a static
  // blur or scale isn't covered by the global animation kill-switch.
  if (flat) return { opacity, scale: 1, blur: 0 }

  return {
    opacity,
    scale: 1 - 0.12 * Math.min(distance, 2.2),
    blur: distance <= 1 ? 0.4 * distance : Math.min(1.4, 0.4 + 0.7 * (distance - 1)),
  }
}

function readViewport() {
  if (typeof window === 'undefined') return { width: 1280, height: 800 }
  return { width: document.documentElement.clientWidth, height: window.innerHeight }
}

/**
 * Viewport size, sampled on resize only — never per frame. Geometry itself is
 * derived with `computeDialGeometry`, which is pure, so callers can cheaply
 * ask for either the collapsed or the expanded circle.
 */
export function useViewportSize(): { width: number; height: number } {
  const [viewport, setViewport] = useState(readViewport)

  useEffect(() => {
    const handleResize = () => setViewport(readViewport())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewport
}
