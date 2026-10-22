import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/auth/AuthContext'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function AppShell() {
  const { store, loading } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (mq.matches) setSidebarOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[var(--bg)] text-[var(--muted)]">
        <div className="erp-panel px-6 py-4 text-sm">Tizim yuklanmoqda…</div>
      </div>
    )
  }

  if (!store) return <Navigate to="/login" replace />

  return (
    <div className="min-h-svh lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <Navbar
          menuOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-auto p-3 md:p-4">
          <div key={location.pathname} className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
