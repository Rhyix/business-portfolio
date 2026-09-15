import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { processSteps } from '../../data/process'
import { ProcessStep } from './ProcessStep'

/** Six-phase development process shown as a connected track. */
export function Process() {
  return (
    <Section
      id="process"
      labelledBy="process-title"
      className="border-y border-ink-200/70 bg-ink-50/50"
    >
      <Container>
        <SectionHeading
          id="process-title"
          eyebrow="Process"
          title="How a project runs, from first conversation to launch"
          description="A defined sequence with checkpoints along the way, so you always know what is happening, what is next and what is expected from both sides."
        />

        <ol className="mt-14 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={(index % 3) * 0.05}>
                <ProcessStep step={step} index={index} />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}