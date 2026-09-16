import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { Bell, LogOut, Menu, Search, Settings, X } from 'lucide-react'
import { Link } from '../../lib/router'
import { useClickOutside } from '../../lib/hooks'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { DemoMobileNavContent } from './DemoSidebar'
import { SearchInput } from './SearchInput'
import { cn } from '../../lib/cn'
import type { DemoNavGroup, DemoNavItem, DemoNotification, GlobalSearchResult } from './types'

interface GlobalSearchProps {
  query: string
  onQueryChange: (value: string) => void
  results: readonly GlobalSearchResult[]
}

interface DemoTopbarProps {
  appName: string
  basePath: string
  navItems: readonly DemoNavItem[]
  groups?: readonly DemoNavGroup[]
  notifications: readonly DemoNotification[]
  activeKey: string
  pageTitle: string
  /** When supplied, the topbar search becomes a live cross-entity search with a results dropdown. */
  globalSearch?: GlobalSearchProps
}

/** Application top bar: mobile drawer trigger, page title, search, notifications and user menu. */
export function DemoTopbar({
  appName,
  basePath,
  navItems,
  groups,
  notifications,
  activeKey,
  pageTitle,
  globalSearch,
}: DemoTopbarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [localSearchValue, setLocalSearchValue] = useState('')
  const [searchResultsOpen, setSearchResultsOpen] = useState(false)

  const navToggleRef = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const closeNotifications = useCallback(() => setNotificationsOpen(false), [])
  const closeUserMenu = useCallback(() => setUserMenuOpen(false), [])
  const closeSearchResults = useCallback(() => setSearchResultsOpen(false), [])
  const notificationsRef = useClickOutside<HTMLDivElement>(notificationsOpen, closeNotifications)
  const userMenuRef = useClickOutside<HTMLDivElement>(userMenuOpen, closeUserMenu)
  const searchRef = useClickOutside<HTMLDivElement>(searchResultsOpen, closeSearchResults)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileNavOpen(false)
    }
    desktopQuery.addEventListener('change', handleChange)
    return () => desktopQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false)
        navToggleRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileNavOpen])

  useEffect(() => {
    if (!mobileNavOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileNavOpen])

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-ink-200/80 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
        <button
          ref={navToggleRef}
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-expanded={mobileNavOpen}
          aria-controls="demo-mobile-nav"
          aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-ink-200 text-ink-700 transition-colors duration-200 hover:bg-ink-50 lg:hidden"
        >
          {mobileNavOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>

        <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-ink-900 sm:text-lg">{pageTitle}</h1>

        <div ref={searchRef} className="relative hidden w-64 md:block">
          <SearchInput
            value={globalSearch ? globalSearch.query : localSearchValue}
            onChange={globalSearch ? globalSearch.onQueryChange : setLocalSearchValue}
            onFocus={() => globalSearch && setSearchResultsOpen(true)}
            placeholder={globalSearch ? 'Search customers, orders, employees…' : 'Search this workspace…'}
            aria-label={globalSearch ? 'Search across the platform' : 'Search this workspace'}
          />

          {globalSearch ? (
            <AnimatePresence>
              {searchResultsOpen && globalSearch.query.trim().length > 0 ? (
                <m.div
                  role="listbox"
                  aria-label="Search results"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.15 }}
                  className="absolute top-full left-0 mt-2 w-full overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-lift"
                >
                  {globalSearch.results.length > 0 ? (
                    <ul className="max-h-80 divide-y divide-ink-100 overflow-y-auto">
                      {globalSearch.results.map((result) => (
                        <li key={result.id}>
                          <Link
                            to={`${basePath}${result.to}`}
                            onClick={() => setSearchResultsOpen(false)}
                            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors duration-200 hover:bg-ink-50"
                          >
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-ink-900">{result.label}</span>
                              {result.sublabel ? (
                                <span className="block truncate text-xs text-ink-500">{result.sublabel}</span>
                              ) : null}
                            </span>
                            <span className="shrink-0 rounded-full border border-ink-200/80 px-2 py-0.5 text-[0.65rem] font-medium text-ink-500">
                              {result.kind}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="flex items-center gap-2 px-4 py-4 text-sm text-ink-500">
                      <Search className="size-4 text-ink-400" aria-hidden="true" />
                      No matches across customers, products, orders, employees or invoices.
                    </p>
                  )}
                </m.div>
              ) : null}
            </AnimatePresence>
          ) : null}
        </div>

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open)
              setUserMenuOpen(false)
            }}
            aria-expanded={notificationsOpen}
            aria-haspopup="true"
            aria-label="Notifications"
            className="relative inline-flex size-11 items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.5 size-2 rounded-full bg-accent-600 ring-2 ring-white"
            />
          </button>

          <AnimatePresence>
            {notificationsOpen ? (
              <m.div
                role="menu"
                aria-label="Notifications"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.15 }}
                className="absolute top-full right-0 mt-2 w-72 overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-lift"
              >
                <p className="border-b border-ink-100 px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  Notifications
                </p>
                <ul className="divide-y divide-ink-100">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="px-4 py-3">
                      <p className="text-sm font-medium text-ink-900">{notification.title}</p>
                      <p className="mt-0.5 text-xs text-ink-500">{notification.detail}</p>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-ink-100 px-4 py-2.5 text-center text-xs text-ink-400">
                  Demo notifications — not live alerts.
                </p>
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div ref={userMenuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen((open) => !open)
              setNotificationsOpen(false)
            }}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            aria-label="Account menu"
            className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1 transition-colors duration-200 hover:bg-ink-100"
          >
            <span className="grid size-9 place-items-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700">
              AU
            </span>
          </button>

          <AnimatePresence>
            {userMenuOpen ? (
              <m.div
                role="menu"
                aria-label="Account"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.15 }}
                className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-lift"
              >
                <div className="border-b border-ink-100 px-4 py-3">
                  <p className="text-sm font-medium text-ink-900">Admin User</p>
                  <p className="text-xs text-ink-500">Demo Account</p>
                </div>
                <ul className="py-1.5">
                  <li>
                    <Link
                      to={`${basePath}/settings`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 transition-colors duration-200 hover:bg-ink-50 hover:text-ink-900"
                    >
                      <Settings className="size-4" aria-hidden="true" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 transition-colors duration-200 hover:bg-ink-50 hover:text-ink-900"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Exit demo
                    </Link>
                  </li>
                </ul>
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      {/*
        Rendered as a sibling of <header>, not a descendant: the header's
        backdrop-blur establishes a containing block for fixed-position
        descendants, which would otherwise clip this overlay to the header's
        own height instead of the full viewport.
      */}
      <AnimatePresence>
        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <m.div
              aria-hidden="true"
              className="absolute inset-0 bg-ink-950/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <m.div
              id="demo-mobile-nav"
              className={cn('absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-lift')}
              initial={{ x: prefersReducedMotion ? 0 : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : '-100%' }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.25, ease: EASE_OUT_EXPO }}
            >
              <DemoMobileNavContent
                appName={appName}
                basePath={basePath}
                navItems={navItems}
                groups={groups}
                activeKey={activeKey}
                onNavigate={() => setMobileNavOpen(false)}
              />
            </m.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
