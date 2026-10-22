import { useEffect, useState } from 'react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { apiGet, formatMoney } from '@/shared/api/client'

type Pnl = {
  formula: string
  revenue: number
  cogs: number
  expenses: number
  transport: number
  netProfit: number
  openReceivables: number
  openPayables: number
}

export function PnlReportPage() {
  const [data, setData] = useState<Pnl | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Pnl>('/api/reports/pnl')
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  const rows = [
    { label: 'Tushumlar', value: data?.revenue || 0 },
    { label: 'Tannarx (−)', value: data?.cogs || 0 },
    { label: 'Xarajatlar (−)', value: data?.expenses || 0 },
    { label: '  shundan yo‘l kira', value: data?.transport || 0 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Foyda va zarar"
        description="Tushumlar − Tannarx − Xarajatlar = Sof foyda"
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-sm text-[var(--muted)]">
          {data?.formula || 'Tushumlar − Tannarx − Xarajatlar = Sof foyda'}
        </p>
        <div className="mt-4 space-y-2 text-sm">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between">
              <span>{r.label}</span>
              <span>{formatMoney(r.value)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-[var(--border)] pt-3 text-lg font-semibold text-[var(--accent)]">
            <span>Sof foyda</span>
            <span>{formatMoney(data?.netProfit || 0)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">Ochiq mijoz qarzlari</p>
          <p className="mt-1 text-xl font-semibold">
            {formatMoney(data?.openReceivables || 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">Ochiq ta’minotchi qarzlari</p>
          <p className="mt-1 text-xl font-semibold">
            {formatMoney(data?.openPayables || 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
