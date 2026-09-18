import { IconFrame } from '../../components/ui/IconFrame'
import type { ProcessStep as ProcessStepData } from '../../types/content'

interface ProcessStepProps {
  step: ProcessStepData
  /** Zero-based position, used to render the "01" label. */
  index: number
}

/**
 * One phase of the development process: a track line with a node, the phase
 * number, its title and description.
 */
export function ProcessStep({ step, index }: ProcessStepProps) {
  const label = String(index + 1).padStart(2, '0')

  return (
    <div className="relative border-t border-ink-200 pt-6 pr-8 lg:px-8">
      <span
        aria-hidden="true"
        className="absolute -top-[3px] left-0 size-1.5 rounded-full bg-accent-500 ring-4 ring-white"
      />
      <div className="flex items-start justify-between gap-4">
        <span className="label-mono text-accent-600">{label}</span>
        <IconFrame icon={step.icon} size="sm" shape="square" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-ink-900">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.description}</p>
    </div>
  )
}