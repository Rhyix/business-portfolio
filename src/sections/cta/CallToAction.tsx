import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { company } from '../../data/company'

/** Closing call to action, presented on the dark band. */
export function CallToAction() {
  return (
    <Section id="get-started" labelledBy="cta-title" tone="dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 60% at 50% 0%, rgba(59, 118, 246, 0.22), rgba(16, 19, 24, 0))',
        }}
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionHeading
              id="cta-title"
              eyebrow="Start a project"
              title="Have an idea for a system?"
              description="Let's turn your business requirements into a working digital solution. Tell us what you need and we will outline the next steps."
              align="center"
              tone="dark"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="#contact" variant="secondary" size="lg">
                Start a Project
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <a
                href={`mailto:${company.email}`}
                className="text-sm font-medium text-ink-300 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"
              >
                Or email {company.email}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}