import { ArrowRight } from 'lucide-react'
import { ChapterBoundary } from '../../components/ui/ChapterBoundary'
import { ChapterReveal } from '../../components/ui/ChapterReveal'
import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { sectionIndexLabel } from '../../data/sectionRail'
import { services } from '../../data/services'
import { ServiceCard } from './ServiceCard'

/** Spacing between cards in the grid's wave, as a fraction of a chapter rung. */
const GRID_RUNG = 0.6

/** Services offered by the business, rendered from src/data/services.ts. */
export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <Container>
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          index={sectionIndexLabel('services')}
          title="Software services built around the way you work"
          description="From a first working version to a system your team relies on daily, we cover the build, the data behind it and the support that follows."
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
                  <ScrambleText text="Start a project" />
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