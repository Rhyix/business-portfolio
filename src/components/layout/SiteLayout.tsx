import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { SectionDial } from './SectionDial'
import { railSections } from '../../data/sectionRail'
import { NavigationProvider } from '../../lib/navigation'

interface SiteLayoutProps {
  children: ReactNode
}

/** Application shell: skip link, sticky navigation, page content and footer. */
export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <NavigationProvider>
    <div className="flex min-h-svh flex-col bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      {/* The canonical section list. The desktop bar carries no links — the
          System Dial is the visual navigation — so this is the conventional
          path: always in the DOM and the accessibility tree, and revealed for
          sighted keyboard users the moment it takes focus, exactly like the
          skip link above. It also covers #platform and #technology, which
          primaryNavigation never listed. */}
      <nav aria-label="Sections" className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-4 focus-within:left-4 focus-within:z-[60] focus-within:rounded-xl focus-within:border focus-within:border-ink-200 focus-within:bg-white focus-within:p-2 focus-within:shadow-lift">
        <ul className="flex flex-wrap gap-1">
          {railSections.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className="block rounded-full px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50 hover:text-ink-900"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Navbar />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <SectionDial />
      <Footer />
    </div>
    </NavigationProvider>
  )
}