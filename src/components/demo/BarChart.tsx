import { cn } from '../../lib/cn'

interface BarChartPoint {
  label: string
  value: number
}

interface BarChartProps {
  data: BarChartPoint[]
  formatValue?: (value: number) => string
  className?: string
}

/**
 * Minimal CSS bar chart. Deliberately dependency-free — the demo's data sets
 * are small enough that a charting library would be overkill.
 */
export function BarChart({ data, formatValue = String, className }: BarChartProps) {
  const max = Math.max(...data.map((point) => point.value), 1)
  const summary = data.map((point) => `${point.label} ${formatValue(point.value)}`).join(', ')

  return (
    <div role="img" aria-label={summary} className={cn('flex items-end gap-2 sm:gap-3', className)}>
      {data.map((point, index) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
          {/* Fixed-height track so the bar's percentage height has a definite ancestor to resolve against. */}
          <div className="flex h-32 w-full items-end">
            <div
              className={cn(
                'w-full rounded-t-md transition-[height] duration-500',
                index === data.length - 1 ? 'bg-accent-600' : 'bg-accent-200',
              )}
              style={{ height: `${Math.max((point.value / max) * 100, 4)}%` }}
            />
          </div>
          <span className="text-[0.65rem] font-medium text-ink-400">{point.label}</span>
        </div>
      ))}
    </div>
  )
}
