import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const baseStyles =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 ease-out'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink-950 text-white hover:bg-ink-800',
  secondary:
    'border border-ink-200 bg-white text-ink-800 shadow-soft hover:border-ink-300 hover:bg-ink-50',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.9375rem]',
}

interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type ButtonLinkProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children'> & { href: string }

type ButtonNativeProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> & { href?: undefined }

/**
 * Shared call-to-action control.
 * Renders an anchor when `href` is provided, otherwise a real button element.
 */
export function Button(props: ButtonLinkProps | ButtonNativeProps) {
  if (props.href !== undefined) {
    const { href, variant = 'primary', size = 'md', className, children, ...anchorProps } = props

    return (
      <a
        href={href}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    type = 'button',
    ...buttonProps
  } = props

  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...buttonProps}
    >
      {children}
    </button>
  )
}