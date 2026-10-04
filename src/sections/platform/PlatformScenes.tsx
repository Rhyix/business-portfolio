import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { animate, m } from 'motion/react'
import type { Variants } from 'motion/react'
import { Button } from '../../components/ui/Button'
import { buttonClassName } from '../../components/ui/buttonStyles'
import { IconFrame } from '../../components/ui/IconFrame'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Tag } from '../../components/ui/Tag'
import { Link } from '../../lib/router'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { sectionIndexLabel } from '../../data/sectionRail'
import {
  featuredPlatformHref,
  platformArchitecture,
  platformCapabilities,
  platformFlows,
  platformHighlights,
} from '../../data/platform'
import { PlatformPreview } from './PlatformPreview'
import { BASE_PREVIEW_STATS, workflowEffects } from './previewState'
import type { PreviewStats } from './previewState'

export const PLATFORM_TITLE = 'One workspace for your business, operations and people'
export const PLATFORM_DESCRIPTION =
  "The Integrated Business Management Platform is our flagship sample solution — a single workspace connecting customers, orders, inventory, workforce management and reporting. It's a demonstration built to explore, not a live client deployment."
export const SAMPLE_DATA_NOTE = 'Sample data — the figures shown are illustrative, not a real deployment'

/** Parent/child pair for a scene's content: children rise in one after another once the scene is current. */
const sceneStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const sceneItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
}

interface SceneProps {
  /** Reached step in a stepped scene; unused by the others. */
  step?: number
  active: boolean
}

function SceneHeading({ label, title, dark = false }: { label: string; title?: string; dark?: boolean }) {
  return (
    <m.div variants={sceneItem}>
      <p className={cn('flex items-center gap-2.5', dark ? 'text-accent-300' : 'text-accent-600')}>
        <span aria-hidden="true" className={cn('size-1.5 rounded-full', dark ? 'bg-accent-400' : 'bg-accent-500')} />
        <span className="label-mono font-medium">{label}</span>
      </p>
      {title ? (
        <h3 className={cn('mt-4 text-3xl font-semibold tracking-tight xl:text-4xl', dark ? 'text-white' : 'text-ink-900')}>
          {title}
        </h3>
      ) : null}
    </m.div>
  )
}

function SceneBody({ active, children, className }: SceneProps & { children: ReactNode; className?: string }) {
  return (
    <m.div className={className} initial="hidden" animate={active ? 'visible' : 'hidden'} variants={sceneStagger}>
      {children}
    </m.div>
  )
}

export function OverviewScene({ active }: SceneProps) {
  return (
    <SceneBody active={active} className="max-w-2xl">
      <m.p variants={sceneItem} className="flex items-center gap-2.5 text-accent-600">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
        <span aria-hidden="true" className="h-px w-10 shrink-0 bg-ink-200" />
        <span aria-hidden="true" className="label-mono text-ink-400">
          {sectionIndexLabel('platform')}
        </span>
        <span className="label-mono font-medium">Featured solution — interactive demo</span>
      </m.p>
      <m.h2 variants={sceneItem} id="platform-title" className="mt-5 text-headline font-semibold text-ink-900">
        {PLATFORM_TITLE}
      </m.h2>
      <m.p variants={sceneItem} className="mt-5 text-lead text-ink-500">
        {PLATFORM_DESCRIPTION}
      </m.p>
      <m.div variants={sceneItem} className="mt-9 flex items-center gap-3">
        <Link to={featuredPlatformHref} className={buttonClassName('primary', 'lg')}>
          <ScrambleText text="Explore Interactive Demo" />
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Button href="#contact" variant="secondary" size="lg">
          <ScrambleText text="Discuss a Similar System" />
        </Button>
      </m.div>
    </SceneBody>
  )
}

/** The dashboard arrives empty and counts up to its figures, so the preview reads as a live system. */
export function WorkspaceScene({ active }: SceneProps) {
  const [fill, setFill] = useState(0)

  useEffect(() => {
    if (!active) return
    const controls = animate(0, 1, { duration: 1.6, delay: 0.3, ease: EASE_OUT_EXPO, onUpdate: setFill })
    return () => controls.stop()
  }, [active])

  const stats: PreviewStats = {
    revenue: BASE_PREVIEW_STATS.revenue * fill,
    orders: BASE_PREVIEW_STATS.orders * fill,
    employees: BASE_PREVIEW_STATS.employees * fill,
    attendance: BASE_PREVIEW_STATS.attendance * fill,
  }

  return (
    <SceneBody active={active} className="w-full max-w-4xl">
      <SceneHeading label="The workspace" />
      <m.div variants={sceneItem} className="mt-6">
        <PlatformPreview reveal={false} stats={stats} growth={fill} />
      </m.div>
      <m.p variants={sceneItem} className="label-mono mt-4 flex items-center gap-2.5 text-ink-400">
        <span aria-hidden="true" className="h-px w-6 shrink-0 bg-ink-200" />
        {SAMPLE_DATA_NOTE}
      </m.p>
    </SceneBody>
  )
}

