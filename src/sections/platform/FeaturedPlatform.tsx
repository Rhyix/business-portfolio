import { ArrowRight, ArrowDown, MonitorPlay } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { buttonClassName } from '../../components/ui/buttonStyles'
import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Reveal } from '../../components/ui/Reveal'
import { Section } from '../../components/ui/Section'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Tag } from '../../components/ui/Tag'
import { Link } from '../../lib/router'
import {
  featuredPlatformHref,
  platformArchitecture,
  platformCapabilities,
  platformFlows,
  platformHighlights,
} from '../../data/platform'
import { PlatformPreview } from './PlatformPreview'

/** Flagship showcase: the Integrated Business Management Platform, presented as AETEX's primary sample solution. */
export function FeaturedPlatform() {
  return (
    <Section id="platform" labelledBy="platform-title">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Badge icon={MonitorPlay}>Featured solution — interactive demo</Badge>
          </Reveal>

          <Reveal delay={0.05}>
            <SectionHeading
              id="platform-title"
              title="One workspace for your business, operations and people"
              description="The Integrated Business Management Platform is our flagship sample solution — a single workspace connecting customers, orders, inventory, workforce management and reporting. It's a demonstration built to explore, not a live client deployment."
              align="center"
              className="mx-auto"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={featuredPlatformHref} className={buttonClassName('primary', 'lg')}>
                Explore Interactive Demo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Button href="#contact" variant="secondary" size="lg">
                Discuss a Similar System
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-14">
            <PlatformPreview />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {platformCapabilities.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-ink-200/80 bg-white p-6">
                <IconFrame icon={group.icon} size="sm" />
                <h3 className="mt-4 text-sm font-semibold text-ink-900">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-center text-sm font-semibold tracking-[0.14em] text-ink-500 uppercase">
              Connected workflows, not isolated systems
            </h3>
          </Reveal>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {platformFlows.map((flow, index) => (
              <Reveal key={flow.label} delay={index * 0.05}>
                <div className="rounded-2xl border border-ink-200/80 bg-white p-6">
                  <p className="text-xs font-semibold tracking-[0.1em] text-accent-600 uppercase">
                    {flow.label}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
                    {flow.steps.map((step, stepIndex) => (
                      <span key={step} className="flex items-center gap-2">
                        <span className="rounded-full border border-ink-200 bg-ink-50/70 px-3.5 py-1.5 text-sm font-medium text-ink-800">
                          {step}
                        </span>
                        {stepIndex < flow.steps.length - 1 ? (
                          <ArrowRight className="size-4 shrink-0 text-ink-300" aria-hidden="true" />
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8 rounded-2xl border border-ink-200/80 bg-ink-50/50 p-6">
              <p className="text-xs font-semibold tracking-[0.1em] text-ink-500 uppercase">
                How it's structured
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
                {platformArchitecture.map((step, index) => (
                  <span key={step.label} className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-ink-200/80 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-800">
                      <step.icon className="size-4 text-accent-600" strokeWidth={1.9} aria-hidden="true" />
                      {step.label}
                    </span>
                    {index < platformArchitecture.length - 1 ? (
                      <ArrowRight className="hidden size-4 shrink-0 text-ink-300 sm:block" aria-hidden="true" />
                    ) : null}
                    {index < platformArchitecture.length - 1 ? (
                      <ArrowDown className="size-4 shrink-0 text-ink-300 sm:hidden" aria-hidden="true" />
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="text-center text-sm font-semibold tracking-[0.14em] text-ink-500 uppercase">
              Why an integrated platform matters
            </h3>
          </Reveal>

          <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {platformHighlights.map((highlight, index) => (
              <li key={highlight.title}>
                <Reveal delay={(index % 5) * 0.04}>
                  <IconFrame icon={highlight.icon} size="sm" />
                  <h4 className="mt-4 text-sm font-semibold text-ink-900">{highlight.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{highlight.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
