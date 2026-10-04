import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { m, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { valueProps } from '../../data/values'
import { useMediaQuery } from '../../lib/hooks'
import { cn } from '../../lib/cn'
import type { ValueProp } from '../../types/content'

/** Pinning needs width for two columns and height for the card to fit under the navbar. */
const PINNED_QUERY = '(min-width: 1024px) and (min-height: 640px)'

/** Share of the pinned scroll spent stepping through cards; the rest holds the last card while the title is corrected. */
const CARDS_SHARE = 0.82

/** Scroll distance, in vh, given to each card and to the closing correction. */
const VH_PER_CARD = 45
const VH_FOR_CORRECTION = 35

const count = valueProps.length

/**
 * The conditions under which building beats buying. Deliberately opens by
 * conceding the general case — "most organisations should buy their software"
 * — then, once the visitor has stepped through every case, strikes the claim
 * through and corrects it to "some … should build". On wide screens the
 * section pins and scroll drives a card carousel; elsewhere it is a plain grid.
 */
export function ValueProps() {
  const prefersReducedMotion = useReducedMotion()
  const wide = useMediaQuery(PINNED_QUERY)

  return wide && !prefersReducedMotion ? <PinnedValueProps /> : <StaticValueProps />
}

function Heading({ corrected }: { corrected: boolean }) {
  return (
    <SectionHeading
      id="why-us-title"
      eyebrow="When custom makes sense"
      title={
        <>
          <Correction from="Most" to="Some" active={corrected} /> organisations should{' '}
          <Correction from="buy" to="build" active={corrected} delay={250} /> their software
        </>
      }
      description="Off-the-shelf software is cheaper, faster and better supported. Build only when the gap between product and process stops being worth working around."
    />
  )
}

function PinnedValueProps() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 96px', 'end end'] })
  // Card position on a 0…count-1 scale, reaching the last card at CARDS_SHARE.
  const position = useTransform(scrollYProgress, [0, CARDS_SHARE], [0, count - 1], { clamp: true })
  const [active, setActive] = useState(0)
  const [corrected, setCorrected] = useState(false)

  useMotionValueEvent(position, 'change', (value) => setActive(Math.round(value)))
  useMotionValueEvent(scrollYProgress, 'change', (value) => setCorrected(value > (CARDS_SHARE + 1) / 2))

  return (
    <Section id="why-us" labelledBy="why-us-title" tone="muted">
      <div ref={trackRef} style={{ height: `calc(100svh - 6rem + ${count * VH_PER_CARD + VH_FOR_CORRECTION}vh)` }}>
        <div className="sticky top-24 flex h-[calc(100svh-6rem)] items-center overflow-hidden">
          <Container className="w-full">
            <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-16 xl:gap-20">
              <Heading corrected={corrected} />

              <div className="[clip-path:inset(-4rem_0)]">
                <ol className="grid max-w-md">
                  {valueProps.map((value, index) => (
                    <li
                      key={value.title}
                      className="[grid-area:1/1] transition-[transform,opacity] duration-700 ease-out-expo"
                      style={cardPlacement(index - active)}
                      aria-current={index === active ? 'step' : undefined}
                    >
                      <ValueCard value={value} index={index} active={index === active} />
                    </li>
                  ))}
                </ol>

                <Progress position={position} active={active} />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  )
}

/** Active card at rest; the next one peeks in from the right, the previous slides out left behind the column edge. */
function cardPlacement(offset: number): CSSProperties {
  return {
    transform: `translateX(calc(${offset} * (100% + 2rem))) scale(${offset === 0 ? 1 : 0.96})`,
    opacity: offset === 0 ? 1 : offset === 1 ? 0.6 : offset === -1 ? 0.25 : 0,
    pointerEvents: offset === 0 ? undefined : 'none',
  }
}

function Progress({ position, active }: { position: MotionValue<number>; active: number }) {
  return (
    <div className="mt-6 flex items-center gap-6" aria-hidden="true">
      <span className="label-mono tabular-nums text-ink-400">
        <span className="text-ink-900">{String(active + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
      </span>
      <div className="flex gap-1.5">
        {valueProps.map((value, index) => (
          <ProgressSegment key={value.title} position={position} index={index} />
        ))}
      </div>
    </div>
  )
}

/** Segment n fills as the carousel travels from card n-1 to card n, so the first is full from the start. */
function ProgressSegment({ position, index }: { position: MotionValue<number>; index: number }) {
  const fill = useTransform(position, [index - 1, index], [0, 1], { clamp: true })

  return (
    <span className="h-0.5 w-10 overflow-hidden rounded-full bg-ink-200">
      <m.span className="block h-full origin-left bg-accent-500" style={{ scaleX: fill }} />
    </span>
  )
}

function StaticValueProps() {
  const endRef = useRef<HTMLDivElement>(null)
  const corrected = useInView(endRef, { once: true, margin: '0px 0px -20% 0px' })

  return (
    <Section id="why-us" labelledBy="why-us-title" tone="muted">
      <Container>
        <Heading corrected={corrected} />

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((value, index) => (
            <li key={value.title}>
              <Reveal delay={index * 0.05} className="h-full">
                <ValueCard value={value} index={index} active />
              </Reveal>
            </li>
          ))}
        </ol>
        <div ref={endRef} aria-hidden="true" />
      </Container>
    </Section>
  )
}

function ValueCard({ value, index, active }: { value: ValueProp; index: number; active: boolean }) {
  const Icon = value.icon

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border bg-white p-7 transition-[border-color,box-shadow] duration-700 sm:p-8',
        active ? 'border-accent-200 shadow-lift' : 'border-ink-200/80 shadow-soft',
      )}
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-12 items-center justify-center rounded-xl border transition-colors duration-700',
            active ? 'border-accent-300 bg-accent-50 text-accent-600' : 'border-ink-200 bg-white text-accent-500',
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <span aria-hidden="true" className="label-mono text-ink-400">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-10 text-lg font-semibold text-ink-900 sm:mt-16 sm:text-xl">{value.title}</h3>
      <p className="mt-2 leading-relaxed text-ink-500">{value.description}</p>
    </article>
  )
}

interface CorrectionProps {
  from: string
  to: string
  active: boolean
  /** Milliseconds, so the second correction lands after the first. */
  delay?: number
}

/**
 * A word struck through with its replacement handwritten-style above it. The
 * replacement is decorative: the heading's accessible text stays the original
 * claim, and the section's content makes the counter-argument in words.
 */
function Correction({ from, to, active, delay = 0 }: CorrectionProps) {
  const timing = (extra: number) => ({ transitionDelay: active ? `${delay + extra}ms` : '0ms' })

  return (
    <span className="relative inline-block">
      <span className={cn('transition-colors duration-500', active && 'text-ink-400')} style={timing(0)}>
        {from}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute -inset-x-[0.06em] top-[56%] h-[0.055em] origin-left rounded-full bg-accent-500 transition-transform duration-500 ease-out-expo motion-reduce:transition-none',
          active ? 'scale-x-100' : 'scale-x-0',
        )}
        style={timing(0)}
      />
      <span
        aria-hidden="true"
        className={cn(
          'absolute bottom-[88%] left-0 text-[0.42em] font-medium tracking-normal whitespace-nowrap text-accent-600 transition-[opacity,transform] duration-500 ease-out-expo motion-reduce:transition-none',
          active ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
        )}
        style={timing(220)}
      >
        {to}
      </span>
    </span>
  )
}
