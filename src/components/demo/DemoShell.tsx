import type { ReactNode } from 'react'
import { useDocumentMeta } from '../../lib/useDocumentMeta'
import { useRouter } from '../../lib/useRouter'
import { DemoSidebar } from './DemoSidebar'
import { DemoTopbar } from './DemoTopbar'
import type { DemoNavGroup, DemoNavItem, DemoNotification, GlobalSearchResult } from './types'

interface DemoShellProps {
  appName: string
  basePath: string
  navItems: readonly DemoNavItem[]
  /** Optional grouped sidebar sections (see DemoNavGroup); flat list is used when omitted. */
  groups?: readonly DemoNavGroup[]
  notifications: readonly DemoNotification[]
  activeKey: string
  pageTitle: string
  /** Optional live cross-entity topbar search; plain decorative search is used when omitted. */
  globalSearch?: {
    query: string
    onQueryChange: (value: string) => void
    results: readonly GlobalSearchResult[]
    /** Overrides the default topbar search placeholder text. */
    placeholder?: string
  }
  children: ReactNode
}

/**
 * Application shell shared by every demo system in the AETEX portfolio: a
 * fixed sidebar/topbar frame around routed page content. `appName`,
 * `basePath`, `navItems` and `notifications` are supplied by each demo (see
 * src/data/demos/*\/navigation.ts) so this shell stays generic.
 */
export function DemoShell({
  appName,
  basePath,
  navItems,
  groups,
  notifications,
  activeKey,
  pageTitle,
  globalSearch,
  children,
}: DemoShellProps) {
  const { path } = useRouter()
  // Same root test App.tsx routes with, plus tolerance for a trailing slash so
  // "/solutions/inventory-management/" is still the root rather than a child.
  const normalizedPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  const isDemoRoot = normalizedPath === basePath

  useDocumentMeta({
    title: `${pageTitle} — ${appName} Demo | AETEX Tech Solution`,
    description: `Interactive sample solution demonstrating the ${appName} workflows AETEX Tech Solution designs and builds. All data shown is fictional demo data.`,
    /*
      A demo's landing page is a genuine destination worth finding, so it stays
      indexable. Its inner pages are not: across the seven demos they reuse the
      same page names — "Dashboard", "Reports" and "Settings" appear in all
      seven — over tables of fictional records, which is thin, duplicated
      content with no standalone context. "follow" is kept so their links still
      lead crawlers back to the marketing page.
    */
    robots: isDemoRoot ? undefined : 'noindex, follow',
  })

  return (
    <div className="flex h-svh overflow-hidden bg-ink-50/40 text-ink-700">
      <DemoSidebar appName={appName} basePath={basePath} navItems={navItems} groups={groups} activeKey={activeKey} />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <DemoTopbar
          appName={appName}
          basePath={basePath}
          navItems={navItems}
          groups={groups}
          notifications={notifications}
          activeKey={activeKey}
          pageTitle={pageTitle}
          globalSearch={globalSearch}
        />
        <main id="demo-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
