import { BarChart3, LayoutDashboard, ShoppingCart, Users, UsersRound } from 'lucide-react'
import { cn } from '../../lib/cn'
import { featuredPlatformHref } from '../../data/platform'

const navGroups = [
  { label: 'Overview', items: [{ icon: LayoutDashboard, label: 'Dashboard', active: true }] },
  {
    label: 'Operations',
    items: [
      { icon: Users, label: 'Customers', active: false },
      { icon: ShoppingCart, label: 'Orders', active: false },
    ],
  },
  { label: 'People & HR', items: [{ icon: UsersRound, label: 'Employees', active: false }] },
  { label: 'Analytics', items: [{ icon: BarChart3, label: 'Reports', active: false }] },
]

const statTiles = [
  { label: 'Revenue', value: '₱213,855' },
  { label: 'Orders', value: '12' },
  { label: 'Employees', value: '16' },
  { label: 'Attendance', value: '75%' },
]

const revenueBars = [45, 52, 48, 58, 68, 100]
const activityBars = [55, 68, 60, 76, 88, 30, 96]

const recentRows = [
  { name: 'Nadia Cortes', status: 'Completed' },
  { name: 'Jefferson Cruz', status: 'Processing' },
  { name: 'Marilou Fajardo', status: 'Completed' },
]

/**
 * Large, static replica of the Integrated Business Management Platform
 * dashboard — same design tokens and layout structure as the real app (see
 * src/pages/demos/integrated-platform/Dashboard.tsx), but built from plain
 * markup with no state, data layer or interactivity. Kept out of the
 * marketing bundle's dependency on the demo/store code entirely, so the
 * homepage never loads the interactive application just to show a preview.
 * Purely decorative — the real demo is one click away via the CTA.
 */
export function PlatformPreview() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-lift"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-ink-200/70 bg-ink-50/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink-200" />
        <span className="size-2.5 rounded-full bg-ink-200" />
        <span className="size-2.5 rounded-full bg-ink-200" />
        <span className="ml-2 hidden flex-1 truncate rounded-md border border-ink-200/70 bg-white px-2.5 py-1 text-[0.65rem] text-ink-400 sm:block">
          {featuredPlatformHref}
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-40 shrink-0 border-r border-ink-200/70 bg-white p-3 md:block lg:w-48">
          <div className="flex items-center gap-2 px-1">
            <span className="grid size-6 place-items-center rounded-md bg-ink-950 text-[0.6rem] font-semibold text-white">
              A
            </span>
            <span className="text-xs font-semibold tracking-tight text-ink-900">AETEX</span>
          </div>

          <div className="mt-4 space-y-3">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-2 text-[0.6rem] font-semibold tracking-[0.1em] text-ink-400 uppercase">
                  {group.label}
                </p>
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.7rem] font-medium',
                        item.active ? 'bg-ink-950 text-white' : 'text-ink-500',
                      )}
                    >
                      <item.icon className="size-3.5 shrink-0" strokeWidth={1.9} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-ink-900">Dashboard</span>
            <div className="flex items-center gap-2">
              <span className="hidden h-7 w-28 rounded-md border border-ink-200 bg-white sm:block" />
              <span className="size-7 shrink-0 rounded-full bg-ink-100" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {statTiles.map((tile) => (
              <div key={tile.label} className="rounded-xl border border-ink-200/70 bg-white p-2.5">
                <span className="block text-[0.6rem] font-semibold tracking-[0.08em] text-ink-400 uppercase">
                  {tile.label}
                </span>
                <span className="mt-1.5 block text-sm font-semibold text-ink-900">{tile.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border border-ink-200/70 bg-white p-3">
              <span className="block text-[0.65rem] font-medium text-ink-500">Revenue trend</span>
              <div className="mt-2.5 flex h-14 items-end gap-1.5 sm:h-16">
                {revenueBars.map((height, index) => (
                  <span
                    key={index}
                    className={cn(
                      'flex-1 rounded-t-sm',
                      index === revenueBars.length - 1 ? 'bg-accent-500' : 'bg-accent-200',
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-ink-200/70 bg-white p-3">
              <span className="block text-[0.65rem] font-medium text-ink-500">Order activity</span>
              <div className="mt-2.5 flex h-14 items-end gap-1.5 sm:h-16">
                {activityBars.map((height, index) => (
                  <span
                    key={index}
                    className={cn(
                      'flex-1 rounded-t-sm',
                      index === activityBars.length - 2 ? 'bg-accent-500' : 'bg-accent-200',
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2 rounded-xl border border-ink-200/70 bg-white p-3">
            <span className="block text-[0.65rem] font-medium text-ink-500">Recent orders</span>
            {recentRows.map((row) => (
              <div key={row.name} className="flex items-center gap-2.5 border-t border-ink-100 pt-2 first:border-t-0 first:pt-0">
                <span className="size-4 shrink-0 rounded-full bg-ink-100" />
                <span className="h-1.5 flex-1 rounded-full bg-ink-100" />
                <span className="shrink-0 rounded-full bg-ink-50 px-2 py-0.5 text-[0.6rem] font-medium text-ink-500">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
