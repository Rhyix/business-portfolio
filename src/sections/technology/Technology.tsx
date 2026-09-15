import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Tag } from '../../components/ui/Tag'
import { technologyGroups } from '../../data/technologies'

/** Technology stack, grouped by layer. */
export function Technology() {
  return (
    <Section id="technology" labelledBy="technology-title">
      <Container>
        <SectionHeading
          id="technology-title"
          eyebrow="Technology"
          title="A focused, dependable technology stack"
          description="We work with tools that are widely supported, well documented and straightforward to hand over, extend or host on infrastructure you control."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {technologyGroups.map((group, index) => (
            <li key={group.title} className="h-full">
              <Reveal delay={index * 0.05} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-ink-200/80 bg-white p-6 transition-colors duration-200 hover:border-ink-300">
                  <IconFrame icon={group.icon} />
                  <h3 className="mt-5 text-base font-semibold text-ink-900">{group.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{group.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.technologies.map((technology) => (
                      <li key={technology}>
                        <Tag>{technology}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}