import { Button } from '../../components/ui/Button'
import { ChapterReveal } from '../../components/ui/ChapterReveal'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { aboutFocusAreas } from '../../data/about'
import { sectionIndexLabel } from '../../data/sectionRail'

/** Who we are and how we work. No invented history, clients or figures. */
export function About() {
  return (
    <Section id="about" labelledBy="about-title" tone="muted">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-0">
          <div className="lg:pr-14">
            <SectionHeading
              id="about-title"
              eyebrow="About"
              index={sectionIndexLabel('about')}
              title="A development team focused on practical software"
            />
            <ChapterReveal step={3} className="mt-6">
              <p className="max-w-[20ch] text-title font-semibold text-ink-900">
                We build web-based systems for organisations that need software shaped around their own
                processes instead of a product they have to adapt to.
              </p>
            </ChapterReveal>
            <ChapterReveal step={4} className="mt-6">
              <p className="max-w-xl text-lead text-ink-500">
                That means starting with how work actually gets done — the approvals, the exceptions,
                the spreadsheets holding it together — then designing, building and supporting a system
                that fits. We keep the scope honest, the interface clear and the code something your
                team can maintain later.
              </p>
              <div className="mt-8 border-t border-ink-200 pt-8">
                <Button href="#contact" variant="secondary">
                  <ScrambleText text="Get in Touch" />
                </Button>
              </div>
            </ChapterReveal>
          </div>

          <div className="lg:border-l lg:border-ink-200 lg:pl-14">
            <ul className="space-y-10 border-l border-ink-200 pl-8">
              {aboutFocusAreas.map((area, index) => (
                <li key={area.title} className="relative">
                  <Reveal delay={index * 0.05}>
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-8 size-1.5 -translate-x-1/2 rounded-full bg-accent-500 ring-4 ring-ink-50"
                    />
                    <span className="label-mono text-ink-400">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-1.5 text-base font-semibold text-ink-900">{area.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{area.description}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
