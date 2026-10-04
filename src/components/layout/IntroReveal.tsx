import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { m, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { company } from '../../data/company'
import { useViewportSize } from '../../lib/dialGeometry'

/** White-stroke wordmark: drawn as the logo at rest, and its alpha is the window the page shows through. */
const LOGO_SRC = '/brand/aetex-logo-2.png'
const LOGO_RATIO = 200 / 948

/**
 * The zoom is anchored on the "T" stem. Measured from the file's alpha, its
 * fully opaque core runs x 474–502 and y 31–128 of the 948×200 artwork, so
 * the zoom ends once that core alone covers the viewport: the window has then
 * opened onto the whole page, and the ground never has to fade to finish.
 */
const STEM = { left: 474, right: 502, top: 31, bottom: 128 }
const FOCAL_X = (STEM.left + STEM.right) / 2 / 948
const FOCAL_Y = (STEM.top + STEM.bottom) / 2 / 200
/** Margin on the computed end scale, so the core edges sit well outside the viewport. */
const COVER_MARGIN = 1.15
/** Scroll spent on the intro, as a fraction of the viewport height. */
const INTRO_DISTANCE = 1.3

/**
 * Opening sequence for the home page. The page starts behind a dark ground
 * with the AETEX wordmark at its centre; scrolling zooms into the wordmark,
 * whose letters become a window onto the hero, until a single stroke fills
 * the screen. The dark ground stays fully opaque throughout.
 * The hero is held in place and kept inert until then, so nothing of it can
 * be seen or reached before it is unmasked.
 *
 * Plays from the top of the page only. Reduced motion, or arriving already
 * scrolled or at an anchor, renders the page as it is.
 */
export function IntroReveal({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const [done, setDone] = useState(
    () => typeof window === 'undefined' || window.scrollY > 0 || window.location.hash !== '',
  )
  // Fixed for the life of the intro, so resizing mid-zoom can't strand the scroll position.
  const [distance] = useState(() => (typeof window === 'undefined' ? 0 : Math.round(window.innerHeight * INTRO_DISTANCE)))
  const holdRef = useRef<HTMLDivElement>(null)
  const playing = !done && !prefersReducedMotion

  useLayoutEffect(() => {
    const hold = holdRef.current
    if (!hold) return
    if (playing) {
      // Pin the hero exactly where it would sit at the top of the page —
      // under the navbar — so it doesn't move while the intro scrolls past.
      hold.style.top = `${hold.getBoundingClientRect().top + window.scrollY}px`
      return
    }
    hold.style.top = ''
  }, [playing])

  // Finishing removes the intro's scroll distance from the document, so take
  // the same amount off the scroll position: the hero stays exactly in place.
  const finishedRef = useRef(false)
  useLayoutEffect(() => {
    if (!done || finishedRef.current || prefersReducedMotion) return
    finishedRef.current = true
    window.scrollTo({ top: Math.max(0, window.scrollY - distance), behavior: 'instant' })
  }, [done, distance, prefersReducedMotion])

  return (
    <>
      <div>
        <div ref={holdRef} className={playing ? 'sticky' : undefined} inert={playing}>
          {children}
        </div>
        {/* A real box rather than padding: a sticky element only travels
            within its parent's content box, which padding is not part of. */}
        {playing ? <div aria-hidden="true" style={{ height: distance }} /> : null}
      </div>
      {playing ? <IntroOverlay distance={distance} onDone={() => setDone(true)} /> : null}
    </>
  )
}

function IntroOverlay({ distance, onDone }: { distance: number; onDone: () => void }) {
  const viewport = useViewportSize()
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, [0, distance], [0, 1], { clamp: true })

  useMotionValueEvent(progress, 'change', (value) => {
    if (value >= 1) onDone()
  })

  const baseWidth = Math.min(560, viewport.width * 0.7)
  const baseHeight = baseWidth * LOGO_RATIO
  const pixel = baseWidth / 948
  // The stem's core starts a little above centre (the wordmark sits above its
  // tagline) and drifts to dead centre, where the end scale is computed.
  const focusX = viewport.width / 2
  const restFocusY = viewport.height / 2 - baseHeight * 0.4
  const maxScale =
    COVER_MARGIN *
    Math.max(
      viewport.width / ((STEM.right - STEM.left) * pixel),
      viewport.height / ((STEM.bottom - STEM.top) * pixel),
    )

  // Exponential, so each slice of scroll multiplies the size by the same
  // amount and the zoom reads as steady travel rather than a late lurch.
  const scale = useTransform(progress, (value) => Math.pow(maxScale, value))
  const focusY = useTransform(progress, (value) => restFocusY + (viewport.height / 2 - restFocusY) * value)
  const width = useTransform(scale, (value) => baseWidth * value)
  const height = useTransform(scale, (value) => baseHeight * value)
  const left = useTransform(width, (value) => focusX - FOCAL_X * value)
  const top = useTransform([height, focusY] as MotionValue<number>[], ([value, y]) => (y as number) - FOCAL_Y * (value as number))

  const maskSize = useMotionTemplate`${width}px ${height}px, 100% 100%`
  const maskPosition = useMotionTemplate`${left}px ${top}px, 0 0`
  const logoOpacity = useTransform(progress, [0, 0.12], [1, 0])
  const copyOpacity = useTransform(progress, [0, 0.08], [1, 0])

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      {/* The ground, with the wordmark cut out of it: the page shows only through the letters. */}
      <m.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-975"
        style={{
          backgroundImage: 'radial-gradient(45% 50% at 50% 42%, rgba(37, 87, 235, 0.28), rgba(11, 14, 18, 0) 70%)',
          maskImage: `url(${LOGO_SRC}), linear-gradient(#000, #000)`,
          WebkitMaskImage: `url(${LOGO_SRC}), linear-gradient(#000, #000)`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          maskSize,
          WebkitMaskSize: maskSize,
          maskPosition,
          WebkitMaskPosition: maskPosition,
        }}
      />

      {/* The wordmark itself, laid exactly over its own window, so at rest the
          logo reads as a logo and the page stays hidden. It fades as the zoom
          begins, and the letters turn into the way in. */}
      <m.img
        src={LOGO_SRC}
        alt={company.name}
        className="absolute max-w-none"
        style={{ left, top, width, height, opacity: logoOpacity }}
      />

      <m.div
        className="absolute inset-x-0 flex flex-col items-center gap-10 px-6 text-center"
        style={{ top: restFocusY + baseHeight * (1 - FOCAL_Y) + 36, opacity: copyOpacity }}
      >
        <p className="text-lead text-ink-300">Software shaped around how your business runs.</p>
        <button
          type="button"
          onClick={onDone}
          className="label-mono pointer-events-auto flex flex-col items-center gap-3 text-ink-500 transition-colors hover:text-ink-300"
        >
          Scroll
          <span aria-hidden="true" className="block h-8 w-px animate-pulse bg-current" />
          <span className="sr-only">or press to skip the intro</span>
        </button>
      </m.div>
    </div>
  )
}
