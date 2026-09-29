import { useReducedMotion } from 'motion/react'
import { cn } from '../../lib/cn'

/**
 * The animated wordmark and the still it falls back to.
 *
 * Both numbers below are the GIF's real intrinsic size, and they are what
 * reserves the box before anything loads. A replacement clip at different
 * dimensions needs these two updated and nothing else.
 */
const GIF_SRC = '/brand/aetex-logo-ezgif.com-video-to-gif-converter.gif'
const STILL_SRC = '/brand/aetex-logo-1.png'
const GIF_WIDTH = 800
const GIF_HEIGHT = 306

/**
 * How wide the wordmark itself sits inside that box, measured from the file
 * rather than assumed: the ink spans 739 of the 800px canvas, so the rest is
 * margin baked into the clip. The still is drawn to the same fraction, which
 * is what makes the fallback land at the size the animation resolves to
 * instead of a noticeably larger one.
 */
const INK_WIDTH_PERCENT = 92.4

interface AnimatedBrandSignatureProps {
  className?: string
}

/**
 * The AETEX wordmark drawing itself in, used once as the About masthead.
 *
 * Decorative by design: About names and describes the company in real text
 * directly below, so this is `aria-hidden` rather than a second, noisier copy
 * of the same information for assistive tech.
 *
 * Three details worth knowing before changing it:
 *
 * - The clip has an opaque near-white background (rgb(254,254,254)) and no
 *   alpha, so it is composited with `mix-blend-mode: multiply`. Against
 *   About's `ink-50` ground that margin resolves to rgb(246,247,249) — one
 *   step off the surface it sits on, which is why the box is invisible. It is
 *   also why this belongs only on a light ground: on the dark sections the
 *   mark itself would be multiplied away.
 * - The still is carried as the wrapper's background rather than a second
 *   `<img>`. It shows while the 2.37MB clip is still arriving and stays put if
 *   it never does, and the opaque GIF simply covers it once painted — a
 *   fallback with no error handler and no load state.
 * - Looping is the GIF's own (`NETSCAPE2.0` loop count 0). There is no timer,
 *   no observer and no playback state here on purpose; the browser also stops
 *   animating it while it is scrolled out of view, which nothing in JS needs
 *   to arrange.
 */
export function AnimatedBrandSignature({ className }: AnimatedBrandSignatureProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={cn('aspect-[800/306] mix-blend-multiply', className)}
      style={{
        backgroundImage: `url("${STILL_SRC}")`,
        backgroundSize: `${INK_WIDTH_PERCENT}% auto`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Omitted entirely under reduced motion, so the clip is never requested
          rather than merely hidden — the still above is already in place. */}
      {!prefersReducedMotion && (
        <img
          src={GIF_SRC}
          alt=""
          width={GIF_WIDTH}
          height={GIF_HEIGHT}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="block h-auto w-full"
        />
      )}
    </div>
  )
}
