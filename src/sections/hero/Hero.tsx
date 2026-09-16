import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Reveal } from '../../components/ui/Reveal'
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
    <section id="home" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 h-[560px]"
          style={{
            background:
              'radial-gradient(70% 60% at 50% 0%, rgba(37, 87, 235, 0.10), rgba(255, 255, 255, 0))',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(16, 19, 24, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 19, 24, 0.045) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(60% 55% at 50% 20%, #000, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(60% 55% at 50% 20%, #000, transparent 75%)',
          }}
        />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <Reveal>
              <Badge icon={Sparkles}>Custom software development</Badge>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-6 text-display font-semibold">
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
              <ul className="mt-10 grid gap-3 border-t border-ink-200/80 pt-6 sm:grid-cols-2">
                {heroCapabilities.map((capability) => (
                  <li key={capability} className="flex items-center gap-2 text-sm text-ink-600">
                    <Check
                      className="size-4 shrink-0 text-accent-600"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    {capability}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}