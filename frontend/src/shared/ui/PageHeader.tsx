import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: Props) {
  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] pb-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-[var(--accent)]" />
          <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h2>
        </div>
        {description ? (
          <p className="mt-1 pl-3 text-[13px] text-[var(--muted)]">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
