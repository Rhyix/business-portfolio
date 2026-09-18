import { ArrowUpRight } from 'lucide-react'
import { Tag } from '../../components/ui/Tag'
import { solutionLabel } from '../../data/projects'
import type { Solution } from '../../types/content'
import { Link } from '../../lib/router'
import { SystemMockup } from './SystemMockup'

interface ProjectCardProps {
  solution: Solution
  /** Zero-based position, rendered as the mono index — also used for the group-hover accent. */
  index: number
}

/** Sample solution cell: index, mockup, category, description, stack and a link. The hairline border and hover live on the parent cell (see Projects.tsx). */
export function ProjectCard({ solution, index }: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <span className="label-mono text-ink-400 transition-colors duration-200 ease-out-expo group-hover:text-accent-600">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="inline-flex shrink-0 items-center rounded-full border border-ink-200/80 px-2.5 py-1 text-[0.65rem] font-medium text-ink-500">
          {solutionLabel}
        </span>
      </div>

      <div className="mt-4 transition-transform duration-200 ease-out-expo group-hover:-translate-y-1">
        <SystemMockup variant={solution.mockup} />
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-accent-600 uppercase">{solution.category}</span>
        <h3 className="mt-2 text-lg font-semibold text-ink-900">{solution.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{solution.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {solution.technologies.map((technology) => (
            <li key={technology}>
              <Tag>{technology}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <div className="border-t border-ink-100 pt-4">
            {solution.demoHref ? (
              <Link
                to={solution.demoHref}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-accent-700"
              >
                View demo
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-accent-700"
              >
                Discuss a similar system
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
