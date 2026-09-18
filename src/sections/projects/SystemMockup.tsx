import { cn } from '../../lib/cn'
import type { SystemMockupVariant } from '../../types/content'

const barTone = 'block rounded-full bg-ink-100'
const barStrong = 'block rounded-full bg-ink-200'

interface SystemMockupProps {
  variant: SystemMockupVariant
  className?: string
}

function MockupBody({ variant }: { variant: SystemMockupVariant }) {
  switch (variant) {
    case 'table':
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-ink-50 px-2.5 py-2">
            <span className={barStrong} style={{ height: 6, width: 64 }} />
            <span className="block h-4 w-10 rounded-md bg-accent-100" />
          </div>
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center gap-2.5 rounded-lg border border-ink-100 px-2.5 py-2"
            >
              <span className="size-4 shrink-0 rounded-full bg-ink-100" />
              <span className={cn(barTone, 'flex-1')} style={{ height: 6 }} />
              <span className="block h-3.5 w-10 shrink-0 rounded-full border border-ink-200/70" />
            </div>
          ))}
        </div>
      )

    case 'people':
      return (
        <div className="space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((tile) => (
              <div key={tile} className="rounded-lg border border-ink-100 p-2">
                <span className={barTone} style={{ height: 5, width: 28 }} />
                <span className={cn(barStrong, 'mt-1.5')} style={{ height: 7, width: 38 }} />
              </div>
            ))}
          </div>
          <div className="space-y-2 pt-1">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-2.5 border-t border-ink-100 pt-2">
                <span className="size-6 shrink-0 rounded-full bg-ink-100" />
                <span className="min-w-0 flex-1">
                  <span className={cn(barStrong, 'w-24')} style={{ height: 6 }} />
                  <span className={cn(barTone, 'mt-1.5 w-14')} style={{ height: 5 }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'board':
      return (
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((column) => (
            <div key={column} className="rounded-lg border border-ink-100 bg-ink-50/60 p-2">
              <span className={barStrong} style={{ height: 5, width: 34 }} />
              <div className="mt-2 space-y-1.5">
                <span className="block h-7 rounded-md border border-ink-100 bg-white" />
                <span className="block h-7 rounded-md border border-ink-100 bg-white" />
                {column === 0 ? (
                  <span className="block h-7 rounded-md border border-accent-200 bg-accent-50" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )

    case 'stock':
      return (
        <div className="space-y-3">
          <div className="flex h-16 items-end gap-1.5">
            {[45, 70, 35, 85, 60, 75].map((height, index) => (
              <span
                key={index}
                className={cn(
                  'flex-1 rounded-t-sm',
                  index === 3 ? 'bg-accent-400' : 'bg-accent-200',
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center gap-2.5 border-t border-ink-100 pt-2">
              <span className="size-4 shrink-0 rounded bg-ink-100" />
              <span className={cn(barTone, 'flex-1')} style={{ height: 6 }} />
              <span className={cn(barStrong, 'w-6 shrink-0')} style={{ height: 6 }} />
            </div>
          ))}
        </div>
      )

    case 'schedule':
      return (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className={barStrong} style={{ height: 6, width: 56 }} />
            <span className="block h-4 w-12 rounded-md bg-accent-100" />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  'block h-6 rounded-md border',
                  index === 5 || index === 9
                    ? 'border-accent-300 bg-accent-50'
                    : 'border-ink-100 bg-white',
                )}
              />
            ))}
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className="space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((tile) => (
              <div key={tile} className="rounded-lg border border-ink-100 p-2">
                <span className={barTone} style={{ height: 5, width: 24 }} />
                <span className={cn(barStrong, 'mt-1.5')} style={{ height: 7, width: 32 }} />
              </div>
            ))}
          </div>
          <div className="flex h-14 items-end gap-1.5 rounded-lg border border-ink-100 p-2">
            {[40, 65, 50, 80, 55, 90, 70].map((height, index) => (
              <span
                key={index}
                className={cn(
                  'flex-1 rounded-t-sm',
                  index === 5 ? 'bg-accent-500' : 'bg-accent-200',
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      )
  }

  return null
}

/**
 * Decorative interface sketch used on solution cards.
 * Built entirely from markup, so no stock screenshots or invented customer data
 * are needed.
 */
export function SystemMockup({ variant, className }: SystemMockupProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'overflow-hidden rounded-xl border border-ink-200/70 bg-white shadow-soft',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-ink-200/70 bg-ink-50/80 px-3 py-2.5">
        <span className="size-1.5 rounded-full bg-ink-200" />
        <span className="size-1.5 rounded-full bg-ink-200" />
        <span className="size-1.5 rounded-full bg-ink-200" />
        <span className={cn(barTone, 'ml-2 flex-1')} style={{ height: 5 }} />
      </div>
      <div className="h-44 p-3.5">
        <MockupBody variant={variant} />
      </div>
    </div>
  )
}