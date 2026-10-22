import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { flatNavItems } from './navItems'

type Props = {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return flatNavItems
    return flatNavItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q),
    )
  }, [query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setHighlight(0)
    const t = window.setTimeout(() => inputRef.current?.focus(), 10)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    setHighlight(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlight((h) => Math.max(h - 1, 0))
      }
      if (e.key === 'Enter' && filtered[highlight]) {
        e.preventDefault()
        go(filtered[highlight].to)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, filtered, highlight, onClose])

  function go(to: string) {
    navigate(to)
    onClose()
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[12vh] sm:px-4">
          <motion.button
            type="button"
            aria-label="Yopish"
            className="absolute inset-0 bg-slate-900/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Bo‘lim qidirish"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-[var(--muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bo‘lim qidirish…"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--muted)]"
              />
              <kbd className="hidden rounded border border-[var(--border)] bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)] sm:inline">
                Esc
              </kbd>
            </div>

            <ul className="max-h-[50vh] overflow-y-auto py-1">
              {filtered.map((item, idx) => {
                const Icon = item.icon
                const active = idx === highlight
                return (
                  <li key={item.to}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => go(item.to)}
                      className={[
                        'flex w-full items-center gap-3 px-3 py-2 text-left text-[13px]',
                        active
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-[var(--ink)] hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {item.label}
                      </span>
                      <span className="shrink-0 text-[11px] text-[var(--muted)]">
                        {item.group}
                      </span>
                    </button>
                  </li>
                )
              })}
              {!filtered.length ? (
                <li className="px-3 py-6 text-center text-[13px] text-[var(--muted)]">
                  Hech narsa topilmadi
                </li>
              ) : null}
            </ul>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
