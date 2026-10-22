import { listStockByStore } from '../warehouses/stock.service.js';
import { fromPieces } from '../../shared/utils/units.js';
import { Sale } from '../sales/sales.model.js';
import { CashEntry } from '../cash/cash.model.js';
import { Debt } from '../debts/debts.model.js';

export async function stockReport(storeId) {
  const stocks = await listStockByStore(storeId);

  return stocks.map((row) => {
    const upb = row.product?.unitsPerBlock || 1;
    const conv = fromPieces(row.qtyPieces || 0, upb);
    const salePrice = row.product?.salePrice || 0;
    const value = conv.qtyPieces * salePrice;
    const sub = row.warehouse?.subWarehouses?.find(
      (s) => String(s._id) === String(row.subWarehouse)
    );

    return {
      productId: row.product?._id,
      productName: row.product?.name || '—',
      warehouseName: row.warehouse?.name || '—',
      subWarehouseName: sub?.name || '—',
      salePrice,
      value,
      display: `${value.toLocaleString('uz-UZ')} so'm / ${conv.qtyPieces} dona (${conv.qtyBlocks} blok)`,
      ...conv,
    };
  });
}

export async function salesReport(storeId) {
  const sales = await Sale.find({ store: storeId, status: 'posted' })
    .populate('lines.product', 'name')
    .sort({ postedAt: -1 })
    .lean();

  const byDateMap = new Map();
  const productMap = new Map();

  for (const sale of sales) {
    const day = (sale.postedAt || sale.createdAt).toISOString().slice(0, 10);
    const prev = byDateMap.get(day) || { date: day, count: 0, totalAmount: 0 };
    prev.count += 1;
    prev.totalAmount += sale.totalAmount || 0;
    byDateMap.set(day, prev);

    for (const line of sale.lines || []) {
      const key = String(line.product?._id || line.product);
      const name = line.product?.name || 'Noma’lum';
      const p = productMap.get(key) || { productId: key, productName: name, qtyPieces: 0, amount: 0 };
      p.qtyPieces += line.qtyPieces || 0;
      p.amount += line.lineTotal || line.qtyPieces * line.unitPrice || 0;
      productMap.set(key, p);
    }
  }

  const byDate = [...byDateMap.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
  const topProducts = [...productMap.values()].sort((a, b) => b.qtyPieces - a.qtyPieces);

  return {
    sales,
    byDate,
    topProducts,
    totals: {
      salesCount: sales.length,
      totalAmount: sales.reduce((s, x) => s + (x.totalAmount || 0), 0),
    },
  };
}

/**
 * Sof foyda = Tushumlar − Tannarx − Xarajatlar
 */
export async function profitAndLoss(storeId) {
  const [sales, cashEntries, debts] = await Promise.all([
    Sale.find({ store: storeId, status: 'posted' }),
    CashEntry.find({ store: storeId }),
    Debt.find({ store: storeId, status: 'open' }),
  ]);

  const revenue = sales.reduce((s, x) => s + (x.totalAmount || 0), 0);
  const cogs = sales.reduce((s, x) => s + (x.cogsAmount || 0), 0);

  const expenseCategories = new Set(['transport', 'expense', 'other']);
  const expenses = cashEntries
    .filter((e) => e.type === 'out' && expenseCategories.has(e.category))
    .reduce((s, e) => s + e.amount, 0);

  const transport = cashEntries
    .filter((e) => e.type === 'out' && e.category === 'transport')
    .reduce((s, e) => s + e.amount, 0);

  const netProfit = revenue - cogs - expenses;

  return {
    formula: 'Tushumlar − Tannarx − Xarajatlar = Sof foyda',
    revenue,
    cogs,
    expenses,
    transport,
    netProfit,
    openReceivables: debts
      .filter((d) => d.kind === 'receivable')
      .reduce((s, d) => s + d.remaining, 0),
    openPayables: debts
      .filter((d) => d.kind === 'payable')
      .reduce((s, d) => s + d.remaining, 0),
  };
}
