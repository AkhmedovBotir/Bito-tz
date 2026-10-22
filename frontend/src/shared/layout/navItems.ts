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
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  end?: boolean
  icon: LucideIcon
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: 'Asosiy',
    items: [{ to: '/', label: 'Boshqaruv paneli', end: true, icon: LayoutDashboard }],
  },
  {
    title: 'Ma’lumotnomalar',
    items: [
      { to: '/products', label: 'Mahsulotlar', icon: Package },
      { to: '/warehouses', label: 'Omborlar', icon: Warehouse },
    ],
  },
  {
    title: 'Hujjatlar',
    items: [
      { to: '/purchases', label: 'Xarid (kirim)', icon: ShoppingCart },
      { to: '/sales', label: 'Savdo (chiqim)', icon: Store },
      { to: '/inventory', label: 'Inventarizatsiya', icon: ClipboardList },
    ],
  },
  {
    title: 'Moliya',
    items: [
      { to: '/cash', label: 'Kassa', icon: Wallet },
      { to: '/debts', label: 'Qarzlar', icon: HandCoins },
    ],
  },
  {
    title: 'Hisobotlar',
    items: [
      { to: '/reports/stock', label: 'Qoldiq', icon: Boxes },
      { to: '/reports/sales', label: 'Savdo', icon: BarChart3 },
      { to: '/reports/pnl', label: 'Foyda va zarar', icon: LineChart },
    ],
  },
]

export const flatNavItems: (NavItem & { group: string })[] = navGroups.flatMap(
  (g) => g.items.map((item) => ({ ...item, group: g.title })),
)
