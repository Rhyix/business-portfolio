import { ArrowLeft } from 'lucide-react'
import { Link } from '../../lib/router'
import { DemoNotice } from './DemoNotice'
import { cn } from '../../lib/cn'
import type { DemoNavGroup, DemoNavItem } from './types'

interface SidebarBrandProps {
  appName: string
}

function SidebarBrand({ appName }: SidebarBrandProps) {
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
          <span className="block truncate text-[0.7rem] text-ink-500">{appName}</span>
        </span>
      </div>

      <DemoNotice className="mt-4" />
    </div>
  )
}

interface NavLinkProps {
  item: DemoNavItem
  basePath: string
  isActive: boolean
  onNavigate?: () => void
}

function NavLink({ item, basePath, isActive, onNavigate }: NavLinkProps) {
  const Icon = item.icon

  return (
    <li>
      <Link
        to={`${basePath}${item.to}`}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
          isActive ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" strokeWidth={1.9} />
        {item.label}
      </Link>
    </li>
  )
}

interface SidebarNavProps {
  appName: string
  basePath: string
  navItems: readonly DemoNavItem[]
  groups?: readonly DemoNavGroup[]
  activeKey: string
  onNavigate?: () => void
}

function SidebarNav({ appName, basePath, navItems, groups, activeKey, onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label={appName} className="mt-6 flex-1 overflow-y-auto px-3">
      {groups ? (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[0.65rem] font-semibold tracking-[0.12em] text-ink-400 uppercase">
                {group.label}
              </p>
              <ul className="mt-1.5 space-y-1">
                {group.keys.flatMap((key) => {
                  const item = navItems.find((candidate) => candidate.key === key)
                  if (!item) return []
                  return (
                    <NavLink
                      key={item.key}
                      item={item}
                      basePath={basePath}
                      isActive={item.key === activeKey}
                      onNavigate={onNavigate}
                    />
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              basePath={basePath}
              isActive={item.key === activeKey}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
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

interface DemoSidebarProps {
  appName: string
  basePath: string
  navItems: readonly DemoNavItem[]
  groups?: readonly DemoNavGroup[]
  activeKey: string
}

/** Persistent left navigation rail shown at lg and above, shared by every demo application. */
export function DemoSidebar({ appName, basePath, navItems, groups, activeKey }: DemoSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200/80 bg-white lg:flex">
      <SidebarBrand appName={appName} />
      <SidebarNav appName={appName} basePath={basePath} navItems={navItems} groups={groups} activeKey={activeKey} />
      <SidebarAccount />
    </aside>
  )
}

interface DemoMobileNavContentProps extends DemoSidebarProps {
  onNavigate: () => void
}

/** Inner content reused by the mobile drawer in DemoTopbar. */
export function DemoMobileNavContent({
  appName,
  basePath,
  navItems,
  groups,
  activeKey,
  onNavigate,
}: DemoMobileNavContentProps) {
  return (
    <div className="flex h-full flex-col">
      <SidebarBrand appName={appName} />
      <SidebarNav
        appName={appName}
        basePath={basePath}
        navItems={navItems}
        groups={groups}
        activeKey={activeKey}
        onNavigate={onNavigate}
      />
      <SidebarAccount />
    </div>
  )
}
