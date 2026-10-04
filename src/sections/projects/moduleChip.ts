import { cn } from '../../lib/cn'

/** Shared look of a module chip — the static manifest and the pinned scenes draw the same object. */
export function moduleChipClassName(highlighted: boolean, tone: 'light' | 'dark' = 'light'): string {
  const isDark = tone === 'dark'
  return cn(
    'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[0.7rem] font-medium transition-colors duration-200 ease-out-expo',
    highlighted
      ? isDark
        ? 'border-accent-500/40 bg-accent-500/10 text-accent-200'
        : 'border-accent-200 bg-accent-50 text-accent-700'
      : isDark
        ? 'border-ink-800 bg-ink-900 text-ink-400'
        : 'border-ink-200/80 bg-white text-ink-600',
  )
}
