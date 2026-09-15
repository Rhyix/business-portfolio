import type { IconComponent } from '../../types/content'
import { cn } from '../../lib/cn'

type IconFrameSize = 'sm' | 'md' | 'lg'

const sizeStyles: Record<IconFrameSize, { frame: string; icon: string }> = {
  sm: { frame: 'size-9 rounded-lg', icon: 'size-4' },
  md: { frame: 'size-11 rounded-xl', icon: 'size-5' },
  lg: { frame: 'size-12 rounded-2xl', icon: 'size-5' },
}

interface IconFrameProps {
  icon: IconComponent
  size?: IconFrameSize
  tone?: 'light' | 'dark'
  className?: string
}

/** Rounded tile that frames a decorative icon. */
export function IconFrame({ icon: Icon, size = 'md', tone = 'light', className }: IconFrameProps) {
  const { frame, icon } = sizeStyles[size]

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