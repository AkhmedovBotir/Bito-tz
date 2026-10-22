import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'default' | 'accent' | 'danger' | 'success'

const styles: Record<Variant, string> = {
  default:
    'border-[var(--border)] text-[var(--muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]',
  accent:
    'border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)] hover:border-[var(--accent)]',
  danger:
    'border-red-200 bg-red-50 text-[var(--danger)] hover:border-[var(--danger)]',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-500',
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
        'inline-flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:opacity-50',
        styles[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
