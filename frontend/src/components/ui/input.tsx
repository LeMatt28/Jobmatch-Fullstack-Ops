import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = error ? `${inputId}-error` : undefined
    const hintId  = hint  ? `${inputId}-hint`  : undefined

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-destructive" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className={cn(
            'flex h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm',
            'text-text-primary placeholder:text-text-disabled',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-destructive focus:ring-destructive'
              : 'border-border',
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className="text-xs text-text-secondary">{hint}</p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
