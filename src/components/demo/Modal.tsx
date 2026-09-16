import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/**
 * Accessible dialog used for every add/edit/confirm/detail interaction in the
 * demo. Mirrors the focus and Escape handling already established by the
 * marketing site's mobile navigation panel.
 */
export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      panelRef.current?.focus()
    } else {
      triggerRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const fadeDuration = prefersReducedMotion ? 0.01 : 0.2
  const panelOffset = prefersReducedMotion ? 0 : 16
  const panelScale = prefersReducedMotion ? 1 : 0.98

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <m.div
            aria-hidden="true"
            className="absolute inset-0 bg-ink-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeDuration }}
            onClick={onClose}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            className={cn(
              'relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink-200/80 bg-white p-6 shadow-lift sm:p-7',
              className,
            )}
            initial={{ opacity: 0, y: panelOffset, scale: panelScale }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: panelOffset, scale: panelScale }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.25, ease: EASE_OUT_EXPO }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-ink-900">
                  {title}
                </h2>
                {description ? (
                  <p id={descriptionId} className="mt-1 text-sm text-ink-500">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-400 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
