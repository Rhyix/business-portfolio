import { ArrowRight, Mail } from 'lucide-react'
import { company } from '../../data/company'
import { cn } from '../../lib/cn'
import { useScrolled } from '../../lib/hooks'

/** Roughly the hero's height — far enough that the bar never competes with its CTAs. */
const APPEAR_AFTER = 560

/**
 * Persistent call to action for phones.
 *
 * The header's "Start a Project" button is hidden below `sm`, which left a
 * 24-viewport page with no way to reach contact until the visitor happened to
 * scroll into a section that carried its own CTA — and three of them carry
 * none. This is that missing path, and it is the mirror of the header button
 * rather than an addition: the two are never on screen together.
 *
 * Styled as an iOS material — a translucent, saturated, blurred pill holding
 * solid controls, inset from the edges and clear of the home indicator. That
 * means a `backdrop-filter`, which is the one effect deliberately removed from
 * the navbar for costing a re-blur on every scroll frame. The cost is accepted
 * here on much narrower terms: it is phone-only, it is a ~343x56 pill rather
 * than a full-width bar across every section, and it does not exist at all
 * until the visitor is past the hero. The blur radius is kept at `xl` rather
 * than `2xl` for the same reason — still unmistakably glass, materially
 * cheaper to composite.
 */
export function MobileActionBar() {
  const past = useScrolled(APPEAR_AFTER)

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 px-4 transition-[opacity,transform] duration-300 ease-out-expo sm:hidden',
        past ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
      // Clears the home indicator on notched iPhones, and keeps a sensible
      // margin everywhere else. Needs `viewport-fit=cover` to resolve on iOS.
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <div
        aria-hidden={past ? undefined : true}
        className={cn(
          'flex items-center gap-2 rounded-[1.375rem] p-1.5',
          'border border-white/60 bg-white/70 backdrop-blur-xl backdrop-saturate-[1.8]',
          'shadow-[0_8px_32px_rgba(11,14,18,0.16)]',
        )}
      >
        <a
          href={`mailto:${company.email}`}
          tabIndex={past ? undefined : -1}
          aria-label={`Email ${company.email}`}
          className="grid size-11 shrink-0 place-items-center rounded-[1rem] text-ink-700 transition-colors duration-200 hover:bg-ink-950/5"
        >
          <Mail className="size-[1.125rem]" aria-hidden="true" />
        </a>
        <a
          href="#contact"
          tabIndex={past ? undefined : -1}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[1rem] bg-ink-950 text-sm font-medium text-white transition-colors duration-200 hover:bg-ink-800"
        >
          Start a Project
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
