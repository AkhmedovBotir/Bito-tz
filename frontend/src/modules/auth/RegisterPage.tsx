import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Button, Field, Input } from '@/shared/ui/Field'

export function RegisterPage() {
  const { register, store, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && store) return <Navigate to="/" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <aside className="hidden flex-col justify-between bg-[var(--sidebar)] p-10 text-white lg:flex">
        <div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-[var(--sidebar-active)] text-sm font-bold">
            ERP
          </div>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">
            Yangi do‘kon ochish
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            Bir necha daqiqada do‘kon hisobini yarating va ombor-moliyani
            boshqarishni boshlang.
          </p>
        </div>
        <p className="text-sm text-slate-500">Mini-ERP · Ichimliklar do‘koni</p>
      </aside>

      <div className="flex items-center justify-center bg-[var(--bg)] p-4">
        <form onSubmit={onSubmit} className="erp-panel w-full max-w-md p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Ro‘yxatdan o‘tish
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
            Do‘kon ma’lumotlari
          </h2>

          <div className="mt-5 space-y-3">
            {(
              [
                ['name', 'Do‘kon nomi'],
                ['phone', 'Telefon'],
                ['username', 'Login'],
                ['password', 'Parol'],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <Input
                  type={key === 'password' ? 'password' : 'text'}
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  required
                />
              </Field>
            ))}
          </div>

          {error ? (
            <p className="mt-3 text-[13px] text-[var(--danger)]">{error}</p>
          ) : null}

          <Button type="submit" disabled={submitting} className="mt-5 w-full">
            {submitting ? 'Yaratilmoqda…' : 'Ro‘yxatdan o‘tish'}
          </Button>

          <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
            Allaqachon hisob bormi?{' '}
            <Link className="font-medium text-[var(--accent)] hover:underline" to="/login">
              Kirish
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
