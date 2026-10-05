import { IconFrame } from '../../components/ui/IconFrame'
import type { Service } from '../../types/content'

interface ServiceCardProps {
  service: Service
}

/** Tall rail panel used by the pinned layout: icon and index on top, copy anchored to the bottom. */
export function ServicePanel({ service, index }: ServiceCardProps & { index: number }) {
  const Icon = service.icon

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-8 shadow-lift">
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600"
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <span aria-hidden="true" className="label-mono text-ink-400">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      {/* Top-aligned, not pushed to the bottom: the descriptions run from two
          lines to four, so bottom-anchoring put every title at a different
          height. Any slack now falls at the foot of the card, where it reads
          as margin rather than as a gap in the middle. */}
      <h3 className="mt-8 text-xl font-semibold text-balance text-ink-900">{service.title}</h3>
      <p className="mt-3 leading-relaxed text-ink-500">{service.description}</p>
    </article>
  )
}

/** Single service tile: decorative icon, title and one-line description. */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink-200/80 bg-white p-6 transition-colors duration-200 hover:border-ink-300 hover:bg-ink-50/70 sm:p-7">
      <IconFrame icon={service.icon} />
      <h3 className="mt-5 text-base font-semibold text-ink-900">{service.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{service.description}</p>
    </article>
  )
}