import { useEffect, useState, type FormEvent } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
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
import { kassaKategoriya, kassaTuri } from '@/shared/lib/labels'
import { useDialog } from '@/shared/ui/DialogProvider'

type CashItem = {
  _id: string
  type: 'in' | 'out'
  category: string
  amount: number
  description?: string
  date: string
}

type CashData = {
  items: CashItem[]
  balance: number
}

const emptyForm = {
  type: 'out',
  category: 'transport',
  amount: '',
  description: '',
}

export function CashPage() {
  const { confirm } = useDialog()
  const [data, setData] = useState<CashData>({ items: [], balance: 0 })
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewing, setViewing] = useState<CashItem | null>(null)
  const [editing, setEditing] = useState<CashItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    setData(await apiGet<CashData>('/api/cash'))
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEdit(item: CashItem) {
    setEditing(item)
    setForm({
      type: item.type,
      category: item.category,
      amount: String(item.amount),
      description: item.description || '',
    })
    setError('')
    setModalOpen(true)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      ...form,
      amount: Number(form.amount),
    }
    try {
      if (editing) {
        await apiPatch(`/api/cash/${editing._id}`, payload)
      } else {
        await apiPost('/api/cash', payload)
      }
      setForm(emptyForm)
      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    const ok = await confirm('Kassa yozuvini o‘chirishni tasdiqlaysizmi?', {
      title: 'O‘chirish',
      confirmText: 'O‘chirish',
    })
    if (!ok) return
    setError('')
    try {
      await apiDelete(`/api/cash/${id}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Kassa"
        description="Kirim va chiqim. Yo‘l kira va boshqa xarajatlar to‘g‘ridan-to‘g‘ri chiqim qilinadi."
        actions={
          <Button type="button" onClick={openCreate}>
            + Pul harakati
          </Button>
        }
      />

      <div className="erp-kpi mb-3 max-w-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
          Joriy kassa qoldig‘i
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--accent)]">
          {formatMoney(data.balance)}
        </p>
      </div>

      {error && !modalOpen ? (
        <p className="text-sm text-[var(--danger)]">{error}</p>
      ) : null}

      <div className="erp-table-wrap">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="px-4 py-3">Sana</th>
              <th className="px-4 py-3">Tur</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Summa</th>
              <th className="px-4 py-3">Izoh</th>
              <th className="px-4 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((e) => (
              <tr key={e._id} className="border-b border-[var(--border)]">
                <td className="px-4 py-3">
                  {new Date(e.date).toLocaleString('uz-UZ')}
                </td>
                <td className="px-4 py-3">{kassaTuri(e.type)}</td>
                <td className="px-4 py-3">{kassaKategoriya(e.category)}</td>
                <td className="px-4 py-3">{formatMoney(e.amount)}</td>
                <td className="px-4 py-3">{e.description || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <IconButton
                      label="Ko‘rish"
                      variant="accent"
                      onClick={() => {
                        setViewing(e)
                        setViewOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Tahrirlash" onClick={() => openEdit(e)}>
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="O‘chirish"
                      variant="danger"
                      onClick={() => onDelete(e._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
            {!data.items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-[var(--muted)]">
                  Hali kassa yozuvi yo‘q
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Kassa yozuvi"
      >
        {viewing ? (
          <div className="space-y-3 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">Tur</p>
                <p className="mt-1 font-semibold">{kassaTuri(viewing.type)}</p>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">Kategoriya</p>
                <p className="mt-1 font-semibold">
                  {kassaKategoriya(viewing.category)}
                </p>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">Summa</p>
                <p className="mt-1 font-semibold">{formatMoney(viewing.amount)}</p>
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-slate-50 p-3">
                <p className="text-[var(--muted)]">Sana</p>
                <p className="mt-1 font-semibold">
                  {new Date(viewing.date).toLocaleString('uz-UZ')}
                </p>
              </div>
            </div>
            <p className="text-[var(--muted)]">
              Izoh: {viewing.description || '—'}
            </p>
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
        title={editing ? 'Pul harakatini tahrirlash' : 'Yangi pul harakati'}
      >
        <form onSubmit={onSubmit} className="grid gap-3">
          <Field label="Tur">
            <Select
              value={form.type}
              onChange={(type) => setForm((f) => ({ ...f, type }))}
              options={[
                { value: 'in', label: 'Kirim' },
                { value: 'out', label: 'Chiqim' },
              ]}
            />
          </Field>
          <Field label="Kategoriya">
            <Select
              value={form.category}
              onChange={(category) => setForm((f) => ({ ...f, category }))}
              options={[
                { value: 'transport', label: 'Yo‘l kira' },
                { value: 'expense', label: 'Xarajat' },
                { value: 'other', label: 'Boshqa' },
                { value: 'debt_collect', label: 'Qarz undirish' },
                { value: 'debt_pay', label: 'Qarz to‘lash' },
              ]}
            />
          </Field>
          <Field label="Summa">
            <Input
              type="number"
              min={0}
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </Field>
          <Field label="Izoh">
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </Field>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saqlanmoqda…' : editing ? 'Saqlash' : 'Kiritish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
