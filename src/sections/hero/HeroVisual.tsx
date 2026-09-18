import {
  ChartColumn,
  ClipboardList,
  Database,
  LayoutDashboard,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { RevealStagger } from '../../components/ui/RevealStagger'
import { cn } from '../../lib/cn'

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: ClipboardList, label: 'Records', active: false },
  { icon: ChartColumn, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
]

const chartBars = [38, 62, 46, 78, 54, 88, 66]
const recordStatuses = ['Active', 'Draft', 'Review']

const tetherAnnotations = [
  { icon: Database, label: 'Database' },
  { icon: ShieldCheck, label: 'Access control' },
] as const

/**
 * Decorative product visual for the hero: an abstract system interface built
 * entirely from markup, so no stock screenshots or fake customer data are used.
 */
export function HeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
      {/* Offset plane: a second real surface behind the window for geometric
          depth, instead of a heavier shadow. */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl border border-ink-200 bg-ink-50 sm:translate-x-3 sm:translate-y-3" />

      <div className="relative rounded-xl border border-ink-200/80 bg-white p-2.5 shadow-card sm:p-3">
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
        <RevealStagger className="grid grid-cols-[auto_1fr] gap-2 rounded-lg border border-ink-200/70 bg-ink-50/70 p-2 sm:gap-2.5 sm:p-3">
          {/* Sidebar */}
          <RevealStagger.Item className="hidden w-32 flex-col gap-1 rounded-xl border border-ink-200/70 bg-white p-2 sm:flex">
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
          </RevealStagger.Item>

          {/* Main panel */}
          <div className="min-w-0 space-y-2.5">
            <RevealStagger.Item>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200/70 bg-white px-3 py-2.5">
                <div className="space-y-1.5">
                  <span className="block h-2 w-20 rounded-full bg-ink-200" />
                  <span className="block h-1.5 w-14 rounded-full bg-ink-100" />
                </div>
                <span className="rounded-md bg-ink-950 px-2 py-1 text-[0.6rem] font-medium text-white">
                  Action
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((tile) => (
                  <div key={tile} className="rounded-xl border border-ink-200/70 bg-white p-2.5">
                    <span className="block h-1.5 w-10 rounded-full bg-ink-100" />
                    <span className="mt-2 block h-2 w-14 rounded-full bg-ink-200" />
                  </div>
                ))}
              </div>
            </RevealStagger.Item>

            <RevealStagger.Item>
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
            </RevealStagger.Item>

            <RevealStagger.Item>
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
            </RevealStagger.Item>
          </div>
        </RevealStagger>
      </div>

      {/* Tethered annotations — desktop only. Static (no float): they read as
          labelled parts of the system, not decoration drifting past it. */}
      <div className="absolute top-1/4 -left-16 hidden items-center lg:flex">
        <span className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2.5 shadow-soft">
          <Database className="size-4 text-accent-600" strokeWidth={1.75} />
          <span className="text-[0.7rem] font-medium text-ink-700">Database</span>
        </span>
        <span className="relative ml-3 h-px w-8 shrink-0 bg-ink-200">
          <span className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-500 ring-4 ring-white" />
        </span>
      </div>

      <div className="absolute -right-16 bottom-1/4 hidden items-center lg:flex">
        <span className="relative mr-3 h-px w-8 shrink-0 bg-ink-200">
          <span className="absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500 ring-4 ring-white" />
        </span>
        <span className="flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2.5 shadow-soft">
          <ShieldCheck className="size-4 text-accent-600" strokeWidth={1.75} />
          <span className="text-[0.7rem] font-medium text-ink-700">Access control</span>
        </span>
      </div>

      {/* Same two annotations, mobile/tablet form — a caption row instead of
          floating chips, so the information isn't lost below `lg`. */}
      <div className="mt-4 flex divide-x divide-ink-200 border-t border-ink-200 lg:hidden">
        {tetherAnnotations.map((annotation) => (
          <div key={annotation.label} className="flex flex-1 items-center gap-2 px-3 py-3 first:pl-0 last:pr-0">
            <span className="size-1.5 shrink-0 rounded-full bg-accent-500" />
            <span className="label-mono text-ink-500">{annotation.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
