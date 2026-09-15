import {
  ChartColumn,
  ClipboardList,
  Database,
  LayoutDashboard,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: ClipboardList, label: 'Records', active: false },
  { icon: ChartColumn, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const chartBars = [38, 62, 46, 78, 54, 88, 66]
const recordStatuses = ['Active', 'Draft', 'Review']

/**
 * Decorative product visual for the hero: an abstract system interface built
 * entirely from markup, so no stock screenshots or fake customer data are used.
 */
export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
      <div className="relative rounded-[1.75rem] border border-ink-200/80 bg-white p-2.5 shadow-lift sm:p-3">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-1 pt-0.5 pb-3">
          <span className="size-2.5 rounded-full bg-ink-200" />
          <span className="size-2.5 rounded-full bg-ink-200" />
          <span className="size-2.5 rounded-full bg-ink-200" />
          <span className="ml-2 hidden flex-1 truncate rounded-md border border-ink-200/70 bg-ink-50 px-2.5 py-1 text-[0.65rem] text-ink-400 sm:block">
            app.example.com/dashboard
          </span>
        </div>

        {/* Application surface */}
        <div className="grid grid-cols-[auto_1fr] gap-2 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-2 sm:gap-2.5 sm:p-3">
          {/* Sidebar */}
          <div className="hidden w-32 flex-col gap-1 rounded-xl border border-ink-200/70 bg-white p-2 sm:flex">
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.7rem] font-medium',
                  item.active ? 'bg-accent-50 text-accent-700' : 'text-ink-500',
                )}
              >
                <item.icon className="size-3.5" strokeWidth={1.75} />
                {item.label}
              </div>
            ))}
          </div>

          {/* Main panel */}
          <div className="min-w-0 space-y-2.5">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200/70 bg-white px-3 py-2.5">
              <div className="space-y-1.5">
                <span className="block h-2 w-20 rounded-full bg-ink-200" />
                <span className="block h-1.5 w-14 rounded-full bg-ink-100" />
              </div>
              <span className="rounded-md bg-ink-950 px-2 py-1 text-[0.6rem] font-medium text-white">
                Action
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((tile) => (
                <div key={tile} className="rounded-xl border border-ink-200/70 bg-white p-2.5">
                  <span className="block h-1.5 w-10 rounded-full bg-ink-100" />
                  <span className="mt-2 block h-2 w-14 rounded-full bg-ink-200" />
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-ink-200/70 bg-white p-3">
              <span className="block h-1.5 w-16 rounded-full bg-ink-100" />
              <div className="mt-3 flex h-16 items-end gap-1.5 sm:h-20">
                {chartBars.map((height, index) => (
                  <span
                    key={index}
                    className={cn(
                      'flex-1 rounded-t-sm',
                      index === chartBars.length - 1 ? 'bg-accent-500' : 'bg-accent-200',
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-ink-200/70 bg-white p-3">
              {recordStatuses.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <span className="size-4 shrink-0 rounded-full bg-ink-100" />
                  <span className="h-1.5 flex-1 rounded-full bg-ink-100" />
                  <span className="rounded-full bg-ink-50 px-2 py-0.5 text-[0.6rem] font-medium text-ink-500">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating detail cards */}
      <div className="absolute top-1/4 -left-3 hidden animate-float items-center gap-2.5 rounded-xl border border-ink-200/80 bg-white px-3 py-2.5 shadow-card lg:flex">
        <Database className="size-4 text-accent-600" strokeWidth={1.75} />
        <span className="text-[0.7rem] font-medium text-ink-700">Database</span>
      </div>

      <div
        className="absolute -right-3 bottom-1/4 hidden animate-float items-center gap-2.5 rounded-xl border border-ink-200/80 bg-white px-3 py-2.5 shadow-card lg:flex"
        style={{ animationDelay: '1.5s' }}
      >
        <ShieldCheck className="size-4 text-accent-600" strokeWidth={1.75} />
        <span className="text-[0.7rem] font-medium text-ink-700">Access control</span>
      </div>
    </div>
  )
}