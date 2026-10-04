import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, ArrowUp, ArrowUpRight, MoveRight } from 'lucide-react'
import { m } from 'motion/react'
import type { Variants } from 'motion/react'
import type { DemoNavItem } from '../../components/demo/types'
import type { SceneState } from '../../components/ui/SceneSequence'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Link } from '../../lib/router'
import { cn } from '../../lib/cn'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { sectionIndexLabel } from '../../data/sectionRail'
import { solutionLabel } from '../../data/projects'
import { flagship, platformHalves, specialistSystems } from '../../data/solutionFamily'
import type { SolutionSystem } from '../../data/solutionFamily'
import { moduleChipClassName } from './moduleChip'

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
}
const chipStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.25 } },
  gone: {},
}
/** Chips pop in one by one, and scatter loose when the visitor scrolls on past the scene. */
const chip: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } },
  gone: (index: number) => ({
    opacity: 0,
    x: ((index * 37) % 90) - 45,
    y: ((index * 53) % 70) - 35,
    rotate: ((index * 29) % 24) - 12,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  }),
}

function sceneState({ active, offset }: SceneState): string {
  return active ? 'visible' : offset < 0 ? 'gone' : 'hidden'
}

function SceneBody({ state, children, className }: { state: SceneState; children: ReactNode; className?: string }) {
  return (
    <m.div className={className} initial="hidden" animate={sceneState(state)} variants={stagger}>
      {children}
    </m.div>
  )
}

interface TierHeadingProps {
  count: string
  label: string
  title: string
  description: string
}

function TierHeading({ count, label, title, description }: TierHeadingProps) {
  return (
    <m.div variants={rise} className="max-w-2xl">
      <p className="flex items-center gap-2.5">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
        <span aria-hidden="true" className="h-px w-10 shrink-0 bg-ink-200" />
        <span className="label-mono text-ink-400">{count}</span>
        <span className="label-mono font-medium text-accent-600">{label}</span>
      </p>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 xl:text-4xl">{title}</h3>
      <p className="mt-3 text-ink-500">{description}</p>
    </m.div>
  )
}

function Chips({ modules, highlightKeys, className }: { modules: DemoNavItem[]; highlightKeys?: ReadonlySet<string>; className?: string }) {
  return (
    <m.ul aria-hidden="true" variants={chipStagger} className={cn('flex flex-wrap gap-1.5', className)}>
      {modules.map((module, index) => {
        const Icon = module.icon
        const highlighted = highlightKeys?.has(module.key) ?? false
        return (
          <m.li key={module.key} custom={index} variants={chip} className={moduleChipClassName(highlighted)}>
            <Icon className={cn('size-3 shrink-0', highlighted ? '' : 'opacity-60')} aria-hidden="true" />
            {module.label}
          </m.li>
        )
      })}
    </m.ul>
  )
}

function OpenDemo({ system }: { system: { title: string; demoHref: string } }) {
  return (
    <Link
      to={system.demoHref}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-accent-700"
    >
      <ScrambleText text="Open demo" />
      <span className="sr-only">: {system.title}</span>
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </Link>
  )
}

