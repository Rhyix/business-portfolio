import { ArrowUpRight, MoveRight } from 'lucide-react'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Link } from '../../lib/router'
import { cn } from '../../lib/cn'
import type { SolutionSystem as SolutionSystemData } from '../../data/solutionFamily'
import { ModuleManifest } from './ModuleManifest'

interface SolutionSystemProps {
  system: SolutionSystemData
  /** Mono index shown on the panel, matching the page's other numbered rails. */
  index: number
}

/**
 * Chip showing the one platform module a specialist system expands, drawn in
 * the platform's own accent so the borrowed module is visibly borrowed.
 */
function ExpandedFrom({ system }: { system: SolutionSystemData }) {
  if (!system.expands) return null
  const Icon = system.expands.icon

  return (
    <p className="flex flex-wrap items-center gap-2 text-[0.7rem] font-medium">
      <span className="inline-flex items-center gap-1.5 rounded-md border border-accent-200 bg-accent-50 px-2 py-1 text-accent-700">
        <Icon className="size-3 shrink-0" aria-hidden="true" />
        {system.expands.label}
      </span>
      <MoveRight
        className="size-3.5 shrink-0 text-ink-300 transition-colors duration-200 ease-out-expo group-hover:text-accent-500 group-focus-within:text-accent-500"
        aria-hidden="true"
      />
      <span className="text-ink-500">
        {system.modules.length} modules
      </span>
    </p>
  )
}

/**
 * One system in the architecture. The two tiers share this component because
 * they are the same object seen from different distances — a half carries the
 * platform's own modules, a specialist carries its own — so only the density
 * and the relationship line differ, never the design language.
 *
 * The relationship is always present as text. Hover and keyboard focus only
 * strengthen what is already readable, so nothing here is hover-only.
 */
export function SolutionSystem({ system, index }: SolutionSystemProps) {
  const isHalf = system.tier === 'half'
  const sharedKeys = new Set(system.sharedModules.map((module) => module.key))

  return (
    <article
      className={cn(
        'group flex h-full flex-col rounded-xl border border-ink-200 bg-white transition-all duration-200 ease-out-expo',
        'hover:border-ink-900 hover:shadow-card focus-within:border-ink-900 focus-within:shadow-card',
        isHalf ? 'p-6 sm:p-7' : 'p-5 sm:p-6',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="label-mono text-ink-400 transition-colors duration-200 ease-out-expo group-hover:text-accent-600 group-focus-within:text-accent-600">
          {String(index).padStart(2, '0')}
        </span>
        <span className="label-mono text-ink-400">
          {isHalf ? 'Platform half' : 'Specialist'}
        </span>
      </div>

      <h3
        className={cn(
          'mt-4 font-semibold text-ink-900',
          isHalf ? 'text-xl' : 'text-base',
        )}
      >
        {system.title}
      </h3>

      <p
        className={cn(
          'mt-2.5 leading-relaxed text-ink-500',
          isHalf ? 'text-sm' : 'text-[0.8125rem]',
        )}
      >
        {system.description}
      </p>

      <div className="mt-5">
        {isHalf ? (
          <p className="text-[0.7rem] font-medium text-ink-500">
            <span className="text-accent-700">
              {system.sharedModules.length} of {system.modules.length} modules
            </span>{' '}
            also run inside the platform
          </p>
        ) : (
          <ExpandedFrom system={system} />
        )}
      </div>

      <ModuleManifest
        modules={system.modules}
        highlightKeys={isHalf ? undefined : sharedKeys}
        collapseAfter={isHalf ? 6 : 4}
        className="mt-4"
      />

      <div className="mt-auto pt-6">
        <div className="border-t border-ink-100 pt-4">
          <Link
            to={system.demoHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-accent-700"
          >
            <ScrambleText text="Open demo" />
            <span className="sr-only">: {system.title}</span>
            <ArrowUpRight
              className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  )
}
