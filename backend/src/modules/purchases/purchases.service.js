import { Purchase } from './purchases.model.js';
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

    const unitCost =
      raw.unitCost != null ? Number(raw.unitCost) : Number(product.costPrice);

    lines.push({
      product: product._id,
      warehouse: raw.warehouse,
      subWarehouse: raw.subWarehouse,
      qtyPieces,
      unitCost,
      lineTotal: qtyPieces * unitCost,
    });
  }
  return lines;
}

export async function listPurchases(storeId) {
  return Purchase.find({ store: storeId })
    .populate('lines.product', 'name unitsPerBlock')
    .sort({ createdAt: -1 });
}

export async function createPurchase(storeId, payload) {
  const lines = await buildLines(storeId, payload.lines);
  const totalAmount = lines.reduce((s, l) => s + l.lineTotal, 0);
  const paidAmount = Math.min(Number(payload.paidAmount) || 0, totalAmount);
  const debtAmount = Math.max(0, totalAmount - paidAmount);

  return Purchase.create({
    store: storeId,
    number: payload.number,
    supplierName: payload.supplierName || 'Ta’minotchi',
    lines,
    totalAmount,
    paidAmount,
    debtAmount,
    note: payload.note,
    status: 'draft',
  });
}

export async function updatePurchase(storeId, id, payload) {
  const purchase = await Purchase.findOne({ _id: id, store: storeId });
  if (!purchase) throw new AppError('Xarid topilmadi', 404);
  if (purchase.status === 'posted') {
    throw new AppError('Bajarilgan xaridni o‘zgartirib bo‘lmaydi');
  }

  if (payload.lines) {
    purchase.lines = await buildLines(storeId, payload.lines);
    purchase.totalAmount = purchase.lines.reduce((s, l) => s + l.lineTotal, 0);
  }
  if (payload.supplierName != null) purchase.supplierName = payload.supplierName;
  if (payload.note != null) purchase.note = payload.note;
  if (payload.paidAmount != null || payload.lines) {
    const paid = Math.min(
      Number(
        payload.paidAmount != null ? payload.paidAmount : purchase.paidAmount
      ) || 0,
      purchase.totalAmount
    );
    purchase.paidAmount = paid;
    purchase.debtAmount = Math.max(0, purchase.totalAmount - paid);
  }
  await purchase.save();
  return purchase;
}

export async function deletePurchase(storeId, id) {
  const purchase = await Purchase.findOne({ _id: id, store: storeId });
  if (!purchase) throw new AppError('Xarid topilmadi', 404);
  if (purchase.status === 'posted') {
    throw new AppError('Bajarilgan xaridni o‘chirib bo‘lmaydi');
  }
  await purchase.deleteOne();
  return purchase;
}

export async function postPurchase(storeId, id) {
  const purchase = await Purchase.findOne({ _id: id, store: storeId });
  if (!purchase) throw new AppError('Xarid topilmadi', 404);
  if (purchase.status === 'posted') throw new AppError('Xarid allaqachon bajarilgan');

  for (const line of purchase.lines) {
    await adjustStock({
      storeId,
      productId: line.product,
      warehouseId: line.warehouse,
      subWarehouseId: line.subWarehouse,
      deltaPieces: line.qtyPieces,
    });
  }

  if (purchase.paidAmount > 0) {
    await createEntry(storeId, {
      type: 'out',
      category: 'purchase',
      amount: purchase.paidAmount,
      description: `Xarid #${purchase.number || purchase._id} — ${purchase.supplierName}`,
      relatedType: 'purchase',
      relatedId: purchase._id,
    });
  }

  if (purchase.debtAmount > 0) {
    await createDebt(storeId, {
      kind: 'payable',
      partyName: purchase.supplierName || 'Ta’minotchi',
      amount: purchase.debtAmount,
      relatedType: 'purchase',
      relatedId: purchase._id,
      note: 'Xariddan ta’minotchi qarzi',
    });
  }

  purchase.status = 'posted';
  purchase.postedAt = new Date();
  await purchase.save();
  return purchase;
}
