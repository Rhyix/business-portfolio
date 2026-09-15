import { IconFrame } from '../../components/ui/IconFrame'
import type { Service } from '../../types/content'

interface ServiceCardProps {
  service: Service
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