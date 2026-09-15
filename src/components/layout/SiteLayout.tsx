import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

interface SiteLayoutProps {
  children: ReactNode
}

/** Application shell: skip link, sticky navigation, page content and footer. */
export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}