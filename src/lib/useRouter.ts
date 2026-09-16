import { createContext, useContext } from 'react'

export interface RouterContextValue {
  path: string
  navigate: (to: string) => void
}

export const RouterContext = createContext<RouterContextValue | null>(null)

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext)
  if (!context) throw new Error('useRouter must be used within a RouterProvider')
  return context
}
