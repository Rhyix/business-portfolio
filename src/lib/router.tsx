import { useCallback, useEffect, useState } from 'react'
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

  const navigate = useCallback((to: string) => {
    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to)
      setPath(to)
    }
    window.scrollTo(0, 0)
  }, [])

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
