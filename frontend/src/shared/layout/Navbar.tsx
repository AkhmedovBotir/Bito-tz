import { LogOut } from 'lucide-react'
import { useAuth } from '@/modules/auth/AuthContext'

type Props = {
  menuOpen: boolean
  onMenuClick: () => void
}

export function Navbar({ menuOpen, onMenuClick }: Props) {
  const { store, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[linear-gradient(120deg,#145a3d_0%,#1f6b4a_45%,#2d8a62_100%)] text-white shadow-sm">
      <div className="flex items-center justify-between gap-3 px-3 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            aria-expanded={menuOpen}
            className="relative flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 transition hover:bg-white/25 lg:hidden"
          >
            <span
              className={[
                'absolute h-[2px] w-5 rounded-full bg-white transition duration-200',
                menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-[6px]',
              ].join(' ')}
            />
            <span
              className={[
                'absolute h-[2px] w-5 rounded-full bg-white transition duration-200',
                menuOpen ? 'scale-x-0 opacity-0' : 'opacity-100',
              ].join(' ')}
            />
            <span
              className={[
                'absolute h-[2px] w-5 rounded-full bg-white transition duration-200',
                menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[6px]',
              ].join(' ')}
            />
          </button>

          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight">
              {store?.name || 'Do‘kon'}
            </p>
            <p className="truncate text-xs text-white/75">
              {store?.phone} · login: {store?.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-full bg-white/15 px-3 py-1.5 text-xs text-white/90 sm:block">
            Bugungi ish jarayoni
          </div>
          <button
            type="button"
            onClick={logout}
            title="Chiqish"
            aria-label="Chiqish"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-white hover:text-[var(--accent)]"
          >
            <LogOut className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  )
}