export function ModulesScene({ active }: SceneProps) {
  return (
    <SceneBody active={active} className="w-full">
      <SceneHeading label="Modules" title="Three modules, one workspace" />
      <div className="mt-10 grid grid-cols-3 divide-x divide-ink-200 border-y border-ink-200">
        {platformCapabilities.map((group, index) => (
          <m.div key={group.title} variants={sceneStagger} className="px-8 py-8 first:pl-0 last:pr-0">
            <m.div variants={sceneItem} className="flex items-center gap-3">
              <span className="label-mono text-ink-400">{String(index + 1).padStart(2, '0')}</span>
              <IconFrame icon={group.icon} size="sm" shape="square" />
            </m.div>
            <m.h4 variants={sceneItem} className="mt-4 text-lg font-semibold text-ink-900">
              {group.title}
            </m.h4>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <m.li key={item} variants={sceneItem}>
                  <Tag>{item}</Tag>
                </m.li>
              ))}
            </ul>
          </m.div>
        ))}
      </div>
    </SceneBody>
  )
}

/** `step` 0 is the resting state; 1…8 walk the order flow, then the hiring flow. */
export function WorkflowsScene({ active, step = 0 }: SceneProps) {
  const applied = workflowEffects.slice(0, step)
  const stats = applied.reduce<PreviewStats>((current, effect) => ({ ...current, ...effect.change }), BASE_PREVIEW_STATS)
  const highlight = step > 0 ? workflowEffects[step - 1].highlight : null
  const flowLength = platformFlows[0].steps.length
  const activeFlow = step === 0 ? -1 : Math.floor((step - 1) / flowLength)

  return (
    <SceneBody active={active} className="w-full">
      <SceneHeading label="Workflows" title="Connected workflows, not isolated systems" />
      <div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-12">
        <m.div variants={sceneItem} className="flex gap-10">
          {platformFlows.map((flow, flowIndex) => {
            const reached = step - flowIndex * flowLength
            const current = flowIndex === activeFlow

            return (
              <div key={flow.label} className={cn('transition-opacity duration-300', activeFlow !== -1 && !current && 'opacity-45')}>
                <p className={cn('label-mono', current ? 'text-accent-600' : 'text-ink-400')}>{flow.label}</p>
                <ol className="mt-5">
                  {flow.steps.map((label, index) => {
                    const done = reached >= index + 1
                    const isCurrent = current && reached === index + 1
                    return (
                      <li key={label} className="relative flex items-center gap-3 pb-6 last:pb-0">
                        {index < flow.steps.length - 1 ? (
                          <span
                            aria-hidden="true"
                            className={cn(
                              'absolute top-3 left-[5px] h-full w-0.5 transition-colors duration-300',
                              reached >= index + 2 ? 'bg-accent-500' : 'bg-ink-200',
                            )}
                          />
                        ) : null}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'relative size-3 shrink-0 rounded-full border-2 transition-all duration-300',
                            done ? 'border-accent-500 bg-accent-500' : 'border-ink-300 bg-ink-50',
                            isCurrent && 'ring-4 ring-accent-200',
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm whitespace-nowrap transition-colors duration-300',
                            isCurrent ? 'font-semibold text-accent-700' : done ? 'text-ink-900' : 'text-ink-500',
                          )}
                        >
                          {label}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )
          })}
        </m.div>
        <m.div variants={sceneItem} className="max-w-3xl">
          <PlatformPreview reveal={false} stats={stats} highlight={highlight} />
        </m.div>
      </div>
    </SceneBody>
  )
}

export function StructureScene({ active }: SceneProps) {
  return (
    <SceneBody active={active} className="w-full max-w-xl">
      <SceneHeading label="Architecture" title="How it's structured" dark />
      <ol className="mt-8 space-y-3">
        {platformArchitecture.map((layer, index) => (
          <m.li
            key={layer.label}
            variants={sceneItem}
            className="flex items-center gap-4 rounded-xl border border-ink-800 bg-ink-900/60 px-5 py-4"
          >
            <span className="label-mono w-6 shrink-0 text-ink-500">{String(index + 1).padStart(2, '0')}</span>
            <IconFrame icon={layer.icon} size="sm" shape="square" tone="dark" />
            <span className="text-sm font-medium text-white">{layer.label}</span>
          </m.li>
        ))}
      </ol>
    </SceneBody>
  )
}

export function BenefitsScene({ active }: SceneProps) {
  return (
    <SceneBody active={active} className="w-full">
      <SceneHeading label="Benefits" title="Why an integrated platform matters" dark />
      <ul className="mt-10 grid grid-cols-5 gap-8">
        {platformHighlights.map((highlight) => (
          <m.li key={highlight.title} variants={sceneItem}>
            <IconFrame icon={highlight.icon} size="sm" tone="dark" />
            <h4 className="mt-4 text-sm font-semibold text-white">{highlight.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">{highlight.description}</p>
          </m.li>
        ))}
      </ul>
    </SceneBody>
  )
}
