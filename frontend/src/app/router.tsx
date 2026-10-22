import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/shared/layout/AppShell'
import { LoginPage } from '@/modules/auth/LoginPage'
import { RegisterPage } from '@/modules/auth/RegisterPage'
import { DashboardPage } from '@/modules/dashboard/DashboardPage'
import { ProductsPage } from '@/modules/products/ProductsPage'
import { WarehousesPage } from '@/modules/warehouses/WarehousesPage'
import { SalesPage } from '@/modules/sales/SalesPage'
import { PurchasesPage } from '@/modules/purchases/PurchasesPage'
import { InventoryPage } from '@/modules/inventory/InventoryPage'
import { CashPage } from '@/modules/cash/CashPage'
import { DebtsPage } from '@/modules/debts/DebtsPage'
import { StockReportPage } from '@/modules/reports/StockReportPage'
import { SalesReportPage } from '@/modules/reports/SalesReportPage'
import { PnlReportPage } from '@/modules/reports/PnlReportPage'
import { ReportsPage } from '@/modules/reports/ReportsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="cash" element={<CashPage />} />
          <Route path="debts" element={<DebtsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/stock" element={<StockReportPage />} />
          <Route path="reports/sales" element={<SalesReportPage />} />
          <Route path="reports/pnl" element={<PnlReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
