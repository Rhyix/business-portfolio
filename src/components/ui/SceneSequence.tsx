import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { m, useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { Container } from './Container'
import { Section } from './Section'

export interface SceneSpec {
  /** Shown beside the progress rail while the scene is current. */
  label: string
  /** Share of the pinned scroll this scene holds, in units of VH_PER_UNIT. */
  weight: number
  /** Scroll walks through this many steps inside the scene, in equal slices. */
  steps?: number
  /** Raises the dark ground while this scene is current. */
  dark?: boolean
}

export interface SceneState {
  /** Current, and the sequence is on screen — entrance choreography keys off this. */
  active: boolean
  /** Index of the step reached inside a stepped scene; 0 otherwise. */
  step: number
  /** Negative once the visitor has scrolled past this scene, positive before it. */
  offset: number
}

/**
 * Scroll distance per unit of scene weight, in vh.
 *
 * Was 70. The pinned sequences together accounted for roughly 21 of the page's
 * 29 viewports, so most of the site was spent inside a scroll-driven sequence
 * with no ordinary scrolling between them. This shortens how long each beat is
 * held without removing a single beat.
 */
const VH_PER_UNIT = 50

interface SceneSequenceProps {
  id: string
  labelledBy: string
  scenes: readonly SceneSpec[]
  renderScene: (index: number, state: SceneState) => ReactNode
  /** False when the scenes draw their own progress, so the shared rail would repeat it. */
  progress?: boolean
}

/**
 * A pinned chapter told as a sequence of scenes. The frame sticks to the
 * viewport while scroll steps through the scenes; each slides in from the
 * right as the previous one leaves to the left, and a numbered rail at the
 * foot tracks the way through. Wide screens only — callers keep a static
 * layout for small screens and reduced motion.
 */
export function SceneSequence({ id, labelledBy, scenes, renderScene, progress = true }: SceneSequenceProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const inView = useInView(trackRef, { amount: 0.05 })
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })
  const totalUnits = scenes.reduce((sum, scene) => sum + scene.weight, 0)
  const starts = scenes.map((_, index) => scenes.slice(0, index).reduce((sum, scene) => sum + scene.weight, 0))
  const units = useTransform(scrollYProgress, (value) => value * totalUnits)
  const [scene, setScene] = useState(0)
  const [step, setStep] = useState(0)

  useMotionValueEvent(units, 'change', (value) => {
    let index = 0
    while (index < scenes.length - 1 && value >= starts[index + 1]) index += 1
    setScene(index)
    const steps = scenes[index].steps ?? 1
    const within = (value - starts[index]) / scenes[index].weight
    setStep(Math.min(steps - 1, Math.max(0, Math.floor(within * steps))))
  })

  const dark = scenes[scene].dark ?? false
  const hasDark = scenes.some((entry) => entry.dark)

  return (
    <Section id={id} labelledBy={labelledBy} size="flush">
      <div ref={trackRef} style={{ height: `calc(100svh + ${totalUnits * VH_PER_UNIT}vh)` }}>
        <div className="sticky top-0 h-svh overflow-clip bg-ink-50">
          {hasDark ? (
            // Dark ground rises for the dark scenes.
            //
            // Raised with scaleY rather than an animated height: height is a
            // layout property, and this is a full-width element. The dial's
            // dark-ground observer still measures this correctly because an
            // IntersectionObserver computes its target rect *after* transforms,
            // so a bottom-anchored scaleY(0) collapses out of the middle band
            // exactly as a zero height did. Keep the element full-height and
            // the origin at the bottom; changing either breaks that detection.
            <div
              aria-hidden="true"
              data-tone="dark"
              className="absolute inset-0 origin-bottom bg-ink-975 transition-transform duration-700 ease-out-expo"
              style={{ transform: dark ? 'scaleY(1)' : 'scaleY(0)' }}
            />
          ) : null}

          <Container className="relative flex h-full flex-col pt-24 pb-8">
            <div className="relative flex-1">
              {scenes.map((entry, index) => {
                const offset = index - scene
                return (
                  <m.div
                    key={entry.label}
                    className="absolute inset-0 flex items-center"
                    initial={false}
                    animate={{ opacity: offset === 0 ? 1 : 0, x: offset === 0 ? 0 : offset < 0 ? -96 : 96 }}
                    transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                    inert={offset !== 0}
                  >
                    {renderScene(index, { active: inView && offset === 0, step: offset === 0 ? step : 0, offset })}
                  </m.div>
                )
              })}
            </div>

            {progress ? (
              <div className="flex items-center gap-5" aria-hidden="true">
                <span className={cn('label-mono tabular-nums', dark ? 'text-ink-500' : 'text-ink-400')}>
                  <span className={dark ? 'text-white' : 'text-ink-900'}>{String(scene + 1).padStart(2, '0')}</span> /{' '}
                  {String(scenes.length).padStart(2, '0')}
                </span>
                <div className="flex gap-1.5">
                  {scenes.map((entry, index) => (
                    <SceneSegment
                      key={entry.label}
                      units={units}
                      start={starts[index]}
                      weight={entry.weight}
                      dark={dark}
                    />
                  ))}
                </div>
                <span className={cn('label-mono', dark ? 'text-ink-500' : 'text-ink-400')}>{scenes[scene].label}</span>
              </div>
            ) : null}
          </Container>
        </div>
      </div>
    </Section>
  )
}

interface SceneSegmentProps {
  units: MotionValue<number>
  start: number
  weight: number
  dark: boolean
}

function SceneSegment({ units, start, weight, dark }: SceneSegmentProps) {
  const fill = useTransform(units, [start, start + weight], [0, 1], { clamp: true })

  return (
    <span className={cn('h-0.5 w-7 overflow-hidden rounded-full', dark ? 'bg-ink-800' : 'bg-ink-200')}>
      <m.span className="block h-full origin-left bg-accent-500" style={{ scaleX: fill }} />
    </span>
  )
}
