import { Container } from '../../components/ui/Container'
import { cardHoverClassName } from '../../components/ui/cardStyles'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { cn } from '../../lib/cn'
import { solutions } from '../../data/projects'
import { ProjectCard } from './ProjectCard'

/** Every solution except the flagship platform, which already has its own showcase section above. */
const otherSolutions = solutions.filter((solution) => !solution.featured)

/** Representative system types, clearly labelled as sample solutions — a hairline index rather than a card grid. */
export function Projects() {
  return (
    <Section id="solutions" labelledBy="solutions-title">
      <Container>
        <SectionHeading
          id="solutions-title"
          eyebrow="Solutions"
          title="Systems we can design and build for your organisation"
          description="Representative examples that show the scope of a typical build. Every card is marked as a sample solution — these illustrate what we develop, they are not delivered client case studies."
        />

        <ul className="mt-14 grid gap-x-0 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:divide-x lg:divide-ink-200">
          {otherSolutions.map((solution, index) => (
            <li
              key={solution.id}
              className={cn('group h-full border-t border-ink-200 pt-6 lg:px-6', cardHoverClassName('cell'))}
            >
              <Reveal delay={(index % 3) * 0.06} className="h-full">
                <ProjectCard solution={solution} index={index} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
