import type { Variants } from 'motion/react'

/** Shared easing curve so every entrance animation feels consistent. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Standard fade + lift entrance used by <Reveal />. */
export function fadeInUp(delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: EASE_OUT_EXPO },
    },
  }
}