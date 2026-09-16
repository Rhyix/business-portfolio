import { useEffect } from 'react'

interface DocumentMeta {
  title: string
  description: string
}

/**
 * Applies a page title and meta description for the lifetime of the calling
 * component, restoring the previous values on unmount. Used by demo routes,
 * which are rendered client-side only and have no static markup of their own.
 */
export function useDocumentMeta({ title, description }: DocumentMeta) {
  useEffect(() => {
    const previousTitle = document.title
    const descriptionTag = document.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag?.getAttribute('content') ?? null

    document.title = title
    descriptionTag?.setAttribute('content', description)

    return () => {
      document.title = previousTitle
      if (previousDescription !== null) descriptionTag?.setAttribute('content', previousDescription)
    }
  }, [title, description])
}
