import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  // Adds a show/hide toggle. Use it on password fields only.
  revealable?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, revealable = false, type = 'text', className = '', ...rest },
  ref,
) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)
  const inputType = revealable && revealed ? 'text' : type

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-10 w-full rounded-md border bg-surface px-3 text-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/15 ${
            revealable ? 'pr-10' : ''
          } ${error ? 'border-danger' : 'border-border'} ${className}`}
          {...rest}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-text-muted transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
          >
            {revealed ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
})
