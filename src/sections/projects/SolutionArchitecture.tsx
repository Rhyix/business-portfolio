import { ChapterReveal } from '../../components/ui/ChapterReveal'
import { Rail } from '../../components/ui/Rail'
import { Reveal } from '../../components/ui/Reveal'
import { flagship, platformHalves, specialistSystems } from '../../data/solutionFamily'
import { FlagshipRoot } from './FlagshipRoot'
import { SolutionSystem } from './SolutionSystem'

interface TierHeadingProps {
  id: string
  label: string
  note: string
}

/** Caption rule introducing a tier — a labelled hairline, not a competing heading. */
function TierHeading({ id, label, note }: TierHeadingProps) {
  return (
    <div className="flex items-center gap-4">
      <p id={id} className="label-mono shrink-0 font-medium text-ink-900">
        {label}
      </p>
      <span aria-hidden="true" className="h-px flex-1 bg-ink-200" />
      <p className="label-mono shrink-0 text-ink-400">{note}</p>
    </div>
  )
}

/**
 * Descending connector between the root and a tier. Purely structural — the
 * relationship it illustrates is stated in words in every panel below it.
 */
function Descender() {
  return (
    <div aria-hidden="true" className="flex justify-center py-8 sm:py-10">
      <span className="relative block h-10 sm:h-14">
        <Rail orientation="vertical" className="h-full" />
        <span className="absolute -bottom-1 -left-[3px] size-1.5 rounded-full bg-accent-500 ring-4 ring-white" />
      </span>
    </div>
  )
}

/**
 * The seven systems drawn as one architecture rather than listed as seven
 * products: the platform at the root, the two systems whose modules it wholly
 * contains, then the four that each take one of its modules further.
 *
 * The grouping is computed in src/data/solutionFamily.ts from the demos' own
 * navigation manifests, so this component never asserts a relationship — it
 * renders whatever the applications currently say about themselves.
 */
export function SolutionArchitecture() {
  return (
    <div className="mt-14">
      <ChapterReveal step={3}>
        <FlagshipRoot />
      </ChapterReveal>

      <Descender />

      <section aria-labelledby="solutions-halves">
        <Reveal>
          <TierHeading
            id="solutions-halves"
            label="The platform, split"
            note={`${platformHalves.length} systems`}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-500">
            Every module in these two systems also runs inside {flagship.title} — together they are
            its operations half and its people half. Each one stands on its own when a business only
            needs that side.
          </p>
        </Reveal>

        <ul className="mt-8 grid gap-5 lg:grid-cols-2">
          {platformHalves.map((system, index) => (
            <li key={system.id}>
              <Reveal delay={index * 0.06} className="h-full">
                <SolutionSystem system={system} index={index + 1} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <Descender />

      <section aria-labelledby="solutions-specialists">
        <Reveal>
          <TierHeading
            id="solutions-specialists"
            label="Specialist depth"
            note={`${specialistSystems.length} systems`}
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-500">
            Each of these takes a single module the platform exposes and opens it into a system of
            its own — the same ground, examined much more closely.
          </p>
        </Reveal>

        {/* Four-up from lg, where the halves above settle into two columns — if
            both tiers used two columns at the same width the derivation would
            read as one flat list of six at exactly that breakpoint. */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specialistSystems.map((system, index) => (
            <li key={system.id}>
              <Reveal delay={(index % 4) * 0.05} className="h-full">
                <SolutionSystem system={system} index={platformHalves.length + index + 1} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
