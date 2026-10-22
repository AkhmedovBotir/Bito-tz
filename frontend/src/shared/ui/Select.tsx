import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type Props = {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Tanlang',
  searchPlaceholder = 'Qidirish...',
  disabled = false,
  required = false,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setHighlight(0)
    const t = window.setTimeout(() => searchRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  function pick(next: string) {
    onChange(next)
    setOpen(false)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return

    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const item = filtered[highlight]
      if (item && !item.disabled) pick(item.value)
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      {/* native required validation uchun yashirin input */}
      {required ? (
        <input
          tabIndex={-1}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          value={value}
          onChange={() => undefined}
          required
        />
      ) : null}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={[
          'flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 text-left text-sm outline-none transition',
          open
            ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/15'
            : 'border-[var(--border)] hover:border-[var(--accent)]/50',
          disabled ? 'cursor-not-allowed opacity-60' : '',
        ].join(' ')}
      >
        <span
          className={
            selected?.value
              ? 'truncate text-[var(--ink)]'
              : 'truncate text-[var(--muted)]'
          }
        >
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={[
            'h-4 w-4 shrink-0 text-[var(--muted)] transition',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {open ? (
        <div className="absolute z-[70] mt-1 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[var(--muted)]" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setHighlight(0)
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          <ul
            id={listId}
            role="listbox"
            className="max-h-56 overflow-y-auto py-1"
          >
            {filtered.length ? (
              filtered.map((opt, index) => {
                const active = opt.value === value
                const focused = index === highlight
                return (
                  <li key={`${opt.value}-${opt.label}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      disabled={opt.disabled}
                      onMouseEnter={() => setHighlight(index)}
                      onClick={() => {
                        if (!opt.disabled) pick(opt.value)
                      }}
                      className={[
                        'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition',
                        focused ? 'bg-[var(--accent-soft)]' : '',
                        active ? 'font-medium text-[var(--accent)]' : 'text-[var(--ink)]',
                        opt.disabled ? 'cursor-not-allowed opacity-50' : '',
                      ].join(' ')}
                    >
                      <span className="truncate">{opt.label}</span>
                      {active ? <Check className="h-4 w-4 shrink-0" /> : null}
                    </button>
                  </li>
                )
              })
            ) : (
              <li className="px-3 py-3 text-sm text-[var(--muted)]">
                Hech narsa topilmadi
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
