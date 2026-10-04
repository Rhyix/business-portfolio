import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { ChapterBoundary } from '../../components/ui/ChapterBoundary'
import { ChapterReveal } from '../../components/ui/ChapterReveal'
import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { sectionIndexLabel } from '../../data/sectionRail'
import { services } from '../../data/services'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../lib/hooks'
import { ServiceCard, ServicePanel } from './ServiceCard'

/** Spacing between cards in the grid's wave, as a fraction of a chapter rung. */
const GRID_RUNG = 0.6

/** Pinning needs a wide viewport and enough height for the panels under the heading. */
const PINNED_QUERY = '(min-width: 1024px) and (min-height: 640px)'

/** Pinned scroll spent fading the description out before the rail starts moving. */
const COLLAPSE_SCROLL = 320

const TITLE = 'Software services built around the way you work'
const DESCRIPTION =
  'From a first working version to a system your team relies on daily, we cover the build, the data behind it and the support that follows. These are the services we provide; the seven systems further down are working examples you can open and use.'
const WATERMARK = 'Build · Data · Design · Integrate · Deploy · Support · '

/** Services offered by the business, rendered from src/data/services.ts. */
export function Services() {
  const prefersReducedMotion = useReducedMotion()
  const wide = useMediaQuery(PINNED_QUERY)

  return wide && !prefersReducedMotion ? <PinnedServices /> : <GridServices />
}

interface RailMetrics {
  /** Horizontal travel that brings the last panel flush with the right margin. */
  distance: number
  /** Height the description gives back when it collapses. */
  collapse: number
  /** Right edge of the content box (inside the dial gutter), from the frame's left. */
  viewEnd: number
  railLeft: number
  panelWidth: number
  step: number
}

const EMPTY_METRICS: RailMetrics = { distance: 0, collapse: 0, viewEnd: 0, railLeft: 0, panelWidth: 0, step: 0 }

/**
 * Wide-screen layout. An accent ground sweeps in from the lower right as the
 * section arrives, turning the heading white; the frame then pins and vertical
 * scroll drives the eight panels sideways, each tilting into place as it
 * crosses the right edge.
 */