/** Scene 1: the section heading and the root system with its full module surface. */
export function PlatformScene({ state }: { state: SceneState }) {
  return (
    <SceneBody state={state} className="w-full">
      <m.div variants={rise} className="max-w-2xl">
        <p className="flex items-center gap-2.5 text-accent-600">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
          <span aria-hidden="true" className="h-px w-10 shrink-0 bg-ink-200" />
          <span aria-hidden="true" className="label-mono text-ink-400">
            {sectionIndexLabel('solutions')}
          </span>
          <span className="label-mono font-medium">Solutions</span>
        </p>
        <h2 id="solutions-title" className="mt-5 text-title font-semibold text-ink-900">
          Seven systems, one architecture
        </h2>
        <p className="mt-4 text-lead text-ink-500">
          Each system below is a {solutionLabel.toLowerCase()} you can open and use — a demonstration of what we
          build, not a delivered client deployment. The modules listed are the ones each system actually ships, and
          the records inside them are fictional.
        </p>
      </m.div>

      <m.article
        variants={rise}
        className="mt-10 grid max-w-5xl grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 rounded-2xl border border-ink-200 bg-white p-8 shadow-card"
      >
        <div>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-500" />
            <span className="label-mono font-medium text-accent-600">Root system</span>
            <span aria-hidden="true" className="h-px w-8 bg-ink-200" />
            <span className="label-mono text-ink-400">{flagship.modules.length} modules</span>
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">{flagship.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">{flagship.description}</p>
          <div className="mt-6 flex items-center gap-6">
            <Link
              to={flagship.demoHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:text-accent-700"
            >
              <ScrambleText text="Open the platform demo" />
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href="#platform"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors duration-200 hover:text-ink-900"
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
              See the full platform
            </a>
          </div>
        </div>
        <div className="border-l border-ink-200/70 pl-10">
          <p className="label-mono text-ink-400">Every module in one workspace</p>
          <Chips modules={flagship.modules} className="mt-4" />
        </div>
      </m.article>
    </SceneBody>
  )
}

/** Scene 2: the platform's two halves; their chips scatter as the visitor moves on. */
export function SplitScene({ state }: { state: SceneState }) {
  return (
    <SceneBody state={state} className="w-full">
      <TierHeading
        count={`${platformHalves.length} systems`}
        label="The platform, split"
        title="Its operations half and its people half"
        description="Every module in these two systems also runs inside the platform. Each one stands on its own when a business only needs that side."
      />
      <ul className="mt-10 grid max-w-5xl grid-cols-2 gap-5">
        {platformHalves.map((system, index) => (
          <m.li key={system.id} variants={rise} className="flex flex-col rounded-xl border border-ink-200 bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="label-mono text-ink-400">{String(index + 1).padStart(2, '0')}</span>
              <span className="label-mono text-ink-400">Platform half</span>
            </div>
            <h4 className="mt-4 text-xl font-semibold text-ink-900">{system.title}</h4>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{system.description}</p>
            <p className="mt-4 text-[0.7rem] font-medium text-ink-500">
              <span className="text-accent-700">
                {system.sharedModules.length} of {system.modules.length} modules
              </span>{' '}
              also run inside the platform
            </p>
            <Chips modules={system.modules} className="mt-4" />
            <div className="mt-auto border-t border-ink-100 pt-4">
              <OpenDemo system={system} />
            </div>
          </m.li>
        ))}
      </ul>
    </SceneBody>
  )
}

interface Connector {
  path: string
  width: number
  height: number
}

/**
 * Scene 3: one specialist at a time. A curve runs from the platform module it
 * expands, in the compact platform list on the left, to the same module at the
 * head of the specialist's own list — the derivation drawn, not just stated.
 */
export function SpecialistsScene({ state }: { state: SceneState }) {
  const system = specialistSystems[Math.min(state.step, specialistSystems.length - 1)]
  const frameRef = useRef<HTMLDivElement>(null)
  const sourceRefs = useRef(new Map<string, HTMLElement>())
  const targetRef = useRef<HTMLSpanElement>(null)
  const [connector, setConnector] = useState<Connector | null>(null)
  const expandsKey = system.expands?.key
  const { active } = state

  useEffect(() => {
    const measure = () => {
      const frame = frameRef.current
      const source = expandsKey ? sourceRefs.current.get(expandsKey) : undefined
      const target = targetRef.current
      if (!frame || !source || !target) return
      const box = frame.getBoundingClientRect()
      const from = source.getBoundingClientRect()
      const to = target.getBoundingClientRect()
      const x1 = from.right - box.left
      const y1 = from.top + from.height / 2 - box.top
      const x2 = to.left - box.left
      const y2 = to.top + to.height / 2 - box.top
      const bend = Math.max(40, (x2 - x1) * 0.5)
      setConnector({
        path: `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`,
        width: box.width,
        height: box.height,
      })
    }
    if (!active) return
    // Measured a frame later so the newly keyed card has laid out, and again
    // once the scene's entrance (which moves the whole frame) has settled.
    const frameId = requestAnimationFrame(measure)
    const settleId = window.setTimeout(measure, 650)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(settleId)
      window.removeEventListener('resize', measure)
    }
  }, [expandsKey, active])

  const index = platformHalves.length + specialistSystems.indexOf(system) + 1
  const sharedKeys = new Set(system.sharedModules.map((module) => module.key))

  return (
    <SceneBody state={state} className="w-full">
      <TierHeading
        count={`${specialistSystems.length} systems`}
        label="Specialist depth"
        title="One module, opened into a system"
        description="Each of these takes a single module the platform exposes and opens it into a system of its own — the same ground, examined much more closely."
      />

      <m.div variants={rise} ref={frameRef} className="relative mt-10 grid max-w-5xl grid-cols-[15rem_minmax(0,1fr)] gap-14">
        <div className="rounded-xl border border-ink-200 bg-white p-4 shadow-soft">
          <p className="label-mono text-ink-400">Platform · {flagship.modules.length} modules</p>
          <ul aria-hidden="true" className="mt-3 flex flex-wrap gap-1.5">
            {flagship.modules.map((module) => {
              const Icon = module.icon
              const highlighted = module.key === expandsKey
              return (
                <li
                  key={module.key}
                  ref={(node) => {
                    if (node) sourceRefs.current.set(module.key, node)
                    else sourceRefs.current.delete(module.key)
                  }}
                  className={cn(moduleChipClassName(highlighted), !highlighted && 'opacity-60')}
                >
                  <Icon className="size-3 shrink-0" aria-hidden="true" />
                  {module.label}
                </li>
              )
            })}
          </ul>
        </div>

        <m.article
          key={system.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="flex flex-col rounded-xl border border-ink-200 bg-white p-7 shadow-card"
        >
          <div className="flex items-center justify-between">
            <span className="label-mono text-accent-600">{String(index).padStart(2, '0')}</span>
            <span className="label-mono text-ink-400">Specialist</span>
          </div>
          <h4 className="mt-4 text-xl font-semibold text-ink-900">{system.title}</h4>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{system.description}</p>
          {system.expands ? (
            <p className="mt-4 flex items-center gap-2 text-[0.7rem] font-medium">
              <span ref={targetRef} className={moduleChipClassName(true)}>
                <system.expands.icon className="size-3 shrink-0" aria-hidden="true" />
                {system.expands.label}
              </span>
              <MoveRight className="size-3.5 text-ink-300" aria-hidden="true" />
              <span className="text-ink-500">{system.modules.length} modules</span>
            </p>
          ) : null}
          <m.div initial="hidden" animate="visible">
            <Chips modules={system.modules} highlightKeys={sharedKeys} className="mt-4" />
          </m.div>
          <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
            <OpenDemo system={system} />
            <span className="label-mono text-ink-400">
              <span className="text-accent-600">Blue</span> = also in the platform
            </span>
          </div>
        </m.article>

        {connector ? (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={connector.width}
            height={connector.height}
          >
            <m.path
              key={connector.path}
              d={connector.path}
              fill="none"
              className="stroke-accent-500"
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            />
          </svg>
        ) : null}
      </m.div>
    </SceneBody>
  )
}

/**
 * Which half each specialist hangs from: the half that contains the module it
 * expands. A module both halves carry (Reports) goes to the lighter branch, so
 * the tree stays balanced.
 */
function branchSpecialists(): SolutionSystem[][] {
  const branches: SolutionSystem[][] = platformHalves.map(() => [])
  for (const system of specialistSystems) {
    const candidates = platformHalves
      .map((half, index) => ({ index, holds: half.modules.some((module) => module.key === system.expands?.key) }))
      .filter((entry) => entry.holds)
      .map((entry) => entry.index)
    const pool = candidates.length > 0 ? candidates : platformHalves.map((_, index) => index)
    const lightest = pool.reduce((best, index) => (branches[index].length < branches[best].length ? index : best), pool[0])
    branches[lightest].push(system)
  }
  return branches
}

const branches = branchSpecialists()

const drawDown: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.3, ease: EASE_OUT_EXPO } },
}
const drawAcross: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
}

