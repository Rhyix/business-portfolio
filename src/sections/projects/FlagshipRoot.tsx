import { ArrowRight, ArrowUp } from 'lucide-react'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Link } from '../../lib/router'
import { flagship } from '../../data/solutionFamily'
import { ModuleManifest } from './ModuleManifest'

/**
 * The root of the architecture: the platform every other system on this page
 * is measured against.
 *
 * Deliberately not a second Featured Platform. The preview, capability groups,
 * workflow rails and architecture all live in the #platform chapter directly
 * above; repeating them one screen later would read as the page stuttering.
 * What this node adds is the thing #platform cannot show on its own — the full
 * module surface, so the relationships drawn underneath have something to point
 * at. Its weight comes from scale and position, not from more content.
 */
export function FlagshipRoot() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <div
        aria-hidden="true"
        className="bg-blueprint pointer-events-none absolute inset-0"
        style={{
          maskImage: 'radial-gradient(75% 90% at 15% 0%, #000, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(75% 90% at 15% 0%, #000, transparent 72%)',
        }}
      />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
          <span className="label-mono font-medium text-accent-600">Root system</span>
          <span aria-hidden="true" className="h-px w-8 shrink-0 bg-ink-200" />
          <span className="label-mono text-ink-400">
            {flagship.modules.length} modules · {flagship.groupLabels.join(' + ')}
          </span>
        </div>

        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div>
            <h3 className="text-title font-semibold text-ink-900">{flagship.title}</h3>
            <p className="mt-4 max-w-xl text-lead text-ink-500">{flagship.description}</p>

            <div className="mt-7 flex flex-col gap-x-6 gap-y-3 sm:flex-row sm:items-center">
              <Link
                to={flagship.demoHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:text-accent-700"
              >
                <ScrambleText text="Open the platform demo" />
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              {/* Back to the deep-dive chapter rather than restating it here. */}
              <a
                href="#platform"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors duration-200 hover:text-ink-900"
              >
                <ArrowUp className="size-3.5" aria-hidden="true" />
                See the full platform
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-ink-200/70 pt-6 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
            <p className="label-mono text-ink-400">Every module in one workspace</p>
            <ModuleManifest modules={flagship.modules} className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
