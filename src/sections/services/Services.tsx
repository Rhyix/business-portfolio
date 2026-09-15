import { Container } from '../../components/ui/Container'
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

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.title} className="h-full">
              <Reveal delay={(index % 3) * 0.05} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}