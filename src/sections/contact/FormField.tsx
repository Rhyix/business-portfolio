import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

/** Label, control and inline validation message used by the contact form. */
export function FormField({ id, label, error, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-ink-800">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}