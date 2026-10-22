import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Store,
  ClipboardList,
  Wallet,
  HandCoins,
  Boxes,
  BarChart3,
  LineChart,
  X,
  type LucideIcon,
} from 'lucide-react'

const links: {
  to: string
  label: string
  end?: boolean
  icon: LucideIcon
}[] = [
  { to: '/', label: 'Bosh sahifa', end: true, icon: LayoutDashboard },
  { to: '/products', label: 'Mahsulotlar', icon: Package },
  { to: '/warehouses', label: 'Omborlar', icon: Warehouse },
  { to: '/purchases', label: 'Xarid (kirim)', icon: ShoppingCart },
  { to: '/sales', label: 'Savdo (chiqim)', icon: Store },
  { to: '/inventory', label: 'Inventarizatsiya', icon: ClipboardList },
  { to: '/cash', label: 'Kassa', icon: Wallet },
  { to: '/debts', label: 'Qarzlar', icon: HandCoins },
  { to: '/reports/stock', label: 'Qoldiq hisoboti', icon: Boxes },
  { to: '/reports/sales', label: 'Savdo hisoboti', icon: BarChart3 },
  { to: '/reports/pnl', label: 'Foyda va zarar', icon: LineChart },
]

type Props = {
  open: boolean
  onClose: () => void
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                isActive
                  ? 'bg-[var(--accent)] font-medium text-white'
                  : 'text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]',
              ].join(' ')
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={2} />
            <span>{link.label}</span>
          </NavLink>
        )
      })}
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
    <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
          Do‘kon tizimi
        </p>
        <h1 className="mt-1 text-xl font-semibold text-[var(--accent)]">
          Ichimliklar ERP
        </h1>
      </div>
      {showClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Menyuni yopish"
          className="rounded-lg border border-[var(--border)] p-1.5 text-[var(--muted)] hover:text-[var(--ink)]"
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
      {/* Planshetdan katta: doim ochiq */}
      <aside className="hidden h-svh flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:sticky lg:top-0 lg:flex">
        <SidebarBrand />
        <SidebarNav />
      </aside>

      {/* Planshet va undan kichik: hamburger drawer */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Menyuni yopish"
              className="fixed inset-0 z-40 bg-[#0f1a14]/40 backdrop-blur-[1px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-2xl lg:hidden"
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
