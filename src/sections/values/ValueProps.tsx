import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { valueProps } from '../../data/values'

/**
 * The conditions under which building beats buying. Deliberately opens by
 * conceding the general case: a reader who recognises none of these should not
 * be commissioning custom software, and saying so is what makes the list
 * credible to one who recognises several.
 */
export function ValueProps() {
  return (
    <Section id="why-us" labelledBy="why-us-title" tone="muted">
      <Container>
        <SectionHeading
          id="why-us-title"
          eyebrow="When custom makes sense"
          title="Most organisations should buy their software"
          description="Off-the-shelf products are cheaper, faster and better supported than anything built from scratch, and for most work they are the right answer. A custom system earns its cost in the cases below, where the gap between the product and the process has stopped being worth working around."
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