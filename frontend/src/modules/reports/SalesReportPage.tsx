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
    <div>
      <PageHeader
        title="Savdo hisoboti"
        description="Sana bo‘yicha savdolar va eng ko‘p sotilgan mahsulotlar"
      />
      {error ? <p className="mb-3 text-[13px] text-[var(--danger)]">{error}</p> : null}

      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <div className="erp-kpi">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Savdolar soni
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {data?.totals.salesCount || 0}
          </p>
        </div>
        <div className="erp-kpi">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
            Jami summa
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--accent)]">
            {formatMoney(data?.totals.totalAmount || 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <section className="erp-table-wrap">
          <div className="border-b border-[var(--border)] bg-slate-50 px-3.5 py-2.5">
            <h3 className="text-[13px] font-semibold">Kunlik savdo</h3>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Sana</th>
                <th>Soni</th>
                <th>Summa</th>
              </tr>
            </thead>
            <tbody>
              {(data?.byDate || []).map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td className="tabular-nums">{d.count}</td>
                  <td className="tabular-nums">{formatMoney(d.totalAmount)}</td>
                </tr>
              ))}
              {!data?.byDate?.length ? (
                <tr>
                  <td colSpan={3} className="erp-empty">
                    Ma’lumotlar yo‘q
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="erp-table-wrap">
          <div className="border-b border-[var(--border)] bg-slate-50 px-3.5 py-2.5">
            <h3 className="text-[13px] font-semibold">Top mahsulotlar</h3>
          </div>
          <table className="erp-table">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Miqdor</th>
                <th>Summa</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topProducts || []).map((p) => (
                <tr key={p.productName}>
                  <td className="font-medium">{p.productName}</td>
                  <td className="tabular-nums">{p.qtyPieces} dona</td>
                  <td className="tabular-nums">{formatMoney(p.amount)}</td>
                </tr>
              ))}
              {!data?.topProducts?.length ? (
                <tr>
                  <td colSpan={3} className="erp-empty">
                    Ma’lumotlar yo‘q
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
