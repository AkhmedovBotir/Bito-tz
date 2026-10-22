import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'default' | 'accent' | 'danger' | 'success'

const styles: Record<Variant, string> = {
  default:
    'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:bg-slate-50 hover:text-[var(--ink)]',
  accent:
    'border-blue-200 bg-[var(--accent-soft)] text-[var(--accent)] hover:border-[var(--accent)]',
  danger:
    'border-red-200 bg-[var(--danger-soft)] text-[var(--danger)] hover:border-[var(--danger)]',
  success:
    'border-emerald-200 bg-[var(--success-soft)] text-[var(--success)] hover:border-[var(--success)]',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  variant?: Variant
  children: ReactNode
}

export function IconButton({
  label,
  variant = 'default',
  children,
  className = '',
  ...props
}: Props) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={[
        'inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border transition disabled:opacity-50',
        styles[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
