import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { navGroups } from './navItems'

type Props = {
  open: boolean
  onClose: () => void
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 py-3">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-2 text-[13px] font-medium transition',
                      isActive
                        ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-text-active)]'
                        : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-slate-100',
                    ].join(' ')
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" strokeWidth={1.75} />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

function SidebarBrand({
  showClose,
  onClose,
}: {
  showClose?: boolean
  onClose?: () => void
}) {
  return (
    <div className="flex h-[var(--header-h)] items-center justify-between gap-2 border-b border-white/10 px-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-[var(--sidebar-active)] text-xs font-bold text-white">
          ERP
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Do‘kon ERP</p>
          <p className="truncate text-[11px] text-slate-400">Ombor · Savdo · Moliya</p>
        </div>
      </div>
      {showClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Menyuni yopish"
          className="rounded-[var(--radius)] p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}

export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      <aside className="hidden h-svh w-[var(--sidebar-w)] flex-col bg-[var(--sidebar)] lg:sticky lg:top-0 lg:flex">
        <SidebarBrand />
        <SidebarNav />
        <div className="border-t border-white/10 px-3 py-2.5 text-[11px] text-slate-500">
          v1.0 · Mini-ERP
        </div>
      </aside>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Menyuni yopish"
              className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-w)] flex-col bg-[var(--sidebar)] shadow-2xl lg:hidden"
            >
              <SidebarBrand showClose onClose={onClose} />
              <SidebarNav onNavigate={onClose} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
