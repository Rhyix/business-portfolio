import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { ChapterReveal } from '../../components/ui/ChapterReveal'
import { Container } from '../../components/ui/Container'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { sectionIndexLabel } from '../../data/sectionRail'
import { solutions } from '../../data/projects'
import { ChapterContext, useChapterActivation, useSectionChapter } from '../../lib/chapter'
import { useNavigation } from '../../lib/useNavigation'
import { railIndexForSection } from '../../data/sectionRail'
import { cn } from '../../lib/cn'
import { SystemMap } from './SystemMap'

const heroCapabilities = [
  'Business management systems',
  'Administrative dashboards',
  'Database-driven applications',
  'Responsive web experiences',
] as const

/**
 * Counted from the solutions that actually carry a demo route, so the figure
 * quoted in the first viewport can never drift from the number of demos the
 * site ships.
 */
const interactiveSystemCount = solutions.filter((solution) => solution.demoHref).length

/** First impression: positioning statement, primary actions and product visual. */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const activated = useChapterActivation(sectionRef)
  const chapter = useSectionChapter('home', activated)
  const navigation = useNavigation()
  const isActiveSection = navigation ? navigation.activeIndex === railIndexForSection('home') : true

  return (
    <ChapterContext.Provider value={chapter}>
    <section
      ref={sectionRef}
      id="home"
      data-chapter-active={isActiveSection ? 'true' : 'false'}
      className="relative overflow-hidden border-b border-ink-200"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 h-[620px]"
          style={{
            background:
              'radial-gradient(65% 60% at 68% 12%, rgba(37, 87, 235, 0.08), rgba(255, 255, 255, 0))',
          }}
        />
        <div
          className="bg-blueprint absolute inset-0"
          style={{
            maskImage: 'radial-gradient(75% 65% at 62% 25%, #000, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(75% 65% at 62% 25%, #000, transparent 78%)',
          }}
        />
      </div>

      <Container className="relative py-16 sm:py-20 lg:pt-20 lg:pb-28">
        <ChapterReveal step={0} className="chapter-recede">
          <p className="flex items-center gap-2.5 text-accent-600">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-ink-200" />
            <span aria-hidden="true" className="label-mono text-ink-400">
              {sectionIndexLabel('home')}
            </span>
            <span className="label-mono font-medium">Custom software development</span>
          </p>
        </ChapterReveal>

        {/*
          The headline sits above the two-column split rather than inside the
          left track. In the old arrangement the track narrowed as the display
          type scaled up — 88px set in a 393–491px column — which forced six
          lines of roughly eight characters and pushed the CTAs out of the
          first viewport on every laptop width. Spanning the content width and
          capping the measure instead keeps the display scale untouched and
          resolves it to three lines. No typography token changes.
        */}
        <ChapterReveal step={1} className="chapter-recede">
          {/*
            Hero-scoped only: --text-display's clamp bottoms out at 40px, which
            on a 320px screen sets 40px type in a 280px column and wraps this
            headline to five lines. Overriding the size below 400px restores a
            usable measure; the token itself is untouched, so every other
            display-tier heading is unaffected.
          */}
          <h1 className="mt-7 max-w-4xl text-display font-semibold max-[400px]:text-[2rem]">
            Custom software solutions built for your business
          </h1>
        </ChapterReveal>

        {/*
          Top-aligned, not centred: the SystemMap column is the taller of the
          two, so centring pushed the lede and CTAs down by the difference —
          enough to drop the primary action below a 780px-tall viewport.
        */}
        <div className="mt-10 grid items-start gap-14 lg:mt-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <ChapterReveal step={2} className="chapter-recede">
              <p className="max-w-xl text-lead text-ink-500">
                We build web systems for organisations whose processes don&apos;t fit off-the-shelf
                software — business platforms, dashboards, and the databases and integrations
                behind them.
              </p>
            </ChapterReveal>

            <ChapterReveal step={3}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="#contact" size="lg">
                  <ScrambleText text="Start a Project" />
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button href="#solutions" variant="secondary" size="lg">
                  <ScrambleText text="View Solutions" />
                </Button>
              </div>

              {/*
                Third, quieter path: the demos are the site's strongest proof and
                previously went unmentioned until several viewports down. A text
                link rather than a button keeps the CTA pair unambiguous.
              */}
              <a
                href="#solutions"
                className="group mt-6 inline-flex items-center gap-2.5 text-sm text-ink-500 transition-colors duration-200 hover:text-ink-900"
              >
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
                <span className="font-semibold text-ink-900">
                  {interactiveSystemCount} interactive systems
                </span>
                {/* The rule is decorative, so without this the two halves run
                    together into "systemsExplore" in the accessible name. */}
                <span className="sr-only"> — </span>
                <span aria-hidden="true" className="h-px w-6 shrink-0 bg-ink-200" />
                <ScrambleText text="Explore the architecture" />
                <ArrowRight
                  className="size-3.5 shrink-0 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </ChapterReveal>
          </div>

          <ChapterReveal step={2}>
            <SystemMap />
          </ChapterReveal>
        </div>

        {/*
          Full width below both columns now that the headline no longer shares
          the left track — four abreast at lg reads as a spec strip closing the
          chapter rather than a list squeezed beside the diagram.
        */}
        <ChapterReveal step={4} className="chapter-recede">
          <div className="mt-14 grid grid-cols-1 border-t border-ink-200 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {heroCapabilities.map((capability, index) => (
              <div
                key={capability}
                className={cn(
                  'border-b border-ink-200 py-4',
                  // Two-up band: rule between the pair, not after the row.
                  index % 2 === 0 && 'sm:max-lg:border-r sm:max-lg:pr-6',
                  index % 2 === 1 && 'sm:max-lg:pl-6',
                  // Four-up: even gutters, flush at both outer edges.
                  'lg:px-6',
                  index === 0 && 'lg:pl-0',
                  index === heroCapabilities.length - 1 && 'lg:pr-0',
                  index < heroCapabilities.length - 1 && 'lg:border-r',
                )}
              >
                <span className="label-mono block text-ink-400">{String(index + 1).padStart(2, '0')}</span>
                <span className="mt-1.5 block text-sm font-medium text-ink-900">{capability}</span>
              </div>
            ))}
          </div>
        </ChapterReveal>
      </Container>
    </section>
    </ChapterContext.Provider>
  )
}
