import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { ScrambleText } from '../ui/ScrambleText'
import { railSections } from '../../data/sectionRail'
import {
  DIAL_MIN_WIDTH,
  angleForOffset,
  arcPath,
  computeDialGeometry,
  positionForAngle,
  useViewportSize,
  weightForOffset,
} from '../../lib/dialGeometry'
import { useDialController } from '../../lib/useDialController'
import { useDarkGroundAtMiddle } from '../../lib/hooks'
import { useNavigation } from '../../lib/useNavigation'
import { cn } from '../../lib/cn'

const supportsIntersectionObserver =
  typeof window !== 'undefined' && 'IntersectionObserver' in window

const LISTBOX_ID = 'section-dial-listbox'
/** Matches the sticky header clearance already set by `scroll-padding-top: 6rem`. */
const HEADER_OFFSET = 96
const ARC_PAD = 16
/** Half-spread of the neutral guide, and of the accent arc marking the focus detent. */
const GUIDE_SPREAD_DEG = 62
const FOCUS_SPREAD_DEG = 22.5

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * The AETEX System Dial — the site's visual navigation, permanently open on
 * desktop. Its circle's centre sits outside the right edge, so only the left
 * flank shows: an arc bulging into the page with the current section at its
 * deepest point and two sections either side.
 *
 * Nothing opens or closes. Press and turn (up is forward), release to commit
 * and scroll; a press released without meaningful movement does nothing at
 * all. Below DIAL_MIN_WIDTH there is no room for the instrument, so a passive
 * indicator tracks position instead and the drawer remains the navigation.
 * The conventional section list lives in SiteLayout for keyboard use.
 */
export function SectionDial() {
  if (!supportsIntersectionObserver) return null
  return <SectionDialInner />
}

