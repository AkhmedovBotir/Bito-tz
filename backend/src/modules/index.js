import { authRouter } from './auth/auth.routes.js';
import { productsRouter } from './products/products.routes.js';
import { warehousesRouter } from './warehouses/warehouses.routes.js';
import { salesRouter } from './sales/sales.routes.js';
import { purchasesRouter } from './purchases/purchases.routes.js';
import { inventoryRouter } from './inventory/inventory.routes.js';
import { cashRouter } from './cash/cash.routes.js';
import { debtsRouter } from './debts/debts.routes.js';
import { reportsRouter } from './reports/reports.routes.js';

export function registerModules(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/warehouses', warehousesRouter);
  app.use('/api/sales', salesRouter);
  app.use('/api/purchases', purchasesRouter);
  app.use('/api/inventory', inventoryRouter);
  app.use('/api/cash', cashRouter);
  app.use('/api/debts', debtsRouter);
  app.use('/api/reports', reportsRouter);
}
