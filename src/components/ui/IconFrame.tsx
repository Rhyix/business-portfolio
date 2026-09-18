import type { IconComponent } from '../../types/content'
import { cn } from '../../lib/cn'

type IconFrameSize = 'sm' | 'md' | 'lg'
type IconFrameShape = 'rounded' | 'square'

const sizeStyles: Record<IconFrameShape, Record<IconFrameSize, { frame: string; icon: string }>> = {
  rounded: {
    sm: { frame: 'size-9 rounded-lg', icon: 'size-4' },
    md: { frame: 'size-11 rounded-xl', icon: 'size-5' },
    lg: { frame: 'size-12 rounded-2xl', icon: 'size-5' },
  },
  square: {
    sm: { frame: 'size-9 rounded-md', icon: 'size-4' },
    md: { frame: 'size-11 rounded-md', icon: 'size-5' },
    lg: { frame: 'size-12 rounded-md', icon: 'size-5' },
  },
}

interface IconFrameProps {
  icon: IconComponent
  size?: IconFrameSize
  /** "square" trades the rounded tile for the sharper `rounded-md` corner used by structural/dark treatments. */
  shape?: IconFrameShape
  tone?: 'light' | 'dark'
  className?: string
}

/** Tile that frames a decorative icon. */
export function IconFrame({ icon: Icon, size = 'md', shape = 'rounded', tone = 'light', className }: IconFrameProps) {
  const { frame, icon } = sizeStyles[shape][size]

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center border',
        frame,
        tone === 'dark'
          ? 'border-white/10 bg-white/5 text-accent-300'
          : 'border-ink-200/80 bg-white text-accent-600 shadow-soft',
        className,
      )}
    >
      <Icon className={icon} strokeWidth={1.75} />
    </span>
  )
}