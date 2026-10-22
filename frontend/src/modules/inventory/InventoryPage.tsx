import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Eye, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Button, Field, Input, Select } from '@/shared/ui/Field'
import { Modal } from '@/shared/ui/Modal'
import { IconButton } from '@/shared/ui/IconButton'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { useCatalog } from '@/shared/hooks/useCatalog'
import { holatMatni } from '@/shared/lib/labels'
import { useDialog } from '@/shared/ui/DialogProvider'

type InvDoc = {
  _id: string
  status: string
  lines: {
    product: string | { _id: string; name?: string }
    warehouse: string
    subWarehouse: string
    systemQty: number
    countedQty: number
    difference: number
  }[]
  note?: string
}

type LineForm = {
  product: string
  warehouse: string
  subWarehouse: string
  countedQty: string
}

const emptyLine = (): LineForm => ({
  product: '',
  warehouse: '',
  subWarehouse: '',
  countedQty: '0',
})

export function InventoryPage() {
  const { products, warehouses, error: catalogError } = useCatalog()
  const { confirm, alert } = useDialog()
  const [items, setItems] = useState<InvDoc[]>([])
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewing, setViewing] = useState<InvDoc | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [lines, setLines] = useState<LineForm[]>([emptyLine()])

  async function load() {
    const data = await apiGet<InvDoc[]>('/api/inventory')
    setItems(data)
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  function openCreate() {
    setEditingId(null)
    setNote('')
    setLines([emptyLine()])
    setError('')
    setModalOpen(true)
  }

  function openEdit(doc: InvDoc) {
    setEditingId(doc._id)
    setNote(doc.note || '')
    setLines(
      doc.lines.map((l) => ({
        product: typeof l.product === 'object' ? l.product._id : String(l.product),
        warehouse: String(l.warehouse),
        subWarehouse: String(l.subWarehouse),
        countedQty: String(l.countedQty),
      })),
    )
    setError('')
    setModalOpen(true)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const payload = {
      note,
      lines: lines.map((l) => ({
        product: l.product,
        warehouse: l.warehouse,
        subWarehouse: l.subWarehouse,
        countedQty: Number(l.countedQty),
      })),
    }
    try {
      if (editingId) await apiPatch(`/api/inventory/${editingId}`, payload)
      else await apiPost('/api/inventory', payload)
      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  async function postDoc(id: string) {
    const ok = await confirm(
      'Inventarizatsiya tasdiqlansinmi? Qoldiqlar farq bo‘yicha yangilanadi.',
      { title: 'Tasdiqlash', danger: false },
    )
    if (!ok) return
    try {
      await apiPost(`/api/inventory/${id}/post`, {})
      await load()
    } catch (err) {
      await alert(err instanceof Error ? err.message : 'Xato', { title: 'Xato' })
    }
  }

  async function removeDoc(id: string) {
    const ok = await confirm('Qoralama o‘chirilsinmi?', {
      title: 'O‘chirish',
      danger: true,
    })
    if (!ok) return
    try {
      await apiDelete(`/api/inventory/${id}`)
      await load()
    } catch (err) {
      await alert(err instanceof Error ? err.message : 'Xato', { title: 'Xato' })
    }
  }

  function subOptions(warehouseId: string) {
    const wh = warehouses.find((w) => w._id === warehouseId)
    return (wh?.subWarehouses || []).map((s) => ({
      value: s._id,
      label: s.name,
    }))
  }

  return (
    <div>
      <PageHeader
        title="Inventarizatsiya"
        description="Haqiqiy qoldiq sanaladi; bajarilganda farqlar bo‘yicha ombor to‘g‘rilanadi"
        actions={
          <Button type="button" onClick={openCreate}>
            + Farqlar akti
          </Button>
        }
      />

      {(error || catalogError) && !modalOpen ? (
        <p className="mb-3 text-[13px] text-[var(--danger)]">
          {error || catalogError}
        </p>
      ) : null}

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Holat</th>
              <th>Qatorlar</th>
              <th>Izoh</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((doc) => (
              <tr key={doc._id}>
                <td>
                  <StatusBadge status={doc.status} />
                </td>
                <td className="tabular-nums">{doc.lines.length} ta</td>
                <td className="max-w-[240px] truncate text-[var(--muted)]">
                  {doc.note || '—'}
                </td>
                <td>
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
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={4} className="erp-empty">
                  Hali inventarizatsiya yo‘q
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Inventarizatsiya ma’lumoti"
        description={viewing ? holatMatni(viewing.status) : undefined}
        wide
      >
        {viewing ? (
          <div className="erp-table-wrap">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Tizim</th>
                  <th>Sanalgan</th>
                  <th>Farq</th>
                </tr>
              </thead>
              <tbody>
                {viewing.lines.map((l, i) => (
                  <tr key={i}>
                    <td>
                      {typeof l.product === 'object'
                        ? l.product?.name
                        : 'Mahsulot'}
                    </td>
                    <td className="tabular-nums">{l.systemQty}</td>
                    <td className="tabular-nums">{l.countedQty}</td>
                    <td className="tabular-nums font-medium">{l.difference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Inventarni tahrirlash' : 'Yangi inventarizatsiya'}
        wide
      >
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Izoh">
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>

          {lines.map((line, idx) => (
            <div
              key={idx}
              className="grid gap-2 rounded-[var(--radius)] border border-[var(--border)] p-3 sm:grid-cols-2"
            >
              <Field label="Mahsulot">
                <Select
                  value={line.product}
                  onChange={(v) =>
                    setLines((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, product: v } : x)),
                    )
                  }
                  options={products.map((p) => ({ value: p._id, label: p.name }))}
                  required
                />
              </Field>
              <Field label="Ombor">
                <Select
                  value={line.warehouse}
                  onChange={(v) =>
                    setLines((prev) =>
                      prev.map((x, i) =>
                        i === idx
                          ? { ...x, warehouse: v, subWarehouse: '' }
                          : x,
                      ),
                    )
                  }
                  options={warehouses.map((w) => ({
                    value: w._id,
                    label: w.name,
                  }))}
                  required
                />
              </Field>
              <Field label="Kichik ombor">
                <Select
                  value={line.subWarehouse}
                  onChange={(v) =>
                    setLines((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, subWarehouse: v } : x,
                      ),
                    )
                  }
                  options={subOptions(line.warehouse)}
                  required
                />
              </Field>
              <Field label="Sanalgan miqdor (dona)">
                <Input
                  type="number"
                  min={0}
                  value={line.countedQty}
                  onChange={(e) =>
                    setLines((prev) =>
                      prev.map((x, i) =>
                        i === idx ? { ...x, countedQty: e.target.value } : x,
                      ),
                    )
                  }
                  required
                />
              </Field>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setLines((prev) => [...prev, emptyLine()])}
            >
              + Qator
            </Button>
            <Button type="submit">{editingId ? 'Saqlash' : 'Yaratish'}</Button>
          </div>
          {error ? <p className="text-[13px] text-[var(--danger)]">{error}</p> : null}
        </form>
      </Modal>
    </div>
  )
}
