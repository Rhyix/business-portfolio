import { Container } from '../../components/ui/Container'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { sectionIndexLabel } from '../../data/sectionRail'
import { solutionLabel } from '../../data/projects'
import { SolutionArchitecture } from './SolutionArchitecture'

/**
 * The seven systems, presented as one architecture rather than a card grid:
 * the flagship platform at the root, the two systems it wholly contains, and
 * the four that each take one of its modules further.
 *
 * The flagship's own showcase stays in the #platform chapter above — this
 * section explains how the seven relate, not what the platform is.
 */
export function Projects() {
  return (
    <Section id="solutions" labelledBy="solutions-title">
      <Container>
        <SectionHeading
          id="solutions-title"
          eyebrow="Solutions"
          index={sectionIndexLabel('solutions')}
          title="Seven systems, one architecture"
          description={`Each system below is a ${solutionLabel.toLowerCase()} you can open and use — a demonstration of what we build, not a delivered client deployment. Their modules are the ones the demos actually ship.`}
        />

        <SolutionArchitecture />
      </Container>
    </Section>
  )
}
