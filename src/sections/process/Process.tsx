import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { RollingText } from '../../components/ui/RollingText'
import { SceneSequence } from '../../components/ui/SceneSequence'
import type { SceneSpec, SceneState } from '../../components/ui/SceneSequence'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { processSteps } from '../../data/process'
import { sectionIndexLabel } from '../../data/sectionRail'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../lib/hooks'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { ProcessStep } from './ProcessStep'

/** Pinning needs a wide viewport and enough height for the oversized phase number. */
const PINNED_QUERY = '(min-width: 1024px) and (min-height: 640px)'

const TITLE = 'How a project runs, from first conversation to launch'
const DESCRIPTION =
  'A defined sequence with checkpoints along the way, so you always know what is happening, what is next and what is expected from both sides.'

/** One scene; scroll steps through the six phases inside it. */
const scenes: SceneSpec[] = [{ label: 'Process', weight: processSteps.length * 0.8, steps: processSteps.length }]

const pad = (value: number) => String(value).padStart(2, '0')

/** Six-phase development process. */
export function Process() {
  const prefersReducedMotion = useReducedMotion()
  const wide = useMediaQuery(PINNED_QUERY)

  if (wide && !prefersReducedMotion) {
    return (
      <SceneSequence
        id="process"
        labelledBy="process-title"
        scenes={scenes}
        progress={false}
        renderScene={(_, state) => <ProcessScene state={state} />}
      />
    )
  }

  return (
    <Section id="process" labelledBy="process-title">
      <Container>
        <SectionHeading
          id="process-title"
          eyebrow="Process"
          index={sectionIndexLabel('process')}
          title={TITLE}
          description={DESCRIPTION}
        />

        <ol className="mt-14 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-ink-200">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={(index % 3) * 0.05}>
                <ProcessStep step={step} index={index} />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

/**
 * Wide screens: the section pins and scroll walks the six phases. The phase
 * number and title roll like an odometer from one phase to the next, the
 * description cross-fades, and a marker slides along the phase rail below.
 */
function ProcessScene({ state }: { state: SceneState }) {
  const { active, step: current } = state
  const step = processSteps[current]
  const Icon = step.icon

  return (
    <div className="flex h-full w-full flex-col justify-between py-4">
      <SectionHeading
        id="process-title"
        eyebrow="Process"
        index={sectionIndexLabel('process')}
        title={TITLE}
        description={DESCRIPTION}
      />

      <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-end gap-12">
        <div>
          {/* Mounted only once the scene is on screen, so the first phase rolls in on arrival. */}
          <p
            aria-hidden="true"
            className={cn(
              'text-[clamp(7rem,12vw,11rem)] leading-[0.9] font-semibold tracking-[-0.06em] tabular-nums transition-colors duration-700',
              active ? 'text-ink-900' : 'text-ink-300',
            )}
          >
            {active ? <RollingText text={pad(current + 1)} stagger={0.06} /> : pad(current + 1)}
          </p>
          <p className="label-mono mt-3 text-ink-400">Of {pad(processSteps.length)}</p>
        </div>

        <div className="max-w-lg pb-6">
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={step.title}
              aria-hidden="true"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-200 bg-white text-accent-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </m.span>
          </AnimatePresence>
          <h3 className="mt-5 text-[clamp(2.5rem,4vw,3.5rem)] leading-tight font-semibold tracking-tight text-ink-900">
            {active ? <RollingText text={step.title} /> : <span className="invisible">{step.title}</span>}
          </h3>
          <div className="mt-3 min-h-[4.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={step.title}
                className="leading-relaxed text-ink-500"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              >
                {step.description}
              </m.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ol className="relative grid grid-cols-6 border-t border-ink-200 pt-3">
        <m.span
          aria-hidden="true"
          className="absolute -top-px left-0 h-0.5 w-1/6 bg-accent-500"
          initial={false}
          animate={{ x: `${current * 100}%` }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        />
        {processSteps.map((entry, index) => (
          <li
            key={entry.title}
            aria-current={index === current ? 'step' : undefined}
            className={cn(
              'label-mono transition-colors duration-300',
              index === current ? 'text-ink-900' : index < current ? 'text-ink-500' : 'text-ink-400',
            )}
          >
            {pad(index + 1)} {entry.title}
          </li>
        ))}
      </ol>
    </div>
  )
}
