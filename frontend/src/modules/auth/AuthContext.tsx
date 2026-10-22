import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiGet, apiPost } from '@/shared/api/client'
import type { AuthPayload, StoreUser } from './types'

type AuthContextValue = {
  store: StoreUser | null
  token: string | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (payload: {
    name: string
    phone: string
    username: string
    password: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreUser | null>(null)
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )
  const [loading, setLoading] = useState(true)

  const applyAuth = useCallback((data: AuthPayload) => {
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setStore(data.store)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setStore(null)
  }, [])

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    apiGet<StoreUser>('/api/auth/me')
      .then(setStore)
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [token, logout])

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await apiPost<AuthPayload>('/api/auth/login', {
        username,
        password,
      })
      applyAuth(data)
    },
    [applyAuth]
  )

  const register = useCallback(
    async (payload: {
      name: string
      phone: string
      username: string
      password: string
    }) => {
      const data = await apiPost<AuthPayload>('/api/auth/register', payload)
      applyAuth(data)
    },
    [applyAuth]
  )

  const value = useMemo(
    () => ({ store, token, loading, login, register, logout }),
    [store, token, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatiladi')
  return ctx
}
