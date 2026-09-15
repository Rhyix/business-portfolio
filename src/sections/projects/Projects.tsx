import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { solutions } from '../../data/projects'
import { ProjectCard } from './ProjectCard'

/** Representative system types, clearly labelled as sample solutions. */
export function Projects() {
  return (
    <Section
      id="solutions"
      labelledBy="solutions-title"
      className="border-y border-ink-200/70 bg-ink-50/50"
    >
      <Container>
        <SectionHeading
          id="solutions-title"
          eyebrow="Solutions"
          title="Systems we can design and build for your organisation"
          description="Representative examples that show the scope of a typical build. Every card is marked as a sample solution — these illustrate what we develop, they are not delivered client case studies."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <li key={solution.id} className="h-full">
              <Reveal delay={(index % 3) * 0.06} className="h-full">
                <ProjectCard solution={solution} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}