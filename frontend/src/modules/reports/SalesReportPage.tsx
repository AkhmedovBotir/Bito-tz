import { useEffect, useState } from 'react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { apiGet, formatMoney } from '@/shared/api/client'

type SalesReport = {
  byDate: { date: string; count: number; totalAmount: number }[]
  topProducts: { productName: string; qtyPieces: number; amount: number }[]
  totals: { salesCount: number; totalAmount: number }
}

export function SalesReportPage() {
  const [data, setData] = useState<SalesReport | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<SalesReport>('/api/reports/sales')
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savdo hisoboti"
        description="Sana bo‘yicha savdolar va eng ko‘p sotilgan mahsulotlar."
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-sm text-[var(--muted)]">Jami</p>
        <p className="text-xl font-semibold">
          {data?.totals.salesCount || 0} ta savdo ·{' '}
          {formatMoney(data?.totals.totalAmount || 0)}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="font-medium">Kunlik savdo</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(data?.byDate || []).map((d) => (
              <li
                key={d.date}
                className="flex justify-between border-b border-[var(--border)] pb-2"
              >
                <span>{d.date}</span>
                <span>
                  {d.count} ta · {formatMoney(d.totalAmount)}
                </span>
              </li>
            ))}
            {!data?.byDate?.length ? (
              <li className="text-[var(--muted)]">Ma’lumotlar yo‘q</li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="font-medium">Top mahsulotlar</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(data?.topProducts || []).map((p) => (
              <li
                key={p.productName}
                className="flex justify-between border-b border-[var(--border)] pb-2"
              >
                <span>{p.productName}</span>
                <span>
                  {p.qtyPieces} dona · {formatMoney(p.amount)}
                </span>
              </li>
            ))}
            {!data?.topProducts?.length ? (
              <li className="text-[var(--muted)]">Ma’lumotlar yo‘q</li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  )
}
