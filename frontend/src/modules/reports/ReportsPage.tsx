import { Navigate } from 'react-router-dom'

/** Eski /reports yo‘li → qoldiq hisobotiga */
export function ReportsPage() {
  return <Navigate to="/reports/stock" replace />
}
