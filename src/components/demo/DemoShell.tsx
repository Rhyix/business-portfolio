import type { ReactNode } from 'react'
import { useDocumentMeta } from '../../lib/useDocumentMeta'
import { DemoSidebar } from './DemoSidebar'
import { DemoTopbar } from './DemoTopbar'
import type { DemoNavItem, DemoNotification } from './types'

interface DemoShellProps {
  appName: string
  basePath: string
  navItems: readonly DemoNavItem[]
  notifications: readonly DemoNotification[]
  activeKey: string
  pageTitle: string
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
  notifications,
  activeKey,
  pageTitle,
  children,
}: DemoShellProps) {
  useDocumentMeta({
    title: `${pageTitle} — ${appName} Demo | AETEX Tech Solution`,
    description: `Interactive sample solution demonstrating the ${appName} workflows AETEX Tech Solution designs and builds. All data shown is fictional demo data.`,
  })

  return (
    <div className="flex h-svh overflow-hidden bg-ink-50/40 text-ink-700">
      <DemoSidebar appName={appName} basePath={basePath} navItems={navItems} activeKey={activeKey} />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <DemoTopbar
          appName={appName}
          basePath={basePath}
          navItems={navItems}
          notifications={notifications}
          activeKey={activeKey}
          pageTitle={pageTitle}
        />
        <main id="demo-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
