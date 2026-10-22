import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="block text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 outline-none focus:border-[var(--accent)]'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return <input ref={ref} className={`${inputClass} ${className}`} {...props} />
  }
)

export { Select, type SelectOption } from './Select'

export function Button({
  children,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}) {
  const styles =
    variant === 'primary'
      ? 'bg-[var(--accent)] text-white'
      : variant === 'danger'
        ? 'bg-[var(--danger)] text-white'
        : 'border border-[var(--border)] text-[var(--ink)]'
  return (
    <button
      className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${styles}`}
      {...props}
    >
      {children}
    </button>
  )
}
