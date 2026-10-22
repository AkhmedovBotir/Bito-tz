import { useEffect, useState } from 'react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { apiGet, formatMoney } from '@/shared/api/client'
import { holatMatni, qarzTuri } from '@/shared/lib/labels'

type Debt = {
  _id: string
  kind: 'receivable' | 'payable'
  partyName: string
  amount: number
  remaining: number
  status: string
  note?: string
}

export function DebtsPage() {
  const [items, setItems] = useState<Debt[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Debt[]>('/api/debts')
      .then(setItems)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Qarzlar"
        description="Mijoz qarzi va ta’minotchiga bo‘lgan qarzlar ro‘yxati."
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Tur</th>
              <th className="px-4 py-3">Tomoni</th>
              <th className="px-4 py-3">Summa</th>
              <th className="px-4 py-3">Qolgan</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3">Izoh</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d._id} className="border-b border-[var(--border)]">
                <td className="px-4 py-3">{qarzTuri(d.kind)}</td>
                <td className="px-4 py-3">{d.partyName}</td>
                <td className="px-4 py-3">{formatMoney(d.amount)}</td>
                <td className="px-4 py-3">{formatMoney(d.remaining)}</td>
                <td className="px-4 py-3">{holatMatni(d.status)}</td>
                <td className="px-4 py-3">{d.note || '—'}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-[var(--muted)]">
                  Qarz yozuvlari yo‘q
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
