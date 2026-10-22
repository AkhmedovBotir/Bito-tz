import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Eye, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Button, Field, Input, Select } from '@/shared/ui/Field'
import { Modal } from '@/shared/ui/Modal'
import { IconButton } from '@/shared/ui/IconButton'
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  formatMoney,
} from '@/shared/api/client'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { holatMatni } from '@/shared/lib/labels'
import { useDialog } from '@/shared/ui/DialogProvider'

type Purchase = {
  _id: string
  status: string
  supplierName: string
  totalAmount: number
  paidAmount: number
  debtAmount: number
  lines?: {
    product: string | { _id: string; name?: string; unitsPerBlock?: number }
    warehouse: string
    subWarehouse: string
    qtyPieces: number
    unitCost: number
    lineTotal?: number
  }[]
}

type LineForm = {
  product: string
  warehouse: string
  subWarehouse: string
  blocks: string
  pieces: string
  unitCost: string
}

const emptyLine = (): LineForm => ({
  product: '',
  warehouse: '',
  subWarehouse: '',
  blocks: '0',
  pieces: '0',
  unitCost: '',
})

function getProductId(
  product: string | { _id: string } | undefined
): string {
  if (!product) return ''
  return typeof product === 'string' ? product : product._id
}

export function PurchasesPage() {
  const { confirm } = useDialog()
  const { products, warehouses, error: catalogError } = useCatalog()
  const [items, setItems] = useState<Purchase[]>([])
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewing, setViewing] = useState<Purchase | null>(null)
  const [editing, setEditing] = useState<Purchase | null>(null)
  const [supplierName, setSupplierName] = useState('')
  const [paidAmount, setPaidAmount] = useState('')
  const [line, setLine] = useState<LineForm>(emptyLine())
  const [saving, setSaving] = useState(false)

  async function load() {
    setItems(await apiGet<Purchase[]>('/api/purchases'))
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  const selectedWh = warehouses.find((w) => w._id === line.warehouse)
  const selectedProduct = products.find((p) => p._id === line.product)

  function resetForm() {
    setEditing(null)
    setSupplierName('')
    setPaidAmount('')
    setLine(emptyLine())
  }

  function openCreate() {
    resetForm()
    setError('')
    setModalOpen(true)
  }

  function openEdit(p: Purchase) {
    const first = p.lines?.[0]
    const pid = getProductId(first?.product)
    const prod = products.find((x) => x._id === pid)
    const upb = prod?.unitsPerBlock || 1
    const qty = first?.qtyPieces || 0
    setEditing(p)
    setSupplierName(p.supplierName)
    setPaidAmount(String(p.paidAmount || 0))
    setLine({
      product: pid,
      warehouse: first?.warehouse ? String(first.warehouse) : '',
      subWarehouse: first?.subWarehouse ? String(first.subWarehouse) : '',
      blocks: String(Math.floor(qty / upb)),
      pieces: String(qty % upb),
      unitCost: first ? String(first.unitCost) : '',
    })
    setError('')
    setModalOpen(true)
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      supplierName,
      paidAmount: Number(paidAmount || 0),
      lines: [
        {
          product: line.product,
          warehouse: line.warehouse,
          subWarehouse: line.subWarehouse,
          blocks: Number(line.blocks || 0),
          pieces: Number(line.pieces || 0),
          unitCost: line.unitCost
            ? Number(line.unitCost)
            : selectedProduct?.costPrice,
        },
      ],
    }
    try {
      if (editing) {
        await apiPatch(`/api/purchases/${editing._id}`, payload)
      } else {
        await apiPost('/api/purchases', payload)
      }
      resetForm()
      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    } finally {
      setSaving(false)
    }
  }

  async function postDoc(id: string) {
    setError('')
    try {
      await apiPost(`/api/purchases/${id}/post`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  async function removeDoc(id: string) {
    const ok = await confirm('Qoralama xaridni o‘chirishni tasdiqlaysizmi?', {
      title: 'Xaridni o‘chirish',
      confirmText: 'O‘chirish',
    })
    if (!ok) return
    setError('')
    try {
      await apiDelete(`/api/purchases/${id}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Xarid (kirim)"
        description="Qoralama ochiladi. Faqat bajarilganda omborga qo‘shiladi. To‘liq to‘lanmasa — ta’minotchi qarzi."
        actions={
          <Button type="button" onClick={openCreate}>
            + Yangi xarid
          </Button>
        }
      />

      {(error || catalogError) && !modalOpen ? (
        <p className="text-sm text-[var(--danger)]">{error || catalogError}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Ta’minotchi</th>
              <th className="px-4 py-3">Jami</th>
              <th className="px-4 py-3">To‘langan</th>
              <th className="px-4 py-3">Qarz</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id} className="border-b border-[var(--border)]">
                <td className="px-4 py-3">{p.supplierName}</td>
                <td className="px-4 py-3">{formatMoney(p.totalAmount)}</td>
                <td className="px-4 py-3">{formatMoney(p.paidAmount)}</td>
                <td className="px-4 py-3">{formatMoney(p.debtAmount)}</td>
                <td className="px-4 py-3">{holatMatni(p.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <IconButton
                      label="Ko‘rish"
                      variant="accent"
                      onClick={() => {
                        setViewing(p)
                        setViewOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    {p.status === 'draft' ? (
                      <>
                        <IconButton label="Tahrirlash" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          label="Bajarish"
                          variant="success"
                          onClick={() => postDoc(p._id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          label="O‘chirish"
                          variant="danger"
                          onClick={() => removeDoc(p._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-[var(--muted)]">
                  Hali xarid yo‘q
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Xarid ma’lumoti"
        description={viewing ? holatMatni(viewing.status) : undefined}
      >
        {viewing ? (
          <div className="space-y-3 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-[var(--muted)]">Ta’minotchi</p>
                <p className="mt-1 font-semibold">{viewing.supplierName}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-[var(--muted)]">Jami</p>
                <p className="mt-1 font-semibold">{formatMoney(viewing.totalAmount)}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-[var(--muted)]">To‘langan</p>
                <p className="mt-1 font-semibold">{formatMoney(viewing.paidAmount)}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] p-3">
                <p className="text-[var(--muted)]">Qarz</p>
                <p className="mt-1 font-semibold">{formatMoney(viewing.debtAmount)}</p>
              </div>
            </div>
            <ul className="space-y-1 rounded-xl border border-[var(--border)] p-3 text-[var(--muted)]">
              {(viewing.lines || []).map((l, i) => (
                <li key={i}>
                  {typeof l.product === 'object'
                    ? l.product?.name
                    : 'Mahsulot'}
                  : {l.qtyPieces} dona ·{' '}
                  {formatMoney(l.lineTotal ?? l.qtyPieces * l.unitCost)}
                </li>
              ))}
              {!viewing.lines?.length ? <li>Qatorlar yo‘q</li> : null}
            </ul>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setViewOpen(false)}>
                Yopish
              </Button>
              {viewing.status === 'draft' ? (
                <Button
                  type="button"
                  onClick={() => {
                    setViewOpen(false)
                    openEdit(viewing)
                  }}
                >
                  Tahrirlash
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Xaridni tahrirlash' : 'Yangi xarid hujjati'}
        description="Faqat qoralama holatida o‘zgartirish mumkin"
        wide
      >
        <form onSubmit={onSave} className="grid gap-3 md:grid-cols-2">
          <Field label="Ta’minotchi">
            <Input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
            />
          </Field>
          <Field label="Hozir to‘langan summa">
            <Input
              type="number"
              min={0}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </Field>
          <Field label="Mahsulot">
            <Select
              value={line.product}
              onChange={(product) => {
                const p = products.find((x) => x._id === product)
                setLine((l) => ({
                  ...l,
                  product,
                  unitCost: p ? String(p.costPrice) : '',
                }))
              }}
              required
              options={[
                { value: '', label: 'Tanlang' },
                ...products.map((p) => ({
                  value: p._id,
                  label: `${p.name} (1 blok = ${p.unitsPerBlock} dona)`,
                })),
              ]}
            />
          </Field>
          <Field label="Ombor">
            <Select
              value={line.warehouse}
              onChange={(warehouse) =>
                setLine((l) => ({
                  ...l,
                  warehouse,
                  subWarehouse: '',
                }))
              }
              required
              options={[
                { value: '', label: 'Tanlang' },
                ...warehouses.map((w) => ({ value: w._id, label: w.name })),
              ]}
            />
          </Field>
          <Field label="Kichik ombor">
            <Select
              value={line.subWarehouse}
              onChange={(subWarehouse) =>
                setLine((l) => ({ ...l, subWarehouse }))
              }
              required
              options={[
                { value: '', label: 'Tanlang' },
                ...(selectedWh?.subWarehouses.map((s) => ({
                  value: s._id,
                  label: s.name,
                })) || []),
              ]}
            />
          </Field>
          <Field label="Blok">
            <Input
              type="number"
              min={0}
              value={line.blocks}
              onChange={(e) => setLine((l) => ({ ...l, blocks: e.target.value }))}
            />
          </Field>
          <Field label="Dona">
            <Input
              type="number"
              min={0}
              value={line.pieces}
              onChange={(e) => setLine((l) => ({ ...l, pieces: e.target.value }))}
            />
          </Field>
          <Field label="1 dona tannarxi">
            <Input
              type="number"
              min={0}
              value={line.unitCost}
              onChange={(e) => setLine((l) => ({ ...l, unitCost: e.target.value }))}
            />
          </Field>
          {error ? (
            <p className="text-sm text-[var(--danger)] md:col-span-2">{error}</p>
          ) : null}
          <div className="flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saqlanmoqda…' : editing ? 'Saqlash' : 'Qoralama sifatida saqlash'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
