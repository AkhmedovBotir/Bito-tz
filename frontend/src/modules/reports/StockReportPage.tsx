import { useEffect, useState } from 'react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { apiGet } from '@/shared/api/client'

type Row = {
  productName: string
  warehouseName: string
  subWarehouseName: string
  display: string
  qtyPieces: number
  qtyBlocks: number
  value: number
}

export function StockReportPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    apiGet<Row[]>('/api/reports/stock')
      .then(setRows)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Mahsulotlar qoldig‘i"
        description="Har bir mahsulot: X so‘m / Y dona (Z blok) va qaysi ombor/kichik omborda."
      />
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="px-4 py-3">Mahsulot</th>
              <th className="px-4 py-3">Ombor</th>
              <th className="px-4 py-3">Kichik ombor</th>
              <th className="px-4 py-3">Qoldiq</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[var(--border)]">
                <td className="px-4 py-3 font-medium">{r.productName}</td>
                <td className="px-4 py-3">{r.warehouseName}</td>
                <td className="px-4 py-3">{r.subWarehouseName}</td>
                <td className="px-4 py-3">{r.display}</td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-[var(--muted)]">
                  Qoldiq yo‘q — avval xarid bajaring
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
