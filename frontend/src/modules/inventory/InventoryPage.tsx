import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Eye, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Button, Field, Input, Select } from '@/shared/ui/Field'
import { Modal } from '@/shared/ui/Modal'
import { IconButton } from '@/shared/ui/IconButton'
import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { holatMatni } from '@/shared/lib/labels'
import { useDialog } from '@/shared/ui/DialogProvider'

type CountDoc = {
  _id: string
  status: string
  lines: {
    product: string | { _id: string; name?: string; unitsPerBlock?: number }
    warehouse: string
    subWarehouse: string
    systemQty: number
    countedQty: number
    difference: number
  }[]
}

function getProductId(
  product: string | { _id: string } | undefined
): string {
  if (!product) return ''
  return typeof product === 'string' ? product : product._id
}

export function InventoryPage() {
  const { confirm } = useDialog()
  const { products, warehouses, error: catalogError } = useCatalog()
  const [items, setItems] = useState<CountDoc[]>([])
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewing, setViewing] = useState<CountDoc | null>(null)
  const [editing, setEditing] = useState<CountDoc | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    product: '',
    warehouse: '',
    subWarehouse: '',
    blocks: '0',
    pieces: '0',
  })

  async function load() {
    setItems(await apiGet<CountDoc[]>('/api/inventory'))
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  const selectedWh = warehouses.find((w) => w._id === form.warehouse)

  function resetForm() {
    setEditing(null)
    setForm({
      product: '',
      warehouse: '',
      subWarehouse: '',
      blocks: '0',
      pieces: '0',
    })
  }

  function openCreate() {
    resetForm()
    setError('')
    setModalOpen(true)
  }

  function openEdit(doc: CountDoc) {
    const first = doc.lines?.[0]
    const pid = getProductId(first?.product)
    const prod = products.find((p) => p._id === pid)
    const upb = prod?.unitsPerBlock || 1
    const qty = first?.countedQty || 0
    setEditing(doc)
    setForm({
      product: pid,
      warehouse: first?.warehouse ? String(first.warehouse) : '',
      subWarehouse: first?.subWarehouse ? String(first.subWarehouse) : '',
      blocks: String(Math.floor(qty / upb)),
      pieces: String(qty % upb),
    })
    setError('')
    setModalOpen(true)
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      lines: [
        {
          product: form.product,
          warehouse: form.warehouse,
          subWarehouse: form.subWarehouse,
          blocks: Number(form.blocks || 0),
          pieces: Number(form.pieces || 0),
        },
      ],
    }
    try {
      if (editing) {
        await apiPatch(`/api/inventory/${editing._id}`, payload)
      } else {
        await apiPost('/api/inventory', payload)
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
    try {
      await apiPost(`/api/inventory/${id}/post`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  async function removeDoc(id: string) {
    const ok = await confirm('Qoralama aktni o‘chirishni tasdiqlaysizmi?', {
      title: 'Aktni o‘chirish',
      confirmText: 'O‘chirish',
    })
    if (!ok) return
    try {
      await apiDelete(`/api/inventory/${id}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventarizatsiya"
        description="Haqiqiy qoldiq sanaladi, tizim bilan solishtiriladi. Bajarilganda farqlar bo‘yicha ombor to‘g‘rilanadi."
        actions={
          <Button type="button" onClick={openCreate}>
            + Farqlar akti
          </Button>
        }
      />

      {(error || catalogError) && !modalOpen ? (
        <p className="text-sm text-[var(--danger)]">{error || catalogError}</p>
      ) : null}

      <div className="space-y-3">
        {items.map((doc) => (
          <article
            key={doc._id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">Holat: {holatMatni(doc.status)}</p>
              <div className="flex items-center gap-1.5">
                <IconButton
                  label="Ko‘rish"
                  variant="accent"
                  onClick={() => {
                    setViewing(doc)
                    setViewOpen(true)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </IconButton>
                {doc.status === 'draft' ? (
                  <>
                    <IconButton label="Tahrirlash" onClick={() => openEdit(doc)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="Tasdiqlash"
                      variant="success"
                      onClick={() => postDoc(doc._id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="O‘chirish"
                      variant="danger"
                      onClick={() => removeDoc(doc._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </>
                ) : null}
              </div>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
              {doc.lines.map((l, i) => (
                <li key={i}>
                  {typeof l.product === 'object'
                    ? l.product?.name
                    : 'Mahsulot'}
                  : tizim {l.systemQty} → sanalgan {l.countedQty} (farq{' '}
                  {l.difference})
                </li>
              ))}
            </ul>
          </article>
        ))}
        {!items.length ? (
          <p className="text-sm text-[var(--muted)]">Hali inventarizatsiya yo‘q</p>
        ) : null}
      </div>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Inventarizatsiya ma’lumoti"
        description={viewing ? holatMatni(viewing.status) : undefined}
      >
        {viewing ? (
          <div className="space-y-3 text-sm">
            <ul className="space-y-2">
              {viewing.lines.map((l, i) => (
                <li key={i} className="rounded-xl border border-[var(--border)] p-3">
                  <p className="font-medium text-[var(--ink)]">
                    {typeof l.product === 'object'
                      ? l.product?.name
                      : 'Mahsulot'}
                  </p>
                  <p className="mt-1 text-[var(--muted)]">
                    Tizim: {l.systemQty} · Sanalgan: {l.countedQty} · Farq:{' '}
                    {l.difference}
                  </p>
                </li>
              ))}
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
        title={editing ? 'Farqlar aktini tahrirlash' : 'Yangi farqlar akti'}
        description="Sanalgan miqdorni kiriting — tizim farqni hisoblaydi"
        wide
      >
        <form onSubmit={onSave} className="grid gap-3 md:grid-cols-2">
          <Field label="Mahsulot">
            <Select
              value={form.product}
              onChange={(product) => setForm((f) => ({ ...f, product }))}
              required
              options={[
                { value: '', label: 'Tanlang' },
                ...products.map((p) => ({ value: p._id, label: p.name })),
              ]}
            />
          </Field>
          <Field label="Ombor">
            <Select
              value={form.warehouse}
              onChange={(warehouse) =>
                setForm((f) => ({
                  ...f,
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
              value={form.subWarehouse}
              onChange={(subWarehouse) =>
                setForm((f) => ({ ...f, subWarehouse }))
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
          <Field label="Sanalgan blok">
            <Input
              type="number"
              min={0}
              value={form.blocks}
              onChange={(e) => setForm((f) => ({ ...f, blocks: e.target.value }))}
            />
          </Field>
          <Field label="Sanalgan dona">
            <Input
              type="number"
              min={0}
              value={form.pieces}
              onChange={(e) => setForm((f) => ({ ...f, pieces: e.target.value }))}
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
              {saving ? 'Saqlanmoqda…' : editing ? 'Saqlash' : 'Aktni yaratish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
