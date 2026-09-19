import type { Variants } from 'motion/react'

/** Shared easing curve so every entrance animation feels consistent. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Named durations (seconds) so new motion work doesn't hardcode bare numbers.
 * `reveal` matches fadeInUp's existing value — kept as a named constant
 * rather than rewiring fadeInUp itself, to avoid touching its ~20 call sites.
 */
export const DURATION = {
  micro: 0.2,
  ui: 0.3,
  reveal: 0.55,
} as const

/**
 * Seconds between rungs of a chapter's entrance ladder (see <ChapterReveal />).
 * Five steps land at 0/90/180/270/360ms — slow enough to read as a sequence,
 * short enough that the whole chapter is settled before the next scroll beat.
 */
export const CHAPTER_STEP = 0.09

/**
 * Small screens get fewer moving parts rather than the same motion scaled
 * down: a tighter ladder and less travel, so a grid lands in about a third of
 * the time without losing its order.
 */
export const COMPACT_CHAPTER_STEP = 0.05
export const CHAPTER_TRAVEL = 18
export const COMPACT_CHAPTER_TRAVEL = 10

/**
 * Turning the dial is a deliberate act, so its destination gets roughly twice
 * the travel and a slightly wider ladder than a section you merely scrolled
 * past. Same language, two intensities — not two systems.
 */
export const CHAPTER_STEP_STRONG = 0.11
export const COMPACT_CHAPTER_STEP_STRONG = 0.06
export const CHAPTER_TRAVEL_STRONG = 40
export const COMPACT_CHAPTER_TRAVEL_STRONG = 20

export type TransitionDirection = 'forward' | 'backward'

/**
 * Direction-aware entrance. Moving forward through the page, content arrives
 * from below; moving backward, it arrives from above — so the motion agrees
 * with the direction the visitor travelled.
 */
export function enterFrom(
  delay = 0,
  travel = CHAPTER_TRAVEL,
  direction: TransitionDirection = 'forward',
): Variants {
  return {
    hidden: { opacity: 0, y: direction === 'forward' ? travel : -travel },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.reveal, delay, ease: EASE_OUT_EXPO },
    },
  }
}

/** Standard fade + lift entrance used by <Reveal />. */
export function fadeInUp(delay = 0, travel = CHAPTER_TRAVEL): Variants {
  return {
    hidden: { opacity: 0, y: travel },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.reveal, delay, ease: EASE_OUT_EXPO },
    },
  }
}

/** Parent variants for <RevealStagger /> — children fade in one after another. */
export function staggerContainer(staggerChildren = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  }
}

/** Child variants for <RevealStagger /> items — timing comes from the parent stagger, not a manual delay. */
export function fadeInUpItem(): Variants {
  return {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
  }
}

/** Opacity-only swap for state changes (e.g. form → success) — not a scroll-triggered section entrance. */
export function fadeSwap(): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.ui, ease: EASE_OUT_EXPO } },
    exit: { opacity: 0, transition: { duration: DURATION.ui * 0.7, ease: EASE_OUT_EXPO } },
  }
}

/** Draws a horizontal rule in from the left — pair with `origin-left`. Only ever used inside <Reveal>/<RevealStagger>, so it inherits their reduced-motion gate. */
export function drawLineX(delay = 0): Variants {
  return {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: DURATION.reveal, delay, ease: EASE_OUT_EXPO },
    },
  }
}

/** Draws a vertical rule in from the top — pair with `origin-top`. Same gating as drawLineX. */
export function drawLineY(delay = 0): Variants {
  return {
    hidden: { opacity: 0, scaleY: 0 },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: DURATION.reveal, delay, ease: EASE_OUT_EXPO },
    },
  }
}

/** A node mark settling into place at the end of its connector — pair with drawLineX/Y. */
export function popNode(delay = 0): Variants {
  return {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { opacity: 1, scale: 1, transition: { duration: DURATION.ui, delay, ease: EASE_OUT_EXPO } },
  }
}