import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { cn } from '../../lib/cn'
import type { NavItem } from '../../types/content'

interface MobileMenuProps {
  id: string
  open: boolean
  items: readonly NavItem[]
  cta: NavItem
  activeId: string | null
  onClose: () => void
  toggleButtonRef: RefObject<HTMLButtonElement | null>
}

/** Collapsible navigation panel shown below the sticky bar on small screens. */
export function MobileMenu({
  id,
  open,
  items,
  cta,
  activeId,
  onClose,
  toggleButtonRef,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        toggleButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, toggleButtonRef])

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <m.div
          key="mobile-menu"
          id={id}
          ref={panelRef}
          tabIndex={-1}
          className="absolute inset-x-0 top-full overflow-hidden border-b border-ink-200 bg-white shadow-card lg:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
        >
          <nav aria-label="Mobile" className="px-5 py-4 sm:px-8">
            <ul className="divide-y divide-ink-100">
              {items.map((item) => {
                const isActive = activeId === item.href.replace('#', '')

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'flex items-center justify-between py-3 text-sm font-medium transition-colors duration-200',
                        isActive ? 'text-accent-600' : 'text-ink-700 hover:text-ink-900',
                      )}
                    >
                      {item.label}
                      <ChevronRight className="size-4 text-ink-300" aria-hidden="true" />
                    </a>
                  </li>
                )
              })}
            </ul>

            <Button href={cta.href} size="md" className="mt-4 w-full" onClick={onClose}>
              {cta.label}
            </Button>
          </nav>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}