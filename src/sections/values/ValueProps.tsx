import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { valueProps } from '../../data/values'

/** Trust section: concise reasons to work with the business. */
export function ValueProps() {
  return (
    <Section
      id="why-us"
      labelledBy="why-us-title"
      className="border-y border-ink-200/70 bg-ink-50/50"
    >
      <Container>
        <SectionHeading
          id="why-us-title"
          eyebrow="Why work with us"
          title="A development partner focused on your requirements"
          description="Every system starts from how your organisation actually operates, then gets built with technology that stays maintainable long after launch."
        />

        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {valueProps.map((value, index) => (
            <li key={value.title}>
              <Reveal delay={index * 0.05}>
                <IconFrame icon={value.icon} />
                <h3 className="mt-5 text-base font-semibold text-ink-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{value.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}