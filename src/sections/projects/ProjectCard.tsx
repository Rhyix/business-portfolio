import { ArrowUpRight } from 'lucide-react'
import { Tag } from '../../components/ui/Tag'
import { solutionLabel } from '../../data/projects'
import type { Solution } from '../../types/content'
import { SystemMockup } from './SystemMockup'

interface ProjectCardProps {
  solution: Solution
}

/** Sample solution card: mockup, category, description, stack and a link. */
export function ProjectCard({ solution }: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink-200/80 bg-white p-5 transition-colors duration-200 hover:border-ink-300 sm:p-6">
      <SystemMockup variant={solution.mockup} />

      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-accent-600 uppercase">
            {solution.category}
          </span>
          <span className="shrink-0 rounded-full border border-ink-200/80 px-2.5 py-1 text-[0.65rem] font-medium text-ink-500">
            {solutionLabel}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-ink-900">{solution.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{solution.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {solution.technologies.map((technology) => (
            <li key={technology}>
              <Tag>{technology}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-accent-700"
          >
            Discuss a similar system
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}