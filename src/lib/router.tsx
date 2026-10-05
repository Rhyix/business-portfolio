import { useCallback, useEffect, useRef, useState } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { RouterContext, useRouter } from './useRouter'

/**
 * Minimal history-API router.
 * The site is a single marketing page plus one demo application, so a full
 * routing library isn't warranted — this covers path matching, back/forward
 * navigation and in-app links in well under 100 lines.
 */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // A hash in `to` names a section on the destination page, which cannot be
  // scrolled to until that page has rendered. Parked here and consumed by the
  // effect below, which runs after the commit that swaps the page in.
  const pendingHashRef = useRef<string | null>(null)

  const navigate = useCallback((to: string) => {
    const hashIndex = to.indexOf('#')
    const pathname = hashIndex === -1 ? to : to.slice(0, hashIndex) || '/'
    const hash = hashIndex === -1 ? '' : to.slice(hashIndex + 1)

    if (to !== window.location.pathname + window.location.hash) {
      window.history.pushState({}, '', to)
      setPath(pathname)
    }

    if (hash) {
      pendingHashRef.current = hash
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    const hash = pendingHashRef.current
    if (!hash) return
    pendingHashRef.current = null
    // Instant: the page has just been replaced, so animating the distance
    // would scrub every scroll-driven section between here and there.
    document.getElementById(hash)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [path])

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
}

/** Internal navigation link. Falls back to native browser behaviour for modified clicks. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()

  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.button !== 0) return
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
