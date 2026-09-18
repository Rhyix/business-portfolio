import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
import { cn } from '../../lib/cn'
import { HeroVisual } from './HeroVisual'

const heroCapabilities = [
  'Business management systems',
  'Administrative dashboards',
  'Database-driven applications',
  'Responsive web experiences',
] as const

/** First impression: positioning statement, primary actions and product visual. */
export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-ink-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 h-[620px]"
          style={{
            background:
              'radial-gradient(65% 60% at 68% 12%, rgba(37, 87, 235, 0.08), rgba(255, 255, 255, 0))',
          }}
        />
        <div
          className="bg-blueprint absolute inset-0"
          style={{
            maskImage: 'radial-gradient(75% 65% at 62% 25%, #000, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(75% 65% at 62% 25%, #000, transparent 78%)',
          }}
        />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:gap-20">
          <div className="max-w-xl">
            <Reveal>
              <p className="flex items-center gap-2.5 text-accent-600">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
                <span aria-hidden="true" className="h-px w-10 shrink-0 bg-ink-200" />
                <span className="label-mono font-medium">Custom software development</span>
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-7 text-display font-semibold">
                Custom software solutions built for your business
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 text-lead text-ink-500">
                We design and develop reliable web systems tailored to your requirements — from business
                management platforms and administrative dashboards to the databases and integrations
                behind them.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="#contact" size="lg">
                  Start a Project
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button href="#solutions" variant="secondary" size="lg">
                  View Solutions
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 grid grid-cols-1 border-t border-ink-200 sm:grid-cols-2">
                {heroCapabilities.map((capability, index) => (
                  <div
                    key={capability}
                    className={cn(
                      'border-b border-ink-200 py-4',
                      index % 2 === 0 && 'sm:border-r sm:pr-6',
                      index % 2 === 1 && 'sm:pl-6',
                    )}
                  >
                    <span className="label-mono block text-ink-400">{String(index + 1).padStart(2, '0')}</span>
                    <span className="mt-1.5 block text-sm font-medium text-ink-900">{capability}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="xl:-mr-10 2xl:-mr-20">
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
