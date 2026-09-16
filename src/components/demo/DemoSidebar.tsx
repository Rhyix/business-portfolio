import { ArrowLeft } from 'lucide-react'
import { Link } from '../../lib/router'
import { demoNavItems } from '../../data/demos/business-management/navigation'
import { DemoNotice } from './DemoNotice'
import { cn } from '../../lib/cn'

const DEMO_BASE_PATH = '/solutions/business-management-system'

interface SidebarBodyProps {
  activeKey: string
  onNavigate?: () => void
}

function SidebarBrand() {
  return (
    <div className="px-5 pt-5">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 transition-colors duration-200 hover:text-ink-700"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to AETEX
      </Link>

      <div className="mt-4 flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-ink-950 text-[0.8rem] font-semibold text-white">
          A
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold tracking-tight text-ink-900">AETEX</span>
          <span className="block truncate text-[0.7rem] text-ink-500">
            Business Management System
          </span>
        </span>
      </div>

      <DemoNotice className="mt-4" />
    </div>
  )
}

function SidebarNav({ activeKey, onNavigate }: SidebarBodyProps) {
  return (
    <nav aria-label="Business Management System" className="mt-6 flex-1 px-3">
      <ul className="space-y-1">
        {demoNavItems.map((item) => {
          const isActive = item.key === activeKey
          const Icon = item.icon

          return (
            <li key={item.key}>
              <Link
                to={`${DEMO_BASE_PATH}${item.to}`}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-ink-950 text-white'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" strokeWidth={1.9} />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function SidebarAccount() {
  return (
    <div className="border-t border-ink-200/80 p-4">
      <div className="flex items-center gap-3 rounded-lg px-1.5 py-1">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700"
        >
          AU
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink-900">Admin User</span>
          <span className="block truncate text-xs text-ink-500">Demo Account</span>
        </span>
      </div>
    </div>
  )
}

/** Persistent left navigation rail shown at lg and above. */
export function DemoSidebar({ activeKey }: { activeKey: string }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200/80 bg-white lg:flex">
      <SidebarBrand />
      <SidebarNav activeKey={activeKey} />
      <SidebarAccount />
    </aside>
  )
}

interface DemoMobileNavProps {
  activeKey: string
  onNavigate: () => void
}

/** Inner content reused by the mobile drawer in DemoTopbar. */
export function DemoMobileNavContent({ activeKey, onNavigate }: DemoMobileNavProps) {
  return (
    <div className="flex h-full flex-col">
      <SidebarBrand />
      <SidebarNav activeKey={activeKey} onNavigate={onNavigate} />
      <SidebarAccount />
    </div>
  )
}
