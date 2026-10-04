import { AnimatePresence, m } from 'motion/react'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO } from '../../lib/motion'

interface RollingTextProps {
  text: string
  /** Seconds between neighbouring characters, so a change ripples left to right. */
  stagger?: number
  className?: string
}

/**
 * Text that changes like an odometer: each character sits in its own clipped
 * slot, and when the text changes the old character rolls up out of the slot
 * while the new one rolls up into it. A slot whose character is unchanged
 * stays still — "01" to "02" moves only the second digit. A freshly mounted
 * instance rolls every character in, which is how callers make an entrance.
 *
 * Purely visual. The real text is rendered once for assistive tech, and the
 * moving glyphs are hidden from it.
 */
export function RollingText({ text, stagger = 0.03, className }: RollingTextProps) {
  return (
    <span className={cn('inline-flex', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {Array.from(text).map((char, index) => (
          // The slot pads below the baseline so descenders aren't clipped mid-roll.
          <span key={index} className="relative inline-block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <AnimatePresence mode="popLayout">
              <m.span
                key={char}
                className="inline-block whitespace-pre"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                exit={{ y: '-105%' }}
                transition={{ duration: 0.55, delay: index * stagger, ease: EASE_OUT_EXPO }}
              >
                {char}
              </m.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
    </span>
  )
}
