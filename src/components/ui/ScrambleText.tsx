import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '../../lib/cn'

interface ScrambleTextProps {
  /** The real, final text — also the control's accessible name. */
  text: string
  /** Milliseconds for the full left-to-right resolve. Clamped to 240–800. */
  duration?: number
  /**
   * Also resolve once on mount, not only on pointer/focus. Used where the text
   * itself is what just arrived — the section rail's newly centred label —
   * so the label decodes into place instead of simply appearing.
   */
  playOnMount?: boolean
  className?: string
}

const CHARS_UPPER = 'ABCDEFGHJKLNPRSTUVXYZ'
const CHARS_LOWER = 'abcdefghknoprstuvxyz'
const CHARS_DIGIT = '0123456789'
const CHARS_SYMBOL = '#/<>*+'
const FRAME_MS = 40
const FOCUSABLE_SELECTOR = 'a, button, [tabindex]:not([tabindex="-1"])'

function scrambleChar(char: string): string {
  if (/[A-Z]/.test(char)) {
    return Math.random() < 0.12
      ? CHARS_SYMBOL[Math.floor(Math.random() * CHARS_SYMBOL.length)]
      : CHARS_UPPER[Math.floor(Math.random() * CHARS_UPPER.length)]
  }
  if (/[a-z]/.test(char)) return CHARS_LOWER[Math.floor(Math.random() * CHARS_LOWER.length)]
  if (/[0-9]/.test(char)) return CHARS_DIGIT[Math.floor(Math.random() * CHARS_DIGIT.length)]
  return char
}

function scrambleFrame(text: string, progress: number): string {
  const lockIndex = progress * text.length
  return text
    .split('')
    .map((char, index) => (index + 0.5 <= lockIndex ? char : scrambleChar(char)))
    .join('')
}

/**
 * Opt-in scramble-to-reveal label for selected interactive CTAs. Cycles a
 * restrained character set on pointer-enter/focus and progressively resolves
 * left-to-right to the real text. The real text is always what assistive
 * tech announces — see the three-layer DOM below. Not baked into Button;
 * callers wrap just the label string, e.g. `<Button><ScrambleText text="Start a Project" /><ArrowRight /></Button>`.
 */
export function ScrambleText({ text, duration = 420, playOnMount = false, className }: ScrambleTextProps) {
  const clampedDuration = Math.min(800, Math.max(240, duration))
  const prefersReducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastFrameAtRef = useRef(0)
  const [frame, setFrame] = useState<string | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const control = rootRef.current?.closest<HTMLElement>(FOCUSABLE_SELECTOR)

    const cancel = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const start = () => {
      if (rafRef.current !== null) return
      const startedAt = performance.now()
      lastFrameAtRef.current = 0

      const tick = (now: number) => {
        const elapsed = now - startedAt
        const progress = Math.min(1, elapsed / clampedDuration)

        if (now - lastFrameAtRef.current >= FRAME_MS || progress === 1) {
          lastFrameAtRef.current = now
          setFrame(progress === 1 ? null : scrambleFrame(text, progress))
        }

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          rafRef.current = null
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const settle = () => {
      cancel()
      setFrame(null)
    }

    if (playOnMount) start()

    if (!control) return cancel

    control.addEventListener('pointerenter', start)
    control.addEventListener('focus', start)
    control.addEventListener('pointerleave', settle)
    control.addEventListener('blur', settle)

    return () => {
      control.removeEventListener('pointerenter', start)
      control.removeEventListener('focus', start)
      control.removeEventListener('pointerleave', settle)
      control.removeEventListener('blur', settle)
      cancel()
    }
  }, [text, clampedDuration, prefersReducedMotion, playOnMount])

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span ref={rootRef} className={cn('relative inline-block align-baseline', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible whitespace-pre">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-pre">
        {frame ?? text}
      </span>
    </span>
  )
}
