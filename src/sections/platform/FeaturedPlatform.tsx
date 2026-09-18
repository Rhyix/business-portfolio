import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { buttonClassName } from '../../components/ui/buttonStyles'
import { Container } from '../../components/ui/Container'
import { IconFrame } from '../../components/ui/IconFrame'
import { Rail } from '../../components/ui/Rail'
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

/** Flagship showcase: the Integrated Business Management Platform, presented as AETEX's primary sample solution — the page's dark chapter. */
export function FeaturedPlatform() {
  return (
    <Section id="platform" labelledBy="platform-title" tone="dark" size="feature">
      <div
        aria-hidden="true"
        className="bg-blueprint-dark pointer-events-none absolute inset-0"
        style={{
          maskImage: 'radial-gradient(70% 60% at 50% 0%, #000, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, #000, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(60% 55% at 50% 38%, rgba(37, 87, 235, 0.18), rgba(11, 14, 18, 0))',
        }}
      />

      <Container className="relative">
        <div className="max-w-2xl">
          <Reveal>
            <p className="flex items-center gap-2.5 text-accent-300">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-400" />
              <span aria-hidden="true" className="h-px w-10 shrink-0 bg-ink-800" />
              <span className="label-mono font-medium">Featured solution — interactive demo</span>
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <SectionHeading
              id="platform-title"
              title="One workspace for your business, operations and people"
              description="The Integrated Business Management Platform is our flagship sample solution — a single workspace connecting customers, orders, inventory, workforce management and reporting. It's a demonstration built to explore, not a live client deployment."
              tone="dark"
              size="headline"
              className="mt-5"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to={featuredPlatformHref} className={buttonClassName('primary', 'lg', undefined, 'dark')}>
                Explore Interactive Demo
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Button href="#contact" variant="secondary" size="lg" tone="dark">
                Discuss a Similar System
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="relative mt-14 lg:-mx-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border border-ink-800 bg-ink-950"
            />
            <div className="relative">
              <PlatformPreview />
            </div>
            <span aria-hidden="true" className="absolute -top-1.5 -left-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-ink-975" />
            <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-ink-975" />
            <span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-ink-975" />
            <span aria-hidden="true" className="absolute -bottom-1.5 -right-1.5 size-1.5 rounded-full bg-accent-500 ring-4 ring-ink-975" />
          </div>
        </Reveal>

        {/* Capability groups — a de-boxed spec table instead of three separate cards. */}
        <div className="mt-16 grid divide-y divide-ink-800 border-y border-ink-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {platformCapabilities.map((group, index) => (
            <Reveal
              key={group.title}
              delay={index * 0.05}
              className="py-6 first:pt-0 last:pb-0 sm:px-8 sm:py-8 sm:first:pl-0 sm:last:pr-0"
            >
              <span className="label-mono text-ink-500">{String(index + 1).padStart(2, '0')}</span>
              <IconFrame icon={group.icon} size="sm" shape="square" tone="dark" className="mt-4" />
              <h3 className="mt-4 text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Tag tone="dark">{item}</Tag>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Connected workflows — the platform's own integration story, drawn as a rail instead of an arrow-joined pill chain. */}
        <div className="mt-16">
          <Reveal>
            <p className="label-mono text-ink-400">Connected workflows, not isolated systems</p>
          </Reveal>

          <div className="mt-8 grid gap-x-12 gap-y-12 lg:grid-cols-2">
            {platformFlows.map((flow, flowIndex) => (
              <div key={flow.label}>
                <Reveal delay={flowIndex * 0.05}>
                  <p className="text-xs font-semibold tracking-[0.1em] text-accent-300 uppercase">{flow.label}</p>
                </Reveal>
                <div className="relative mt-7">
                  <Rail tone="dark" nodes={flow.steps.length} delay={flowIndex * 0.05 + 0.1} />
                  <div className="mt-4 flex justify-between gap-2">
                    {flow.steps.map((step, stepIndex) => (
                      <span
                        key={step}
                        className={
                          stepIndex === 0
                            ? 'text-left text-xs font-medium text-ink-300'
                            : stepIndex === flow.steps.length - 1
                              ? 'text-right text-xs font-medium text-ink-300'
                              : 'text-center text-xs font-medium text-ink-300'
                        }
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Reveal>
              <p className="label-mono text-ink-400">How it&apos;s structured</p>
            </Reveal>
            <div className="mt-6 divide-y divide-ink-800 border-y border-ink-800">
              {platformArchitecture.map((step, index) => (
                <Reveal key={step.label} delay={index * 0.04}>
                  <div className="flex items-center gap-4 py-4">
                    <span className="label-mono w-6 shrink-0 text-ink-500">{String(index + 1).padStart(2, '0')}</span>
                    <IconFrame icon={step.icon} size="sm" shape="square" tone="dark" />
                    <span className="text-sm font-medium text-white">{step.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-ink-800 pt-10">
          <Reveal>
            <p className="label-mono text-ink-400">Why an integrated platform matters</p>
          </Reveal>

          <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {platformHighlights.map((highlight, index) => (
              <li key={highlight.title}>
                <Reveal delay={(index % 5) * 0.04}>
                  <IconFrame icon={highlight.icon} size="sm" tone="dark" />
                  <h4 className="mt-4 text-sm font-semibold text-white">{highlight.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">{highlight.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