function TreeNode({ caption, title, href, root = false }: { caption: string; title: string; href: string; root?: boolean }) {
  return (
    <m.div variants={rise}>
      <Link
        to={href}
        className={cn(
          'group block rounded-lg border px-4 py-2.5 transition-colors duration-200',
          root
            ? 'border-ink-950 bg-ink-950 text-white hover:bg-ink-900'
            : 'border-ink-200 bg-white text-ink-900 shadow-soft hover:border-ink-900',
        )}
      >
        <span className={cn('label-mono block', root ? 'text-accent-300' : 'text-ink-400')}>{caption}</span>
        <span className="mt-1.5 flex items-start gap-1 text-sm font-semibold">
          {title}
          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </span>
      </Link>
    </m.div>
  )
}

/** A branch's rails: a stem down from the parent, a bar across the children, a drop into each. */
function Branch({ children, count }: { children: ReactNode; count: number }) {
  if (count === 0) return null

  return (
    <m.div variants={stagger}>
      <m.span aria-hidden="true" variants={drawDown} className="mx-auto block h-6 w-px origin-top bg-ink-300" />
      <div className="relative">
        <m.span
          aria-hidden="true"
          variants={drawAcross}
          className="absolute top-0 h-px bg-ink-300"
          style={{ left: `${50 / count}%`, right: `${50 / count}%` }}
        />
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
          {children}
        </div>
      </div>
    </m.div>
  )
}

function Drop({ children }: { children: ReactNode }) {
  return (
    <m.div variants={stagger} className="flex flex-col">
      <m.span aria-hidden="true" variants={drawDown} className="mx-auto block h-5 w-px origin-top bg-ink-300" />
      {children}
    </m.div>
  )
}

/** Scene 4: all seven as one family tree — root, halves, then the specialists under the half they extend. */
export function FamilyScene({ state }: { state: SceneState }) {
  return (
    <SceneBody state={state} className="w-full">
      <TierHeading
        count="7 systems"
        label="All solutions"
        title="One platform, two halves, four specialists"
        description="Every system is a working demo you can open."
      />

      <m.div variants={stagger} className="mt-10 max-w-5xl">
        <div className="mx-auto w-72">
          <TreeNode caption={`Root · ${flagship.modules.length} modules`} title={flagship.title} href={flagship.demoHref} root />
        </div>
        <Branch count={platformHalves.length}>
          {platformHalves.map((half, index) => (
            <Drop key={half.id}>
              <div className="mx-auto w-64">
                <TreeNode caption="Platform half" title={half.title} href={half.demoHref} />
              </div>
              <Branch count={branches[index].length}>
                {branches[index].map((system) => (
                  <Drop key={system.id}>
                    <TreeNode caption={`From ${system.expands?.label ?? 'platform'}`} title={system.title} href={system.demoHref} />
                  </Drop>
                ))}
              </Branch>
            </Drop>
          ))}
        </Branch>
      </m.div>
    </SceneBody>
  )
}
