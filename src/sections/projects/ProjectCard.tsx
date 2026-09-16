import { ArrowUpRight, Sparkle } from 'lucide-react'
import { Tag } from '../../components/ui/Tag'
import { solutionLabel } from '../../data/projects'
import type { Solution } from '../../types/content'
import { Link } from '../../lib/router'
import { cn } from '../../lib/cn'
import { SystemMockup } from './SystemMockup'

interface ProjectCardProps {
  solution: Solution
}

/** Sample solution card: mockup, category, description, stack and a link. */
export function ProjectCard({ solution }: ProjectCardProps) {
  const isFeatured = solution.featured === true

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border bg-white p-5 transition-colors duration-200 sm:p-6',
        isFeatured
          ? 'border-accent-200 ring-1 ring-accent-100 hover:border-accent-300'
          : 'border-ink-200/80 hover:border-ink-300',
      )}
    >
      <SystemMockup variant={solution.mockup} />

      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="min-w-0 text-[0.7rem] font-semibold tracking-[0.14em] text-accent-600 uppercase">
            {solution.category}
          </span>
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium',
              isFeatured
                ? 'border-accent-200 bg-accent-50 text-accent-700'
                : 'border-ink-200/80 text-ink-500',
            )}
          >
            {isFeatured ? <Sparkle className="size-3" aria-hidden="true" /> : null}
            {isFeatured ? `Featured · ${solutionLabel}` : solutionLabel}
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
          {solution.demoHref ? (
            <Link
              to={solution.demoHref}
              className="inline-flex items-center gap-1.5 py-1 text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-accent-700"
            >
              {isFeatured ? 'Explore demo' : 'View demo'}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 py-1 text-sm font-medium text-ink-900 transition-colors duration-200 hover:text-accent-700"
            >
              Discuss a similar system
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}