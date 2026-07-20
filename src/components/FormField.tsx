import { useId, type ReactNode } from 'react'

type FormFieldProps = {
  label: string
  error?: string
  showError: boolean
  children: (ids: { inputId: string; errorId: string }) => ReactNode
}

export function FormField({ label, error, showError, children }: FormFieldProps) {
  const baseId = useId()
  const inputId = `${baseId}-input`
  const errorId = `${baseId}-error`
  const hasError = showError && Boolean(error)

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={inputId}>
        {label}
      </label>
      {children({ inputId, errorId })}
      {hasError ? (
        <p className="form-field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
