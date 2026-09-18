import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { ChapterReveal } from '../../components/ui/ChapterReveal'
import { Container } from '../../components/ui/Container'
import { ScrambleText } from '../../components/ui/ScrambleText'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { company } from '../../data/company'

/** Closing call to action — continues Technology's dark ground with no seam, the typographic climax of the page. */
export function CallToAction() {
  return (
    <Section id="get-started" labelledBy="cta-title" tone="dark">
      <div
        aria-hidden="true"
        className="bg-blueprint-dark pointer-events-none absolute inset-0"
        style={{
          maskImage: 'radial-gradient(80% 90% at 20% 100%, #000, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(80% 90% at 20% 100%, #000, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(55% 60% at 22% 70%, rgba(59, 118, 246, 0.2), rgba(11, 14, 18, 0))',
        }}
      />

      <Container className="relative">
        <div className="max-w-4xl">
          <SectionHeading
            id="cta-title"
            eyebrow="Start a project"
            title="Have an idea for a system?"
            description="Let's turn your business requirements into a working software solution. Tell us what you need and we will outline the next steps."
            tone="dark"
            size="headline"
          />

          <ChapterReveal step={3}>
            <div className="mt-9">
              <Button href="#contact" tone="dark" size="lg" className="w-full sm:w-auto">
                <ScrambleText text="Start a Project" />
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </ChapterReveal>

          <ChapterReveal step={4}>
            <div className="mt-10 border-t border-ink-800 pt-6">
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2.5 font-mono text-[0.8125rem] tracking-[0.04em] text-accent-300 transition-colors duration-200 hover:text-white"
              >
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-400" />
                Or email {company.email}
              </a>
            </div>
          </ChapterReveal>
        </div>
      </Container>
    </Section>
  )
}