function SectionDialInner() {
  // Section progress lives in NavigationProvider — one observer for the page,
  // and one source of truth for which way the visitor is travelling.
  const navigation = useNavigation()
  const activeIndex = navigation?.activeIndex ?? 0
  const dark = useDarkGroundAtMiddle()
  const prefersReducedMotion = useReducedMotion()

  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const hasTurnedRef = useRef(false)
  const [hintElapsed, setHintElapsed] = useState(false)
  const [hasTurned, setHasTurned] = useState(false)
  const total = railSections.length

  const viewport = useViewportSize()
  const geometry = computeDialGeometry(viewport.width, viewport.height)
  // Below this the instrument has no room; a passive indicator stands in.
  const showInstrument = viewport.width >= DIAL_MIN_WIDTH

  const applyFloat = useCallback(
    (float: number, animate: boolean) => {
      // A live turn is the only caller that suppresses the transition, so this
      // fires exactly once, the first time the visitor actually moves the dial.
      if (!animate && !hasTurnedRef.current) {
        hasTurnedRef.current = true
        setHasTurned(true)
      }

      for (let index = 0; index < total; index += 1) {
        const element = itemRefs.current[index]
        if (!element) continue

        const offset = index - float
        const { x, y } = positionForAngle(angleForOffset(offset), geometry)
        const weight = weightForOffset(Math.abs(offset), prefersReducedMotion === true)

        element.style.transitionDuration = animate ? '' : '0s'
        element.style.transform = `translate(${x}px, ${y}px) translate(-100%, -50%) scale(${weight.scale})`
        element.style.opacity = String(weight.opacity)
        element.style.filter = weight.blur > 0 ? `blur(${weight.blur}px)` : 'none'
      }
    },
    [total, prefersReducedMotion, geometry],
  )

  const handleCommit = useCallback(
    (index: number) => {
      const target = document.getElementById(railSections[index].id)
      if (!target) return
      // Tell the page this was a deliberate move, and which way — that is what
      // upgrades the destination's entrance and lets it replay.
      navigation?.notifyDialCommit(index)
      // Computed rather than scrollIntoView: the offset is explicit, and it
      // doesn't depend on scroll-margin being honoured by the engine.
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({
        top: Math.max(0, top),
        // "instant" rather than "auto": the page sets `scroll-behavior: smooth`
        // globally, which would otherwise animate the reduced-motion path too.
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
      })
    },
    [prefersReducedMotion, navigation],
  )

  const { mode, selectedIndex, surfaceProps, onKeyDown } = useDialController({
    itemCount: total,
    activeIndex,
    geometry,
    onFloatChange: applyFloat,
    onCommit: handleCommit,
  })

  const scrubbing = mode === 'scrubbing'

  // Every position is written here rather than rendered, so a turn never
  // re-renders the tree and React can't fight the imperative writes.
  useLayoutEffect(() => {
    applyFloat(selectedIndex, !scrubbing)
  }, [applyFloat, selectedIndex, scrubbing])

  // Press-and-hold has no inherent affordance, so name the gesture once,
  // shortly after the dial has settled into view.
  useEffect(() => {
    const timer = window.setTimeout(() => setHintElapsed(true), 2500)
    return () => window.clearTimeout(timer)
  }, [])

  // Lets the Hero's system map step back while the instrument is in use,
  // without threading state through the page.
  useEffect(() => {
    document.documentElement.dataset.dialMode = mode
    return () => {
      delete document.documentElement.dataset.dialMode
    }
  }, [mode])

  // Publishes which section is the current system state, so sections can
  // de-emphasise when they stop being it — a CSS-only relationship that costs
  // one attribute write per section change and no page re-render.
  useEffect(() => {
    document.documentElement.dataset.activeSection = railSections[activeIndex]?.id ?? ''
    return () => {
      delete document.documentElement.dataset.activeSection
    }
  }, [activeIndex])

  const svgSize = (geometry.radius + ARC_PAD) * 2
  const svgLeft = geometry.centerOffsetX - geometry.radius - ARC_PAD
  // Arc length = θ·r, so the sweep animation knows how far to travel.
  const focusArcLength = Math.round(((FOCUS_SPREAD_DEG * 2 * Math.PI) / 180) * geometry.radius)

  if (!showInstrument) {
    return <CompactIndicator activeIndex={activeIndex} total={total} dark={dark} />
  }

  return (
    <div
      data-tone={dark ? 'dark' : undefined}
      data-mode={mode}
      className="group/dial pointer-events-none fixed inset-y-0 right-0 z-30 w-0"
    >
      {/* Scrim — only while the dial is being turned. Content is held clear of
          the instrument by Container's reserved gutter, so at rest there is
          nothing to veil; this only steadies the labels while they move. */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 right-0 w-[19rem] transition-opacity duration-300 ease-out-expo',
          scrubbing ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          background: dark
            ? 'linear-gradient(to right, rgba(11,14,18,0), rgba(11,14,18,0.82) 55%, rgba(11,14,18,0.92))'
            : 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.84) 55%, rgba(255,255,255,0.94))',
        }}
      />

      {/* The instrument's fixed bezel: a neutral guide plus an accent arc over
          the focus detent. It does not rotate — the dial face does. */}
      <svg
        aria-hidden="true"
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="absolute top-1/2 -translate-y-1/2 overflow-visible"
        style={{ left: svgLeft }}
      >
        <path
          d={arcPath(GUIDE_SPREAD_DEG, geometry.radius, ARC_PAD)}
          fill="none"
          strokeWidth={1}
          className={cn('transition-colors duration-300', dark ? 'stroke-ink-800' : 'stroke-ink-200')}
        />
        {/* Marks the focus detent. Drawn once on mount, then it simply brightens
            while the dial is turned — nothing opens, so nothing re-sweeps. */}
        <path
          d={arcPath(FOCUS_SPREAD_DEG, geometry.radius, ARC_PAD)}
          fill="none"
          strokeWidth={1.5}
          strokeDasharray={focusArcLength}
          style={{ ['--arc-length' as string]: `${focusArcLength}` }}
          className={cn(
            'arc-draw-once stroke-accent-500 transition-opacity duration-300',
            scrubbing ? 'opacity-100' : 'opacity-60',
          )}
        />
      </svg>

      {/* The pointer target, and the whole interaction: pressing it starts a
          turn immediately — there is nothing to open first. */}
      <div
        {...surfaceProps}
        className="pointer-events-auto absolute top-1/2 right-0 -translate-y-1/2 touch-none cursor-grab select-none active:cursor-grabbing"
        style={{ width: geometry.focusInset + 150, height: geometry.radius * 1.9 }}
      />

      <ul
        id={LISTBOX_ID}
        role="listbox"
        aria-label="Sections"
        aria-activedescendant={`section-dial-option-${selectedIndex}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 right-0 outline-offset-8"
      >
        {railSections.map((item, index) => {
          const isSelected = index === selectedIndex
          return (
            <li
              key={item.id}
              id={`section-dial-option-${index}`}
              role="option"
              aria-selected={isSelected}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              className="pointer-events-none absolute top-0 left-0 flex items-center gap-3 pr-3 whitespace-nowrap transition-[transform,opacity,filter] duration-[260ms] ease-out-expo"
            >
              <span
                className={cn(
                  'label-rail transition-colors duration-200',
                  isSelected
                    ? cn('font-medium', dark ? 'text-white' : 'text-ink-900')
                    : dark
                      ? 'text-ink-400'
                      : 'text-ink-500',
                )}
              >
                {isSelected && !scrubbing ? (
                  <ScrambleText key={item.id} text={item.label} duration={300} playOnMount />
                ) : (
                  item.label
                )}
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-1/2 right-0 block -translate-y-1/2 translate-x-1/2 rounded-full transition-all duration-200',
                  isSelected
                    ? cn(
                        'size-2.5 bg-accent-500 ring-1 ring-accent-500/30 ring-offset-4',
                        dark ? 'ring-offset-ink-975' : 'ring-offset-white',
                      )
                    : cn('size-1.5', dark ? 'bg-ink-600' : 'bg-ink-300'),
                )}
              />
            </li>
          )
        })}
      </ul>

      {/* Position readout, pinned below the arc. Decorative — the listbox
          already carries the same information for assistive tech. */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 right-2 flex flex-col items-center gap-1"
        style={{ marginTop: geometry.radius * 0.78 }}
      >
        <span className={cn('label-rail leading-none', dark ? 'text-ink-400' : 'text-ink-500')}>
          {pad(selectedIndex + 1)}
        </span>
        <span className={cn('block h-px w-3', dark ? 'bg-ink-700' : 'bg-ink-300')} />
        <span className={cn('label-rail leading-none', dark ? 'text-ink-600' : 'text-ink-400')}>
          {pad(total)}
        </span>
      </span>

      {/* Press-and-hold has no affordance of its own, so name the gesture — on
          hover, and once unprompted shortly after the dial settles in. Both
          stop for good the first time the visitor actually turns it. */}
      <span
        aria-hidden="true"
        className={cn(
          'label-rail pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-md border px-2 py-1 whitespace-nowrap backdrop-blur-sm transition-opacity duration-300 ease-out-expo',
          dark ? 'border-ink-800 bg-ink-975/85 text-ink-400' : 'border-ink-200 bg-white/85 text-ink-500',
          scrubbing || hasTurned
            ? 'opacity-0'
            : hintElapsed
              ? 'opacity-100'
              : 'opacity-0 group-hover/dial:opacity-100',
        )}
        style={{ right: geometry.focusInset + 24, marginTop: geometry.radius * 0.5 }}
      >
        Hold &amp; turn
      </span>
    </div>
  )
}

/**
 * Sub-desktop stand-in: the dial's position readout without the instrument.
 * Deliberately inert — no drag surface means no `touch-action` patch at the
 * screen edge to interfere with scrolling, and the drawer is the navigation.
 */
function CompactIndicator({
  activeIndex,
  total,
  dark,
}: {
  activeIndex: number
  total: number
  dark: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 right-1.5 z-30 flex -translate-y-1/2 flex-col items-center gap-2"
    >
      <span
        className={cn(
          'block size-2.5 rounded-full bg-accent-500 ring-1 ring-accent-500/30 ring-offset-4',
          dark ? 'ring-offset-ink-975' : 'ring-offset-white',
        )}
      />
      <span className={cn('label-rail leading-none', dark ? 'text-ink-400' : 'text-ink-500')}>
        {pad(activeIndex + 1)}
      </span>
      <span className={cn('block h-px w-3', dark ? 'bg-ink-700' : 'bg-ink-300')} />
      <span className={cn('label-rail leading-none', dark ? 'text-ink-600' : 'text-ink-400')}>
        {pad(total)}
      </span>
    </div>
  )
}
