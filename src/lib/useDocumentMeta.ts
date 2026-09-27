import { useEffect } from 'react'

interface DocumentMeta {
  title: string
  description: string
  /**
   * Overrides the document's robots directive while the caller is mounted.
   * Omit to leave index.html's own directive in place.
   */
  robots?: string
}

/**
 * Applies a page title and meta description for the lifetime of the calling
 * component, restoring the previous values on unmount. Used by demo routes,
 * which are rendered client-side only and have no static markup of their own.
 */
export function useDocumentMeta({ title, description, robots }: DocumentMeta) {
  useEffect(() => {
    const previousTitle = document.title
    const descriptionTag = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag?.getAttribute('content') ?? null

    document.title = title
    descriptionTag?.setAttribute('content', description)

    // Only touched when a caller actually asks for an override, so pages that
    // say nothing about indexing leave the document's own directive alone.
    const robotsTag = robots ? document.querySelector('meta[name="robots"]') : null
    const previousRobots = robotsTag?.getAttribute('content') ?? null
    if (robotsTag && robots) robotsTag.setAttribute('content', robots)

    return () => {
      document.title = previousTitle
      if (previousDescription !== null) descriptionTag?.setAttribute('content', previousDescription)
      if (previousRobots !== null) robotsTag?.setAttribute('content', previousRobots)
    }
  }, [title, description, robots])
}
