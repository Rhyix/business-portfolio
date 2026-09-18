import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Tag } from '../../components/ui/Tag'
import { technologyGroups } from '../../data/technologies'

/** Technology stack, grouped by layer — the dark substrate that opens the closing chapter. */
export function Technology() {
  return (
    <Section id="technology" labelledBy="technology-title" tone="dark" seam={false}>
      <Container>
        <SectionHeading
          id="technology-title"
          eyebrow="Technology"
          title="A focused, dependable technology stack"
          description="We work with tools that are widely supported, well documented and straightforward to hand over, extend or host on infrastructure you control."
          tone="dark"
        />

        <ul className="mt-14 grid divide-y divide-ink-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {technologyGroups.map((group, index) => (
            <li key={group.title} className="py-6 first:pt-0 last:pb-0 sm:px-6 sm:py-0 lg:px-8">
              <Reveal delay={index * 0.05}>
                <span className="label-mono text-ink-400">{String(index + 1).padStart(2, '0')}</span>
                <IconFrame icon={group.icon} shape="square" tone="dark" className="mt-4" />
                <h3 className="mt-5 text-base font-semibold text-white">{group.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{group.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.technologies.map((technology) => (
                    <li key={technology}>
                      <Tag tone="dark">{technology}</Tag>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
