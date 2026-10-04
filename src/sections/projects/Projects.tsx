import { useReducedMotion } from 'motion/react'
import { Container } from '../../components/ui/Container'
import { SceneSequence } from '../../components/ui/SceneSequence'
import type { SceneSpec } from '../../components/ui/SceneSequence'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { sectionIndexLabel } from '../../data/sectionRail'
import { solutionLabel } from '../../data/projects'
import { specialistSystems } from '../../data/solutionFamily'
import { useMediaQuery } from '../../lib/hooks'
import { SolutionArchitecture } from './SolutionArchitecture'
import { FamilyScene, PlatformScene, SpecialistsScene, SplitScene } from './SolutionScenes'

/** Pinning needs a wide viewport and enough height for the specialist scene. */
const PINNED_QUERY = '(min-width: 1024px) and (min-height: 680px)'

/** The architecture told in four beats; scroll steps through the specialists one at a time. */
const scenes: SceneSpec[] = [
  { label: 'Platform', weight: 1.2 },
  { label: 'Split', weight: 1.2 },
  { label: 'Specialists', weight: 3.2, steps: specialistSystems.length },
  { label: 'All seven', weight: 1.4 },
]

const sceneViews = [PlatformScene, SplitScene, SpecialistsScene, FamilyScene]

/**
 * The seven systems, presented as one architecture rather than a card grid:
 * the flagship platform at the root, the two systems it wholly contains, and
 * the four that each take one of its modules further.
 *
 * The flagship's own showcase stays in the #platform chapter above — this
 * section explains how the seven relate, not what the platform is.
 */
export function Projects() {
  const prefersReducedMotion = useReducedMotion()
  const wide = useMediaQuery(PINNED_QUERY)

  if (wide && !prefersReducedMotion) {
    return (
      <SceneSequence
        id="solutions"
        labelledBy="solutions-title"
        scenes={scenes}
        renderScene={(index, state) => {
          const View = sceneViews[index]
          return <View state={state} />
        }}
      />
    )
  }

  return (
    <Section id="solutions" labelledBy="solutions-title">
      <Container>
        <SectionHeading
          id="solutions-title"
          eyebrow="Solutions"
          index={sectionIndexLabel('solutions')}
          title="Seven systems, one architecture"
          description={`Each system below is a ${solutionLabel.toLowerCase()} you can open and use — a demonstration of what we build, not a delivered client deployment. The modules listed are the ones each system actually ships, and the records inside them are fictional.`}
        />

        <SolutionArchitecture />
      </Container>
    </Section>
  )
}
