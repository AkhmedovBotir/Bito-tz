import { useEffect, useState } from 'react'
import { Bell, LogOut, Menu, Search } from 'lucide-react'
import { useAuth } from '@/modules/auth/AuthContext'
import { CommandPalette } from './CommandPalette'

type Props = {
  menuOpen: boolean
  onMenuClick: () => void
}

export function Navbar({ menuOpen, onMenuClick }: Props) {
  const { store, logout } = useAuth()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[var(--header-h)] items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-3 shadow-sm md:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--muted)] hover:bg-slate-50 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden min-w-[240px] max-w-sm items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 px-2.5 py-1.5 text-left text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:bg-white md:flex"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-xs">Bo‘lim qidirish…</span>
            <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
              Ctrl+K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label="Bo‘lim qidirish"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--muted)] hover:bg-slate-50 md:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--muted)] hover:bg-slate-50 sm:inline-flex"
            title="Bildirishnomalar"
            aria-label="Bildirishnomalar"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 py-1 pl-1.5 pr-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[var(--accent)] text-[11px] font-bold text-white">
              {(store?.name || 'D').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="truncate text-xs font-semibold text-[var(--ink)]">
                {store?.name || 'Do‘kon'}
              </p>
              <p className="truncate text-[10px] text-[var(--muted)]">
                @{store?.username}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Chiqish"
            aria-label="Chiqish"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
