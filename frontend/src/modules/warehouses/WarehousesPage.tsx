import { useEffect, useState, type FormEvent } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/shared/ui/PageHeader'
import { Button, Field, Input, Select } from '@/shared/ui/Field'
import { Modal } from '@/shared/ui/Modal'
import { IconButton } from '@/shared/ui/IconButton'
import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api/client'
import { useDialog } from '@/shared/ui/DialogProvider'

type Sub = { _id: string; name: string; code?: string }
type Warehouse = {
  _id: string
  name: string
  code?: string
  subWarehouses: Sub[]
}

export function WarehousesPage() {
  const { confirm } = useDialog()
  const [items, setItems] = useState<Warehouse[]>([])
  const [error, setError] = useState('')
  const [whModal, setWhModal] = useState(false)
  const [subModal, setSubModal] = useState(false)
  const [editingWh, setEditingWh] = useState<Warehouse | null>(null)
  const [editingSub, setEditingSub] = useState<{
    warehouseId: string
    sub: Sub
  } | null>(null)
  const [name, setName] = useState('')
  const [subName, setSubName] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const data = await apiGet<Warehouse[]>('/api/warehouses')
    setItems(data)
    if (!selectedId && data[0]) setSelectedId(data[0]._id)
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  function openCreateWh() {
    setEditingWh(null)
    setName('')
    setError('')
    setWhModal(true)
  }

  function openEditWh(w: Warehouse) {
    setEditingWh(w)
    setName(w.name)
    setError('')
    setWhModal(true)
  }

  function openCreateSub(warehouseId?: string) {
    setEditingSub(null)
    setSubName('')
    if (warehouseId) setSelectedId(warehouseId)
    setError('')
    setSubModal(true)
  }

  function openEditSub(warehouseId: string, sub: Sub) {
    setEditingSub({ warehouseId, sub })
    setSelectedId(warehouseId)
    setSubName(sub.name)
    setError('')
    setSubModal(true)
  }

  async function saveWarehouse(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingWh) {
        await apiPatch(`/api/warehouses/${editingWh._id}`, { name })
      } else {
        await apiPost('/api/warehouses', {
          name,
          subWarehouses: [{ name: 'Asosiy zona' }],
        })
      }
      setName('')
      setWhModal(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    } finally {
      setSaving(false)
    }
  }

  async function saveSub(e: FormEvent) {
    e.preventDefault()
    if (!selectedId) return
    setError('')
    setSaving(true)
    try {
      if (editingSub) {
        await apiPatch(
          `/api/warehouses/${editingSub.warehouseId}/sub-warehouses/${editingSub.sub._id}`,
          { name: subName }
        )
      } else {
        await apiPost(`/api/warehouses/${selectedId}/sub-warehouses`, {
          name: subName,
        })
      }
      setSubName('')
      setSubModal(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    } finally {
      setSaving(false)
    }
  }

  async function removeWarehouse(id: string) {
    const ok = await confirm('Omborni o‘chirishni tasdiqlaysizmi?', {
      title: 'Omborni o‘chirish',
      confirmText: 'O‘chirish',
    })
    if (!ok) return
    setError('')
    try {
      await apiDelete(`/api/warehouses/${id}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  async function removeSub(warehouseId: string, subId: string) {
    const ok = await confirm('Kichik omborni o‘chirishni tasdiqlaysizmi?', {
      title: 'Kichik omborni o‘chirish',
      confirmText: 'O‘chirish',
    })
    if (!ok) return
    setError('')
    try {
      await apiDelete(`/api/warehouses/${warehouseId}/sub-warehouses/${subId}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Omborlar"
        description="Asosiy ombor va ichidagi kichik omborlar. Mahsulot joylashuvi shu orqali belgilanadi."
        actions={
          <>
            <Button type="button" variant="ghost" onClick={() => openCreateSub()}>
              + Kichik ombor
            </Button>
            <Button type="button" onClick={openCreateWh}>
              + Yangi ombor
            </Button>
          </>
        }
      />

      {error && !whModal && !subModal ? (
        <p className="text-sm text-[var(--danger)]">{error}</p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((w) => (
          <article
            key={w._id}
            className="erp-panel p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{w.name}</h3>
              <div className="flex gap-1">
                <IconButton label="Tahrirlash" onClick={() => openEditWh(w)}>
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="O‘chirish"
                  variant="danger"
                  onClick={() => removeWarehouse(w._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {w.subWarehouses?.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-[var(--bg)] px-2 py-1.5 text-[var(--muted)]"
                >
                  <span>↳ {s.name}</span>
                  <span className="flex gap-1">
                    <IconButton
                      label="Kichik omborni tahrirlash"
                      onClick={() => openEditSub(w._id, s)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton
                      label="Kichik omborni o‘chirish"
                      variant="danger"
                      onClick={() => removeSub(w._id, s._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </span>
                </li>
              ))}
              {!w.subWarehouses?.length ? (
                <li className="text-[var(--muted)]">Kichik ombor yo‘q</li>
              ) : null}
            </ul>
          </article>
        ))}
        {!items.length ? (
          <p className="text-sm text-[var(--muted)]">Hali ombor yaratilmagan</p>
        ) : null}
      </div>

      <Modal
        open={whModal}
        onClose={() => setWhModal(false)}
        title={editingWh ? 'Omborni tahrirlash' : 'Yangi ombor'}
        description={
          editingWh
            ? undefined
            : 'Birinchi kichik ombor avtomatik «Asosiy zona» bo‘ladi'
        }
      >
        <form onSubmit={saveWarehouse} className="space-y-3">
          <Field label="Ombor nomi">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setWhModal(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saqlanmoqda…' : editingWh ? 'Saqlash' : 'Yaratish'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={subModal}
        onClose={() => setSubModal(false)}
        title={editingSub ? 'Kichik omborni tahrirlash' : 'Kichik ombor qo‘shish'}
      >
        <form onSubmit={saveSub} className="space-y-3">
          {!editingSub ? (
            <Field label="Asosiy ombor">
              <Select
                value={selectedId}
                onChange={setSelectedId}
                required
                options={[
                  { value: '', label: 'Tanlang' },
                  ...items.map((w) => ({ value: w._id, label: w.name })),
                ]}
              />
            </Field>
          ) : null}
          <Field label="Kichik ombor nomi">
            <Input
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              required
            />
          </Field>
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setSubModal(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saqlanmoqda…' : editingSub ? 'Saqlash' : 'Qo‘shish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
