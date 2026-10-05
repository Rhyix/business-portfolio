import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { EASE_OUT_EXPO } from '../../lib/motion'
import { railIndexForSection } from '../../data/sectionRail'
import { useNavigation } from '../../lib/useNavigation'
import { cn } from '../../lib/cn'
import type { NavItem } from '../../types/content'

/**
 * The 64px sticky bar plus a little air. Computed rather than left to
 * scrollIntoView, which honours `scroll-padding-top` AND each Section's
 * `scroll-mt-24` and so stacked them into a 192px gap above the heading.
 */
const HEADER_OFFSET = 80

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
  const prefersReducedMotion = useReducedMotion()
  const navigation = useNavigation()

  /**
   * The phone equivalent of committing the System Dial.
   *
   * These were plain hash links, so a tap fell through to the browser's own
   * smooth scroll: it travelled the whole distance — up to twenty viewports —
   * and the destination arrived with no more emphasis than if the visitor had
   * scrolled there by hand. Announcing the commit is what upgrades the
   * destination to the strong, direction-aware chapter entrance, and jumping
   * rather than animating is what stops every section in between playing on
   * the way past. `useCompactMotion` already scales that entrance down for
   * small screens, so this reads as deliberate rather than loud.
   */
  const handleNavigate = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return
      const target = document.getElementById(href.slice(1))
      if (!target) return

      event.preventDefault()
      const index = railIndexForSection(href.slice(1))
      if (index !== -1) navigation?.notifyDialCommit(index)
      onClose()
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
    },
    [navigation, onClose],
  )

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
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: EASE_OUT_EXPO }}
        >
          <nav aria-label="Mobile" className="px-5 py-4 sm:px-8">
            <ul className="divide-y divide-ink-100">
              {items.map((item) => {
                const isActive = activeId === item.href.replace('#', '')

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => handleNavigate(event, item.href)}
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

            <Button
              href={cta.href}
              size="md"
              className="mt-4 w-full"
              onClick={(event) => handleNavigate(event, cta.href)}
            >
              {cta.label}
            </Button>
          </nav>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}