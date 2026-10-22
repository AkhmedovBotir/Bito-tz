import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="block text-[13px]">
      <span className="mb-1 block font-medium text-[var(--muted)]">{label}</span>
      <div>{children}</div>
    </div>
  )
}

const inputClass =
  'w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 text-[13px] text-[var(--ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15'

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={`${inputClass} ${className}`} {...props} />
})

export { Select, type SelectOption } from './Select'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}) {
  const styles =
    variant === 'primary'
      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
      : variant === 'danger'
        ? 'bg-[var(--danger)] text-white hover:bg-red-700'
        : 'border border-[var(--border)] bg-white text-[var(--ink)] hover:bg-slate-50'
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-[var(--radius)] px-3 py-2 text-[13px] font-medium transition disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
