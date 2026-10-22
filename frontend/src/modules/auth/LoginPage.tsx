import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Button, Field, Input } from '@/shared/ui/Field'

export function LoginPage() {
  const { login, store, loading } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && store) return <Navigate to="/" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
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
            Do‘kon ERP tizimi
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            Ombor qoldig‘i, savdo-xarid hujjatlari, kassa va sof foydani bitta
            professional ish muhitida boshqaring.
          </p>
        </div>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Dona / blok hisobi</li>
          <li>• Draft → bajarish oqimi</li>
          <li>• Qarzlar va P&L hisobotlari</li>
        </ul>
      </aside>

      <div className="flex items-center justify-center bg-[var(--bg)] p-4">
        <form
          onSubmit={onSubmit}
          className="erp-panel w-full max-w-md p-6"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Tizimga kirish
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
            Do‘kon hisobi
          </h2>
          <p className="mt-1 text-[13px] text-[var(--muted)]">
            Login va parol bilan davom eting
          </p>

          <div className="mt-5 space-y-3">
            <Field label="Login">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Parol">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
          </div>

          {error ? (
            <p className="mt-3 text-[13px] text-[var(--danger)]">{error}</p>
          ) : null}

          <Button type="submit" disabled={submitting} className="mt-5 w-full">
            {submitting ? 'Kutilmoqda…' : 'Kirish'}
          </Button>

          <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
            Hisob yo‘qmi?{' '}
            <Link className="font-medium text-[var(--accent)] hover:underline" to="/register">
              Ro‘yxatdan o‘tish
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
