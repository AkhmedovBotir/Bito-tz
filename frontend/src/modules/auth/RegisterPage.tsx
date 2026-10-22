import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from './AuthContext'

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
    <div className="flex min-h-svh items-center justify-center p-4">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          Do‘kon tizimi
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--accent)]">
          Do‘kon ro‘yxatdan o‘tishi
        </h1>

        {(
          [
            ['name', 'Do‘kon nomi'],
            ['phone', 'Telefon'],
            ['username', 'Login'],
            ['password', 'Parol'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="mt-3 block text-sm">
            <span className="text-[var(--muted)]">{label}</span>
            <input
              type={key === 'password' ? 'password' : 'text'}
              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              required
            />
          </label>
        ))}

        {error ? (
          <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'Yaratilmoqda…' : 'Ro‘yxatdan o‘tish'}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Allaqachon hisob bormi?{' '}
          <Link className="text-[var(--accent)] underline" to="/login">
            Kirish
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
