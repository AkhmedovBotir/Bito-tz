import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Button, Field, Input } from '@/shared/ui/Field'
import { Modal } from '@/shared/ui/Modal'
import { IconButton } from '@/shared/ui/IconButton'
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  formatMoney,
} from '@/shared/api/client'
import { useDialog } from '@/shared/ui/DialogProvider'

type Product = {
  _id: string
  name: string
  salePrice: number
  costPrice: number
  unitsPerBlock: number
}

const emptyForm = {
  name: '',
  salePrice: '',
  costPrice: '',
  unitsPerBlock: '24',
}

export function ProductsPage() {
  const { confirm } = useDialog()
  const [items, setItems] = useState<Product[]>([])
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewing, setViewing] = useState<Product | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [demoBlocks, setDemoBlocks] = useState('1')
  const [demoPieces, setDemoPieces] = useState('0')
  const [saving, setSaving] = useState(false)

  async function load() {
    setItems(await apiGet<Product[]>('/api/products'))
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  const preview = useMemo(() => {
    const upb = Math.max(1, Number(form.unitsPerBlock) || 24)
    const blocksIn = Number(demoBlocks || 0)
    const piecesIn = Number(demoPieces || 0)
    const totalPieces = piecesIn + blocksIn * upb
    const asBlocks = Math.floor(totalPieces / upb)
    const remainder = totalPieces % upb
    return { upb, blocksIn, piecesIn, totalPieces, asBlocks, remainder }
  }, [form.unitsPerBlock, demoBlocks, demoPieces])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name,
      salePrice: String(p.salePrice),
      costPrice: String(p.costPrice),
      unitsPerBlock: String(p.unitsPerBlock),
    })
    setError('')
    setModalOpen(true)
  }

  function openView(p: Product) {
    setViewing(p)
    setViewOpen(true)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      name: form.name,
      salePrice: Number(form.salePrice),
      costPrice: Number(form.costPrice),
      unitsPerBlock: Number(form.unitsPerBlock),
    }
    try {
      if (editing) {
        await apiPatch(`/api/products/${editing._id}`, payload)
      } else {
        await apiPost('/api/products', payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    const ok = await confirm('Mahsulotni o‘chirishni tasdiqlaysizmi?', {
      title: 'O‘chirish',
      confirmText: 'O‘chirish',
    })
    if (!ok) return
    setError('')
    try {
      await apiDelete(`/api/products/${id}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Mahsulotlar"
        description="Har bir mahsulot: nom, narx, 1 blok = N dona. Konvertatsiya avtomatik."
        actions={
          <Button type="button" onClick={openCreate}>
            + Yangi mahsulot
          </Button>
        }
      />

      {error && !modalOpen ? (
        <p className="text-sm text-[var(--danger)]">{error}</p>
      ) : null}

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="px-4 py-3">Nomi</th>
              <th className="px-4 py-3">1 blok</th>
              <th className="px-4 py-3">Sotuv</th>
              <th className="px-4 py-3">Tannarx</th>
              <th className="px-4 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.unitsPerBlock} dona</td>
                <td className="px-4 py-3">{formatMoney(p.salePrice)}</td>
                <td className="px-4 py-3">{formatMoney(p.costPrice)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <IconButton label="Ko‘rish" variant="accent" onClick={() => openView(p)}>
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Tahrirlash" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="O‘chirish"
                      variant="danger"
                      onClick={() => onDelete(p._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-[var(--muted)]">
                  Hali mahsulot yo‘q
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Mahsulot ma’lumoti"
        description={viewing?.name}
      >
        {viewing ? (
          <div className="space-y-3 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">1 blokda</p>
                <p className="mt-1 font-semibold">{viewing.unitsPerBlock} dona</p>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">Sotuv narxi</p>
                <p className="mt-1 font-semibold">{formatMoney(viewing.salePrice)}</p>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">Tannarx</p>
                <p className="mt-1 font-semibold">{formatMoney(viewing.costPrice)}</p>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">1 blok sotuv summasi</p>
                <p className="mt-1 font-semibold">
                  {formatMoney(viewing.salePrice * viewing.unitsPerBlock)}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setViewOpen(false)}>
                Yopish
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setViewOpen(false)
                  openEdit(viewing)
                }}
              >
                Tahrirlash
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
        description="Mahsulotni ikki o‘lchovda saqlaymiz: blok va dona"
        wide
      >
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <Field label="Nomi">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </Field>
          <Field label="1 blokda nechta dona bor?">
            <Input
              type="number"
              min={1}
              value={form.unitsPerBlock}
              onChange={(e) =>
                setForm((f) => ({ ...f, unitsPerBlock: e.target.value }))
              }
              required
            />
          </Field>
          <Field label="Sotuv narxi (1 dona uchun)">
            <Input
              type="number"
              min={0}
              value={form.salePrice}
              onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
              required
            />
          </Field>
          <Field label="Tannarx (1 dona uchun)">
            <Input
              type="number"
              min={0}
              value={form.costPrice}
              onChange={(e) => setForm((f) => ({ ...f, costPrice: e.target.value }))}
            />
          </Field>

          <div className="space-y-3 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4 text-sm md:col-span-2">
            <div>
              <p className="font-medium text-[var(--accent)]">Hisoblash misoli</p>
              <p className="mt-1 text-[var(--muted)]">
                Qoida:{' '}
                <strong className="text-[var(--ink)]">1 blok = {preview.upb} dona</strong>
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Necha blok?">
                <Input
                  type="number"
                  min={0}
                  value={demoBlocks}
                  onChange={(e) => setDemoBlocks(e.target.value)}
                />
              </Field>
              <Field label="Necha dona?">
                <Input
                  type="number"
                  min={0}
                  value={demoPieces}
                  onChange={(e) => setDemoPieces(e.target.value)}
                />
              </Field>
            </div>

            <div className="rounded-lg bg-white/80 px-3 py-2.5 text-[var(--ink)]">
              <p>
                {preview.blocksIn} blok + {preview.piecesIn} dona ={' '}
                <strong>{preview.totalPieces} dona</strong>
              </p>
              <p className="mt-1 text-[var(--muted)]">
                Yoki: <strong className="text-[var(--ink)]">{preview.asBlocks} blok</strong>
                {preview.remainder > 0 ? (
                  <>
                    {' '}
                    va <strong className="text-[var(--ink)]">{preview.remainder} dona</strong>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-[var(--danger)] md:col-span-2">{error}</p>
          ) : null}

          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saqlanmoqda…' : editing ? 'Saqlash' : 'Qo‘shish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
