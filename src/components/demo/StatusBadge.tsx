import { cn } from '../../lib/cn'

const toneStyles: Record<string, string> = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Healthy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Present: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Valid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Hired: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Shortlisted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Strongly Recommend': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Recommend: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'In Stock': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Received: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Lead: 'border-accent-200 bg-accent-50 text-accent-700',
  Processing: 'border-accent-200 bg-accent-50 text-accent-700',
  'On Leave': 'border-accent-200 bg-accent-50 text-accent-700',
  Interview: 'border-accent-200 bg-accent-50 text-accent-700',
  Open: 'border-accent-200 bg-accent-50 text-accent-700',
  Scheduled: 'border-accent-200 bg-accent-50 text-accent-700',
  'In Progress': 'border-accent-200 bg-accent-50 text-accent-700',
  Ordered: 'border-accent-200 bg-accent-50 text-accent-700',
  Confirmed: 'border-accent-200 bg-accent-50 text-accent-700',
  Sent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  Low: 'border-amber-200 bg-amber-50 text-amber-700',
  'Low stock': 'border-amber-200 bg-amber-50 text-amber-700',
  'Low Stock': 'border-amber-200 bg-amber-50 text-amber-700',
  Late: 'border-amber-200 bg-amber-50 text-amber-700',
  Screening: 'border-amber-200 bg-amber-50 text-amber-700',
  Assessment: 'border-amber-200 bg-amber-50 text-amber-700',
  'Expiring Soon': 'border-amber-200 bg-amber-50 text-amber-700',
  Paused: 'border-amber-200 bg-amber-50 text-amber-700',
  Rescheduled: 'border-amber-200 bg-amber-50 text-amber-700',
  'Needs Review': 'border-amber-200 bg-amber-50 text-amber-700',
  'Partially Received': 'border-amber-200 bg-amber-50 text-amber-700',
  Draft: 'border-ink-200 bg-ink-100 text-ink-600',
  Inactive: 'border-ink-200 bg-ink-100 text-ink-600',
  Applied: 'border-ink-200 bg-ink-100 text-ink-600',
  Closed: 'border-ink-200 bg-ink-100 text-ink-600',
  Overdue: 'border-red-200 bg-red-50 text-red-700',
  Cancelled: 'border-red-200 bg-red-50 text-red-700',
  'Out of stock': 'border-red-200 bg-red-50 text-red-700',
  'Out of Stock': 'border-red-200 bg-red-50 text-red-700',
  Critical: 'border-red-200 bg-red-50 text-red-700',
  Discontinued: 'border-red-200 bg-red-50 text-red-700',
  Absent: 'border-red-200 bg-red-50 text-red-700',
  Rejected: 'border-red-200 bg-red-50 text-red-700',
  Expired: 'border-red-200 bg-red-50 text-red-700',
  Missing: 'border-red-200 bg-red-50 text-red-700',
  'Do Not Recommend': 'border-red-200 bg-red-50 text-red-700',
  'No Show': 'border-red-200 bg-red-50 text-red-700',
}

const defaultTone = 'border-ink-200 bg-ink-100 text-ink-600'

interface StatusBadgeProps {
  status: string
  className?: string
}

/** Colour-coded status pill, shared across every demo table and detail view. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        toneStyles[status] ?? defaultTone,
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
