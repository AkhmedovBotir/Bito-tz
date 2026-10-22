import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Banknote,
  Package,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { apiGet, formatMoney } from '@/shared/api/client'

type Pnl = {
  revenue: number
  cogs: number
  expenses: number
  netProfit: number
  openReceivables?: number
  openPayables?: number
}

const quickLinks = [
  { to: '/purchases', label: 'Yangi xarid', icon: ShoppingCart },
  { to: '/sales', label: 'Yangi savdo', icon: Banknote },
  { to: '/products', label: 'Mahsulotlar', icon: Package },
  { to: '/cash', label: 'Kassa', icon: Wallet },
]

export function DashboardPage() {
  const [pnl, setPnl] = useState<Pnl | null>(null)

  useEffect(() => {
    apiGet<Pnl>('/api/reports/pnl').then(setPnl).catch(() => setPnl(null))
  }, [])

  const cards = [
    {
      title: 'Tushumlar',
      value: formatMoney(pnl?.revenue || 0),
      to: '/reports/sales',
      tone: 'text-[var(--accent)]',
    },
    {
      title: 'Tannarx',
      value: formatMoney(pnl?.cogs || 0),
      to: '/reports/pnl',
      tone: 'text-[var(--warning)]',
    },
    {
      title: 'Xarajatlar',
      value: formatMoney(pnl?.expenses || 0),
      to: '/cash',
      tone: 'text-[var(--danger)]',
    },
    {
      title: 'Sof foyda',
      value: formatMoney(pnl?.netProfit || 0),
      to: '/reports/pnl',
      tone: 'text-[var(--success)]',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Boshqaruv paneli"
        description="Do‘konning operatsion va moliyaviy holati"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} to={card.to} className="erp-kpi block">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                {card.title}
              </p>
              <TrendingUp className={`h-3.5 w-3.5 ${card.tone}`} />
            </div>
            <p className={`mt-2 text-xl font-semibold tabular-nums ${card.tone}`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <section className="erp-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--ink)]">Tezkor amallar</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--border)] px-3 py-2.5 text-[13px] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  <span className="flex items-center gap-2 font-medium text-[var(--ink)]">
                    <Icon className="h-4 w-4 text-[var(--accent)]" />
                    {item.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                </Link>
              )
            })}
          </div>
        </section>

        <section className="erp-panel p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--ink)]">
            Qarzlar holati
          </h3>
          <div className="space-y-2 text-[13px]">
            <div className="flex items-center justify-between rounded-[var(--radius)] bg-slate-50 px-3 py-2">
              <span className="text-[var(--muted)]">Mijoz qarzlari</span>
              <span className="font-semibold tabular-nums text-[var(--ink)]">
                {formatMoney(pnl?.openReceivables || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-[var(--radius)] bg-slate-50 px-3 py-2">
              <span className="text-[var(--muted)]">Ta’minotchi qarzlari</span>
              <span className="font-semibold tabular-nums text-[var(--ink)]">
                {formatMoney(pnl?.openPayables || 0)}
              </span>
            </div>
            <Link
              to="/reports/pnl"
              className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:underline"
            >
              P&L hisobotiga o‘tish <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
