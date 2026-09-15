import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { aboutFocusAreas } from '../../data/about'

/** Who we are and how we work. No invented history, clients or figures. */
export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="about-title"
              eyebrow="About"
              title="A development team focused on practical software"
              description="We build web-based systems for organisations that need software shaped around their own processes instead of a product they have to adapt to."
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500">
              That means starting with how work actually gets done — the approvals, the exceptions,
              the spreadsheets holding it together — then designing, building and supporting a system
              that fits. We keep the scope honest, the interface clear and the code something your
              team can maintain later.
            </p>
            <Button href="#contact" variant="secondary" className="mt-8">
              Start a Project
            </Button>
          </div>

          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {aboutFocusAreas.map((area, index) => (
              <li key={area.title}>
                <Reveal delay={index * 0.05}>
                  <IconFrame icon={area.icon} />
                  <h3 className="mt-5 text-base font-semibold text-ink-900">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{area.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}