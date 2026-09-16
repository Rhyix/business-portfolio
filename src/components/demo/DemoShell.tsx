import type { ReactNode } from 'react'
import { useDocumentMeta } from '../../lib/useDocumentMeta'
import { DemoSidebar } from './DemoSidebar'
import { DemoTopbar } from './DemoTopbar'

interface DemoShellProps {
  activeKey: string
  pageTitle: string
  children: ReactNode
}

/**
 * Application shell for the Business Management System demo: a fixed
 * sidebar/topbar frame around routed page content. Built to be reused by
 * future demo systems (HR, recruitment, inventory, …).
 */
export function DemoShell({ activeKey, pageTitle, children }: DemoShellProps) {
  useDocumentMeta({
    title: `${pageTitle} — Business Management System Demo | AETEX Tech Solution`,
    description:
      'Interactive sample solution demonstrating the dashboards, records and workflows AETEX Tech Solution designs and builds. All data shown is fictional demo data.',
  })

  return (
    <div className="flex h-svh overflow-hidden bg-ink-50/40 text-ink-700">
      <DemoSidebar activeKey={activeKey} />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <DemoTopbar activeKey={activeKey} pageTitle={pageTitle} />
        <main id="demo-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
