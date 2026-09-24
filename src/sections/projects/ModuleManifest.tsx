import type { DemoNavItem } from '../../components/demo/types'
import { cn } from '../../lib/cn'

interface ModuleManifestProps {
  modules: DemoNavItem[]
  /** Module keys drawn in the accent treatment — the ones carrying the point being made. */
  highlightKeys?: ReadonlySet<string>
  tone?: 'light' | 'dark'
  /**
   * Modules past this index collapse into a "+N" chip below `sm`, so a phone
   * shows a readable sample instead of a wall of chips. Everything stays in the
   * DOM and in the accessible name, so nothing is lost — only visually folded.
   */
  collapseAfter?: number
  className?: string
}

/**
 * A system's real modules, drawn as the running application draws them —
 * icon plus label, straight from that demo's own navigation manifest. Nothing
 * here is a sketch or a placeholder: every chip is a screen the visitor can
 * open in the demo.
 *
 * Decorative at the item level: the surrounding panel already names the system
 * and links to it, and the module list is summarised in text beside it, so a
 * screen reader gets the meaning without reading a dozen chips per system.
 */
export function ModuleManifest({
  modules,
  highlightKeys,
  tone = 'light',
  collapseAfter,
  className,
}: ModuleManifestProps) {
  const isDark = tone === 'dark'
  const hiddenCount = collapseAfter === undefined ? 0 : Math.max(0, modules.length - collapseAfter)

  return (
    <ul aria-hidden="true" className={cn('flex flex-wrap gap-1.5', className)}>
      {modules.map((module, index) => {
        const Icon = module.icon
        const highlighted = highlightKeys?.has(module.key) ?? false
        // `max-sm:hidden` rather than `hidden sm:…`: these chips carry no other
        // display utility, but keeping the collapse on one max-* variant means
        // it can't be undone by a base class landing later in the stylesheet.
        const collapsed = collapseAfter !== undefined && index >= collapseAfter

        return (
          <li
            key={module.key}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[0.7rem] font-medium transition-colors duration-200 ease-out-expo',
              highlighted
                ? isDark
                  ? 'border-accent-500/40 bg-accent-500/10 text-accent-200'
                  : 'border-accent-200 bg-accent-50 text-accent-700'
                : isDark
                  ? 'border-ink-800 bg-ink-900 text-ink-400'
                  : 'border-ink-200/80 bg-white text-ink-600',
              collapsed && 'max-sm:hidden',
            )}
          >
            <Icon className={cn('size-3 shrink-0', highlighted ? '' : 'opacity-60')} aria-hidden="true" />
            {module.label}
          </li>
        )
      })}

      {hiddenCount > 0 ? (
        <li
          className={cn(
            'inline-flex items-center rounded-md border border-dashed px-2 py-1 text-[0.7rem] font-medium sm:hidden',
            isDark ? 'border-ink-800 text-ink-500' : 'border-ink-300 text-ink-500',
          )}
        >
          +{hiddenCount}
        </li>
      ) : null}
    </ul>
  )
}
