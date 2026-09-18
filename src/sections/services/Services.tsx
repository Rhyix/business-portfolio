import { ArrowRight } from 'lucide-react'
import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { services } from '../../data/services'
import { ServiceCard } from './ServiceCard'

/** Services offered by the business, rendered from src/data/services.ts. */
export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <Container>
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="Software services built around the way you work"
          description="From a first working version to a system your team relies on daily, we cover the build, the data behind it and the support that follows."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.title} className="h-full">
              <Reveal delay={(index % 4) * 0.05} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
          {/* Keeps the grid even (7 services + this cell = 8) and gives visitors with an
              unlisted need a direct path forward — a navigation affordance, not a claim. */}
          <li className="h-full">
            <Reveal delay={(services.length % 4) * 0.05} className="h-full">
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
                  Start a project
                  <ArrowRight
                    className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </Reveal>
          </li>
        </ul>
      </Container>
    </Section>
  )
}