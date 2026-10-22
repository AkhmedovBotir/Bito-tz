import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '@/shared/ui/PageHeader'
import { apiGet, formatMoney } from '@/shared/api/client'

type Pnl = {
  revenue: number
  cogs: number
  expenses: number
  netProfit: number
}

export function DashboardPage() {
  const [pnl, setPnl] = useState<Pnl | null>(null)

  useEffect(() => {
    apiGet<Pnl>('/api/reports/pnl').then(setPnl).catch(() => setPnl(null))
  }, [])

  const cards = [
    { title: 'Tushumlar', value: formatMoney(pnl?.revenue || 0), to: '/reports/sales' },
    { title: 'Tannarx', value: formatMoney(pnl?.cogs || 0), to: '/reports/pnl' },
    { title: 'Xarajatlar', value: formatMoney(pnl?.expenses || 0), to: '/cash' },
    { title: 'Sof foyda', value: formatMoney(pnl?.netProfit || 0), to: '/reports/pnl' },
  ]

  return (
    <div>
      <PageHeader
        title="Boshqaruv paneli"
        description="Qoldiq, savdo va sof foydani bir joydan kuzating."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={card.to}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition hover:border-[var(--accent)]"
            >
              <p className="text-sm text-[var(--muted)]">{card.title}</p>
              <p className="mt-2 text-xl font-semibold text-[var(--ink)]">
                {card.value}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
