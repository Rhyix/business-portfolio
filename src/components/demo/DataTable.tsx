import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { cn } from '../../lib/cn'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  cellClassName?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyMessage?: string
  className?: string
}

/**
 * Generic table shell shared by every demo list page. Wrapped in its own
 * horizontal scroll container so a wide table never overflows the page.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyTitle = 'No matching records',
  emptyMessage = 'Try adjusting your search or filters.',
  className,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState icon={Search} title={emptyTitle} message={emptyMessage} />
  }

  return (
    <div className={cn('overflow-x-auto rounded-xl border border-ink-200/80', className)}>
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink-200/80 bg-ink-50/70">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'px-4 py-3 text-xs font-semibold tracking-wide text-ink-500 uppercase',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {rows.map((row) => {
            const key = rowKey(row)

            return (
              <tr
                key={key}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-ink-50/80',
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          onRowClick(row)
                        }
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn('px-4 py-3 align-middle text-ink-700', column.cellClassName)}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
