import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

interface FilterDropdownProps {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  className?: string
}

/** Native, accessible select styled as a compact filter control. */
export function FilterDropdown({ label, value, options, onChange, className }: FilterDropdownProps) {
  const selectId = useId()

  return (
    <div className={cn('relative', className)}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-ink-200 bg-white py-2 pr-9 pl-3 text-sm text-ink-900 transition-colors duration-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 focus:outline-none"
      >
        <option value="All">{label}: All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-400"
        aria-hidden="true"
      />
    </div>
  )
}