function PinnedServices() {
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLOListElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const [pinLength, setPinLength] = useState(0)
  /** Diameter of the accent ground's circle, in px. See `groundScale`. */
  const [groundSize, setGroundSize] = useState(0)
  const metrics = useMotionValue(EMPTY_METRICS)

  useEffect(() => {
    const frame = frameRef.current
    const rail = railRef.current
    const description = descriptionRef.current
    if (!frame || !rail || !description) return

    // ResizeObserver fires once on observe, so this doubles as the initial measure.
    const observer = new ResizeObserver(() => {
      const panels = rail.children
      const first = panels[0] as HTMLElement
      const second = panels[1] as HTMLElement
      const railLeft = rail.getBoundingClientRect().left - frame.getBoundingClientRect().left
      const contentWidth = (rail.parentElement as HTMLElement).clientWidth
      const distance = Math.max(0, rail.scrollWidth - contentWidth)
      const collapse = description.offsetHeight + parseFloat(getComputedStyle(description).marginTop)

      metrics.set({
        distance,
        collapse,
        viewEnd: railLeft + contentWidth,
        railLeft,
        panelWidth: first.offsetWidth,
        step: second.offsetLeft - first.offsetLeft,
      })
      setPinLength(distance + COLLAPSE_SCROLL)

      // The ground used to be a clip-path circle sized in CSS percentages,
      // which resolve against sqrt((w² + h²) / 2). Reproducing that reference
      // here lets a plain scaled div trace exactly the radius the clip did.
      const box = frame.getBoundingClientRect()
      const reference = Math.sqrt((box.width ** 2 + box.height ** 2) / 2)
      setGroundSize(Math.ceil(reference * 3))
    })
    observer.observe(frame)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [metrics])

  // Arrival: the track's top travelling from the bottom of the viewport to the top.
  const { scrollYProgress: arrival } = useScroll({ target: trackRef, offset: ['start end', 'start start'] })
  // Pinned: the frame held while the rail travels.
  const { scrollYProgress: pinned } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })

  const collapseShare = pinLength > 0 ? COLLAPSE_SCROLL / pinLength : 0
  const collapsed = useTransform(pinned, (value) => clamp01(collapseShare > 0 ? value / collapseShare : 1))
  const travelled = useTransform(pinned, (value) => clamp01((value - collapseShare) / (1 - collapseShare)))

  // The ground is a scaled circle rather than an animated clip-path. clip-path
  // is not composited, so the old version repainted the whole viewport on every
  // frame of the arrival. `groundSize` is three times the reference the CSS
  // percentage resolved against, so scaling by the curve below traces the same
  // radius the clip traced — the curve itself is unchanged.
  const groundScale = useTransform(arrival, (value) => Math.pow(value, 1.15))
  // The watermark used to be clipped by the ground. It is white at 7% opacity,
  // invisible against the light ground either way, so it fades in with the
  // accent instead of being masked by it.
  const watermarkOpacity = useTransform(arrival, [0.25, 0.7], [0, 1])
  const leadOpacity = useTransform(collapsed, [0, 0.7], [1, 0])
  const lift = useTransform([collapsed, metrics] as MotionValue[], ([value, current]) => {
    return -(value as number) * (current as RailMetrics).collapse
  })
  const railX = useTransform([travelled, metrics] as MotionValue[], ([value, current]) => {
    return -(value as number) * (current as RailMetrics).distance
  })
  const watermarkX = useTransform(travelled, [0, 1], ['0%', '-30%'])

  // Three text colours used to be interpolated from scroll on every frame, each
  // a paint. The same crossing now happens once, at the midpoint of the old
  // 0.45–0.8 ramp, as a CSS transition.
  const [onAccent, setOnAccent] = useState(false)
  useMotionValueEvent(arrival, 'change', (value) => setOnAccent(value >= 0.62))

  const total = services.length + 1
  const [current, setCurrent] = useState(1)
  useMotionValueEvent(travelled, 'change', (value) => setCurrent(Math.round(value * (total - 1)) + 1))

  return (
    <Section id="services" labelledBy="services-title" size="flush">
      <div ref={trackRef} style={{ height: `calc(100svh + ${pinLength}px)` }}>
        <div ref={frameRef} data-tone="dark" className="sticky top-0 h-svh overflow-clip">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <m.div
              className="absolute rounded-full bg-accent-600"
              style={{
                width: groundSize,
                height: groundSize,
                left: '88%',
                top: '100%',
                marginLeft: -groundSize / 2,
                marginTop: -groundSize / 2,
                scale: groundScale,
              }}
            />
            <m.p
              className="absolute -bottom-[0.18em] left-0 text-[clamp(12rem,22vw,20rem)] leading-none font-semibold tracking-tight whitespace-nowrap text-white/[0.07] select-none"
              style={{ x: watermarkX, opacity: watermarkOpacity }}
            >
              {WATERMARK.repeat(2)}
            </m.p>
          </div>

          <Container className="relative flex h-full flex-col pt-28 pb-10">
            <div className="max-w-3xl">
              <p
                className={cn(
                  'mb-5 flex items-center gap-2.5 transition-colors duration-500 ease-out-expo',
                  onAccent ? 'text-accent-100' : 'text-accent-600',
                )}
              >
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />
                <span aria-hidden="true" className="h-px w-10 shrink-0 bg-current opacity-40" />
                <span aria-hidden="true" className="label-mono opacity-70">
                  {sectionIndexLabel('services')}
                </span>
                <span className="label-mono font-medium">Services</span>
              </p>
              <h2
                id="services-title"
                className={cn(
                  'text-title font-semibold transition-colors duration-500 ease-out-expo',
                  onAccent ? 'text-white' : 'text-ink-900',
                )}
              >
                {TITLE}
              </h2>
              <m.p
                ref={descriptionRef}
                className={cn(
                  'mt-5 max-w-2xl text-lead transition-colors duration-500 ease-out-expo',
                  onAccent ? 'text-accent-100' : 'text-ink-500',
                )}
                style={{ opacity: leadOpacity }}
              >
                {DESCRIPTION}
              </m.p>
            </div>

            <m.div className="mt-12" style={{ y: lift }}>
              <m.ol ref={railRef} className="flex w-max gap-6" style={{ x: railX }}>
                {services.map((service, index) => (
                  <RailPanel key={service.title} index={index} x={railX} metrics={metrics}>
                    <ServicePanel service={service} index={index} />
                  </RailPanel>
                ))}
                <RailPanel index={services.length} x={railX} metrics={metrics}>
                  <ContactPanel index={services.length} />
                </RailPanel>
              </m.ol>

              <div className="mt-8 flex items-center gap-6" aria-hidden="true">
                <span className="label-mono text-accent-100 tabular-nums">
                  <span className="text-white">{String(current).padStart(2, '0')}</span> /{' '}
                  {String(total).padStart(2, '0')}
                </span>
                <span className="h-px w-64 bg-white/25">
                  <m.span className="block h-full origin-left bg-white" style={{ scaleX: travelled }} />
                </span>
              </div>
            </m.div>
          </Container>
        </div>
      </div>
    </Section>
  )
}

