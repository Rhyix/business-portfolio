import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { buttonClassName } from './buttonStyles'
import type { ButtonSize, ButtonVariant } from './buttonStyles'

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
      <a href={href} className={buttonClassName(variant, size, className)} {...anchorProps}>
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
    <button type={type} className={buttonClassName(variant, size, className)} {...buttonProps}>
      {children}
    </button>
  )
}
