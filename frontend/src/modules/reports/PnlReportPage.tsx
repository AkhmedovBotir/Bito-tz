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
    { label: 'Tushumlar', value: data?.revenue || 0, tone: 'text-[var(--ink)]' },
    { label: 'Tannarx (−)', value: data?.cogs || 0, tone: 'text-[var(--warning)]' },
    { label: 'Xarajatlar (−)', value: data?.expenses || 0, tone: 'text-[var(--danger)]' },
    {
      label: '  shundan yo‘l kira',
      value: data?.transport || 0,
      tone: 'text-[var(--muted)]',
    },
  ]

  return (
    <div>
      <PageHeader
        title="Foyda va zarar"
        description="Tushumlar − Tannarx − Xarajatlar = Sof foyda"
      />
      {error ? <p className="mb-3 text-[13px] text-[var(--danger)]">{error}</p> : null}

      <div className="erp-table-wrap">
        <div className="border-b border-[var(--border)] bg-slate-50 px-3.5 py-2.5">
          <p className="text-[12px] text-[var(--muted)]">
            {data?.formula || 'Tushumlar − Tannarx − Xarajatlar = Sof foyda'}
          </p>
        </div>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Ko‘rsatkich</th>
              <th>Summa</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td className={`tabular-nums font-medium ${r.tone}`}>
                  {formatMoney(r.value)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="font-semibold">Sof foyda</td>
              <td className="text-base font-semibold tabular-nums text-[var(--success)]">
                {formatMoney(data?.netProfit || 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="erp-kpi">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Ochiq mijoz qarzlari
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatMoney(data?.openReceivables || 0)}
          </p>
        </div>
        <div className="erp-kpi">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Ochiq ta’minotchi qarzlari
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {formatMoney(data?.openPayables || 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
