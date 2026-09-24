import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import { MobileMenu } from './MobileMenu'
import { navigationCta, primaryNavigation, sectionIds } from '../../data/navigation'
import { useActiveSection, useScrolled } from '../../lib/hooks'
import { cn } from '../../lib/cn'

const MOBILE_MENU_ID = 'mobile-navigation'

/** Sticky primary navigation with an active-section indicator and mobile menu. */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(8)
  const activeId = useActiveSection(sectionIds)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }

    desktopQuery.addEventListener('change', handleChange)
    return () => desktopQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'border-ink-200/80 bg-white/85 backdrop-blur-md'
          : 'border-transparent bg-white/60 backdrop-blur-sm',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo />

          {/* No desktop link list: the System Dial is the visual navigation on
              desktop, and SiteLayout carries the conventional section list for
              keyboard and assistive use. Below lg the drawer is unchanged. */}

          <div className="flex items-center gap-2">
            {/* Button's base class list already sets inline-flex and cn() does not
                resolve conflicts, so `hidden` alone would lose to it. The drawer
                carries this CTA below sm. */}
            <Button href={navigationCta.href} size="sm" className="max-sm:hidden">
              {navigationCta.label}
            </Button>

            <button
              ref={toggleButtonRef}
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_MENU_ID}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex size-11 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-700 transition-colors duration-200 hover:bg-ink-50 lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu
        id={MOBILE_MENU_ID}
        open={menuOpen}
        items={primaryNavigation}
        cta={navigationCta}
        activeId={activeId}
        onClose={closeMenu}
        toggleButtonRef={toggleButtonRef}
      />
    </header>
  )
}