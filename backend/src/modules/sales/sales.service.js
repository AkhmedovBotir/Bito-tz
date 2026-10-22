import { Sale } from './sales.model.js';
import { Product } from '../products/products.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { toPieces } from '../../shared/utils/units.js';
import { adjustStock } from '../warehouses/stock.service.js';
import { createEntry } from '../cash/cash.service.js';
import { createDebt } from '../debts/debts.service.js';

async function buildLines(storeId, rawLines = []) {
  if (!rawLines.length) throw new AppError('Kamida bitta qator kerak');

  const lines = [];
  for (const raw of rawLines) {
    const product = await Product.findOne({ _id: raw.product, store: storeId });
    if (!product) throw new AppError('Mahsulot topilmadi');

    const qtyPieces =
      raw.qtyPieces != null
        ? Number(raw.qtyPieces)
        : toPieces({ pieces: raw.pieces, blocks: raw.blocks }, product.unitsPerBlock);

    if (qtyPieces < 1) throw new AppError('Miqdor noto‘g‘ri');

    const unitPrice =
      raw.unitPrice != null ? Number(raw.unitPrice) : Number(product.salePrice);

    lines.push({
      product: product._id,
      warehouse: raw.warehouse,
      subWarehouse: raw.subWarehouse,
      qtyPieces,
      unitPrice,
      unitCost: Number(product.costPrice) || 0,
      lineTotal: qtyPieces * unitPrice,
    });
  }
  return lines;
}

export async function listSales(storeId) {
  return Sale.find({ store: storeId })
    .populate('lines.product', 'name unitsPerBlock')
    .sort({ createdAt: -1 });
}

export async function createSale(storeId, payload) {
  const lines = await buildLines(storeId, payload.lines);
  const totalAmount = lines.reduce((s, l) => s + l.lineTotal, 0);
  const paidAmount = Math.min(Number(payload.paidAmount) || 0, totalAmount);
  const debtAmount = Math.max(0, totalAmount - paidAmount);

  return Sale.create({
    store: storeId,
    number: payload.number,
    customerName: payload.customerName || 'Mijoz',
    lines,
    totalAmount,
    paidAmount,
    debtAmount,
    note: payload.note,
    status: 'draft',
  });
}

export async function updateSale(storeId, id, payload) {
  const sale = await Sale.findOne({ _id: id, store: storeId });
  if (!sale) throw new AppError('Savdo topilmadi', 404);
  if (sale.status === 'posted') {
    throw new AppError('Bajarilgan savdoni o‘zgartirib bo‘lmaydi');
  }

  if (payload.lines) {
    sale.lines = await buildLines(storeId, payload.lines);
    sale.totalAmount = sale.lines.reduce((s, l) => s + l.lineTotal, 0);
  }
  if (payload.customerName != null) sale.customerName = payload.customerName;
  if (payload.note != null) sale.note = payload.note;
  if (payload.paidAmount != null || payload.lines) {
    const paid = Math.min(
      Number(payload.paidAmount != null ? payload.paidAmount : sale.paidAmount) || 0,
      sale.totalAmount
    );
    sale.paidAmount = paid;
    sale.debtAmount = Math.max(0, sale.totalAmount - paid);
  }
  await sale.save();
  return sale;
}

export async function deleteSale(storeId, id) {
  const sale = await Sale.findOne({ _id: id, store: storeId });
  if (!sale) throw new AppError('Savdo topilmadi', 404);
  if (sale.status === 'posted') {
    throw new AppError('Bajarilgan savdoni o‘chirib bo‘lmaydi');
  }
  await sale.deleteOne();
  return sale;
}

export async function postSale(storeId, id) {
  const sale = await Sale.findOne({ _id: id, store: storeId });
  if (!sale) throw new AppError('Savdo topilmadi', 404);
  if (sale.status === 'posted') throw new AppError('Savdo allaqachon bajarilgan');

  let cogs = 0;
  for (const line of sale.lines) {
    await adjustStock({
      storeId,
      productId: line.product,
      warehouseId: line.warehouse,
      subWarehouseId: line.subWarehouse,
      deltaPieces: -line.qtyPieces,
    });
    cogs += line.qtyPieces * (line.unitCost || 0);
  }

  if (sale.paidAmount > 0) {
    await createEntry(storeId, {
      type: 'in',
      category: 'sale',
      amount: sale.paidAmount,
      description: `Savdo #${sale.number || sale._id} — ${sale.customerName}`,
      relatedType: 'sale',
      relatedId: sale._id,
    });
  }

  if (sale.debtAmount > 0) {
    await createDebt(storeId, {
      kind: 'receivable',
      partyName: sale.customerName || 'Mijoz',
      amount: sale.debtAmount,
      relatedType: 'sale',
      relatedId: sale._id,
      note: 'Savdodan qolgan mijoz qarzi',
    });
  }

  sale.status = 'posted';
  sale.postedAt = new Date();
  sale.cogsAmount = cogs;
  await sale.save();
  return sale;
}
