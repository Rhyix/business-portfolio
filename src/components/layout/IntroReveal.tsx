import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { animate, m, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { company } from '../../data/company'
import { EASE_OUT_EXPO } from '../../lib/motion'

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
/** How long the zoom runs once the visitor asks for it, in seconds. */
const ZOOM_DURATION = 1

/**
 * Vertical space the copy under the mark needs: the 36px gap, the block
 * itself, and a margin clear of browser chrome and the home indicator.
 *
 * The composition was previously positioned from the viewport's midpoint
 * alone, and the mark sized from width alone, so neither knew anything about
 * height. In landscape that left the copy 2px from the bottom edge on a
 * 812x375 phone — clipped once real browser chrome is involved.
 */
const COPY_RESERVE = 230

/**
 * The intro is a desktop moment. Below this the page opens straight onto the
 * hero — the same line the System Dial and the pinned sections use, so the
 * desktop experience stays one coherent set rather than a patchwork.
 *
 * Read once, at mount, alongside the scroll and hash checks below. Resizing
 * across the breakpoint mid-visit is not worth a subscription: by then the
 * intro has either finished or was never going to run.
 */
const DESKTOP_QUERY = '(min-width: 1024px)'

/** Keys that mean "move the page" and so mean "open the intro". */
const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'])

/**
 * Opening sequence for the home page. The page starts behind a dark ground
 * with the AETEX wordmark at its centre; the first scroll zooms into the
 * wordmark, whose letters become a window onto the hero, until a single
 * stroke fills the screen. The dark ground stays fully opaque throughout.
 * The page is kept inert until then, so nothing of it can be reached before
 * it is unmasked.
 *
 * The zoom is a one-second animation triggered by the first scroll, not a
 * scrub tied to scroll position. It used to be the latter, over 1.3 viewports
 * of its own scroll track, which meant re-rasterising a full-viewport two-layer
 * mask on every frame the visitor scrolled — the most expensive thing on the
 * site, running while they were trying to move the page, as their first
 * impression of it. Scroll intent is now swallowed rather than measured, so
 * the sequence costs one short animation and the document loses the 1.3
 * viewports it used to reserve.
 *
 * Plays on desktop, from the top of the page only. Phones and tablets,
 * reduced motion, or arriving already scrolled or at an anchor, render the
 * page as it is.
 */
export function IntroReveal({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion()
  const [done, setDone] = useState(
    () =>
      typeof window === 'undefined' ||
      !window.matchMedia(DESKTOP_QUERY).matches ||
      window.scrollY > 0 ||
      window.location.hash !== '',
  )
  const finish = useCallback(() => setDone(true), [])
  const playing = !done && !prefersReducedMotion

  return (
    <>
      <div inert={playing}>{children}</div>
      {playing ? <IntroOverlay onDone={finish} /> : null}
    </>
  )
}

function IntroOverlay({ onDone }: { onDone: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(0)
  const [opening, setOpening] = useState(false)

  /**
   * The box this is drawn in, measured rather than inferred.
   *
   * It used to come from `window.innerHeight`, which is the *visual*
   * viewport — on a phone that shrinks by the height of the URL bar. A
   * `position: fixed` element resolves against the *layout* viewport, which
   * does not. The composition was therefore laid out for a box up to ~100px
   * shorter than the one it occupied, sitting high in the frame, and shifting
   * again whenever the browser collapsed its chrome. Measuring the element
   * itself is correct whatever the browser does with its toolbars.
   */
  const [viewport, setViewport] = useState(() => ({
    width: typeof document === 'undefined' ? 1280 : document.documentElement.clientWidth,
    height: typeof document === 'undefined' ? 800 : document.documentElement.clientHeight,
  }))

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const measure = () => {
      const { width, height } = frame.getBoundingClientRect()
      setViewport((current) =>
        current.width === width && current.height === height ? current : { width, height },
      )
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  /**
   * Any attempt to move the page opens the intro, and the attempt itself is
   * swallowed. Non-passive on purpose: preventing the scroll is what keeps the
   * hero still for the second the zoom runs, without locking `overflow` and
   * taking the scrollbar — and therefore the layout — with it. These listeners
   * exist only while the overlay is mounted, and replace the `useScroll`
   * subscription this component used to hold.
   */
  useEffect(() => {
    const open = (event: Event) => {
      event.preventDefault()
      setOpening(true)
    }
    const openOnKey = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return
      // Space activates a focused button. Swallowing it here would leave the
      // prompt below unusable from the keyboard.
      if (event.target instanceof HTMLElement && event.target.closest('button')) return
      event.preventDefault()
      setOpening(true)
    }

    window.addEventListener('wheel', open, { passive: false })
    window.addEventListener('touchmove', open, { passive: false })
    window.addEventListener('keydown', openOnKey)
    return () => {
      window.removeEventListener('wheel', open)
      window.removeEventListener('touchmove', open)
      window.removeEventListener('keydown', openOnKey)
    }
  }, [])

  useEffect(() => {
    if (!opening) return
    const controls = animate(progress, 1, {
      duration: ZOOM_DURATION,
      ease: EASE_OUT_EXPO,
      onComplete: onDone,
    })
    return () => controls.stop()
  }, [opening, progress, onDone])

  const baseWidth = Math.min(560, viewport.width * 0.7)
  const baseHeight = baseWidth * LOGO_RATIO
  const pixel = baseWidth / 948
  // The stem's core starts a little above centre (the wordmark sits above its
  // tagline) and drifts to dead centre, where the end scale is computed.
  const focusX = viewport.width / 2
  // Centred when there is room, lifted just enough when there is not.
  const restFocusY = Math.max(
    16,
    Math.min(
      viewport.height / 2 - baseHeight * 0.4,
      viewport.height - COPY_RESERVE - baseHeight * (1 - FOCAL_Y),
    ),
  )
  const maxScale =
    COVER_MARGIN *
    Math.max(
      viewport.width / ((STEM.right - STEM.left) * pixel),
      viewport.height / ((STEM.bottom - STEM.top) * pixel),
    )

  // Exponential, so each slice of the run multiplies the size by the same
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
    <div ref={frameRef} className="pointer-events-none fixed inset-0 z-[70]">
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
          begins, and the letters turn into the way in.

          Laid out once at its resting size and zoomed with a transform: driving
          left/top/width/height animated four layout properties per frame. With
          the origin at the top-left corner, translate-then-scale puts the same
          box in the same place — the values below are the ones the layout
          version used. */}
      <m.img
        src={LOGO_SRC}
        alt={company.name}
        className="absolute max-w-none"
        style={{
          x: left,
          y: top,
          width: baseWidth,
          height: baseHeight,
          scale,
          transformOrigin: '0 0',
          opacity: logoOpacity,
        }}
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
