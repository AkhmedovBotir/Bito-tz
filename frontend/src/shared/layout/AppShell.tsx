import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/modules/auth/AuthContext'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function AppShell() {
  const { store, loading } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Katta ekranga o'tganda drawer yopilsin
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
      <div className="flex min-h-svh items-center justify-center text-[var(--muted)]">
        Yuklanmoqda…
      </div>
    )
  }

  if (!store) return <Navigate to="/login" replace />

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-svh min-w-0 flex-col">
        <Navbar
          menuOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