interface RailPanelProps {
  index: number
  x: MotionValue<number>
  metrics: MotionValue<RailMetrics>
  children: ReactNode
}

/**
 * One panel on the rail. A panel crossing the frame's right edge is tilted,
 * lowered and translucent, and settles flat as it slides fully into view.
 *
 * It deliberately has no entrance of its own. Each panel used to fade and lift
 * 80px as the section arrived, on top of the arrival the whole frame was
 * already playing — the same content introduced twice, which is what made the
 * rail feel busy. The edge behaviour below stays because it says where a panel
 * sits on the rail, which is information rather than decoration.
 */
function RailPanel({ index, x, metrics, children }: RailPanelProps) {
  const inputs = [x, metrics] as MotionValue[]
  const edge = useTransform(inputs, ([xValue, current]) => {
    const { viewEnd, railLeft, panelWidth, step } = current as RailMetrics
    if (!panelWidth) return 0
    const right = railLeft + index * step + (xValue as number) + panelWidth
    return clamp01((right - viewEnd) / (panelWidth * 0.75))
  })
  const rotate = useTransform(edge, (value) => value * 4)
  const y = useTransform(edge, (value) => value * 28)
  const opacity = useTransform(edge, (value) => 1 - value * 0.45)

  return (
    <m.li
      className="h-[clamp(20rem,50svh,28rem)] w-[clamp(19rem,27vw,25rem)] shrink-0 origin-bottom-left"
      style={{ rotate, y, opacity }}
    >
      {children}
    </m.li>
  )
}

/** Closing panel: a dark call-out for needs outside the seven listed services. */
function ContactPanel({ index }: { index: number }) {
  return (
    <a
      href="#contact"
      className="group flex h-full flex-col rounded-3xl bg-ink-950 p-8 text-white shadow-lift transition-colors duration-200 hover:bg-ink-900"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="inline-flex size-14 items-center justify-center rounded-2xl bg-white/10 text-accent-300"
        >
          <ArrowRight className="size-5" strokeWidth={1.75} />
        </span>
        <span aria-hidden="true" className="label-mono text-ink-500">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-auto pt-8 text-xl font-semibold text-white">Something else in mind?</h3>
      <p className="mt-3 leading-relaxed text-ink-300">
        Most projects don&apos;t fit neatly into one category. Tell us what you&apos;re trying to build.
      </p>
      <span className="mt-6 inline-flex items-center gap-1.5 self-start rounded-full bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 group-hover:bg-accent-500">
        <ScrambleText text="Start a Project" />
        <ArrowRight
          className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </a>
  )
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/** Small screens and reduced motion: the original wave-in grid. */
function GridServices() {
  return (
    <Section id="services" labelledBy="services-title">
      <Container>
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          index={sectionIndexLabel('services')}
          title={TITLE}
          description={DESCRIPTION}
        />

      {/* The grid gets its own chapter: the section activates while these cards
          are still below the fold, so tying them to the section's own chapter
          would play the wave where nobody can see it. One boundary here also
          replaces the eight per-card observers this used to run. */}
      <ChapterBoundary>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.title} className="h-full">
              <ChapterReveal step={index * GRID_RUNG} className="h-full">
                <ServiceCard service={service} />
              </ChapterReveal>
            </li>
          ))}
          {/* Keeps the grid even (7 services + this cell = 8) and gives visitors with an
              unlisted need a direct path forward — a navigation affordance, not a claim. */}
          <li className="h-full">
            <ChapterReveal step={services.length * GRID_RUNG} className="h-full">
              <a
                href="#contact"
                className="group flex h-full flex-col justify-between rounded-2xl border border-dashed border-ink-300 bg-white p-6 transition-colors duration-200 hover:border-ink-400 hover:bg-ink-50/70 sm:p-7"
              >
                <div>
                  <IconFrame icon={ArrowRight} />
                  <h3 className="mt-5 text-base font-semibold text-ink-900">Something else in mind?</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                    Most projects don&apos;t fit neatly into one category — tell us what you&apos;re trying to build.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 group-hover:text-accent-700">
                  <ScrambleText text="Start a Project" />
                  <ArrowRight
                    className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </ChapterReveal>
          </li>
        </ul>
      </ChapterBoundary>
      </Container>
    </Section>
  )
}
