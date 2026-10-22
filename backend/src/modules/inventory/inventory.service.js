import { InventoryCount } from './inventory.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { toPieces } from '../../shared/utils/units.js';
import { Product } from '../products/products.model.js';
import { getStockQty, setStockQty } from '../warehouses/stock.service.js';

export async function listCounts(storeId) {
  return InventoryCount.find({ store: storeId })
    .populate('lines.product', 'name unitsPerBlock')
    .sort({ createdAt: -1 });
}

export async function createCount(storeId, payload) {
  if (!payload.lines?.length) throw new AppError('Kamida bitta qator kerak');

  const lines = [];
  for (const raw of payload.lines) {
    const product = await Product.findOne({ _id: raw.product, store: storeId });
    if (!product) throw new AppError('Mahsulot topilmadi');

    const countedQty =
      raw.countedQty != null
        ? Number(raw.countedQty)
        : toPieces({ pieces: raw.pieces, blocks: raw.blocks }, product.unitsPerBlock);

    const systemQty = await getStockQty(
      storeId,
      raw.product,
      raw.warehouse,
      raw.subWarehouse
    );

    lines.push({
      product: raw.product,
      warehouse: raw.warehouse,
      subWarehouse: raw.subWarehouse,
      systemQty,
      countedQty,
      difference: countedQty - systemQty,
    });
  }

  return InventoryCount.create({
    store: storeId,
    lines,
    note: payload.note,
    status: 'draft',
  });
}

export async function updateCount(storeId, id, payload) {
  const doc = await InventoryCount.findOne({ _id: id, store: storeId });
  if (!doc) throw new AppError('Inventarizatsiya topilmadi', 404);
  if (doc.status === 'posted') {
    throw new AppError('Bajarilgan aktni o‘zgartirib bo‘lmaydi');
  }

  if (payload.note != null) doc.note = payload.note;

  if (payload.lines?.length) {
    const lines = [];
    for (const raw of payload.lines) {
      const product = await Product.findOne({ _id: raw.product, store: storeId });
      if (!product) throw new AppError('Mahsulot topilmadi');

      const countedQty =
        raw.countedQty != null
          ? Number(raw.countedQty)
          : toPieces({ pieces: raw.pieces, blocks: raw.blocks }, product.unitsPerBlock);

      const systemQty = await getStockQty(
        storeId,
        raw.product,
        raw.warehouse,
        raw.subWarehouse
      );

      lines.push({
        product: raw.product,
        warehouse: raw.warehouse,
        subWarehouse: raw.subWarehouse,
        systemQty,
        countedQty,
        difference: countedQty - systemQty,
      });
    }
    doc.lines = lines;
  }

  await doc.save();
  return doc;
}

export async function deleteCount(storeId, id) {
  const doc = await InventoryCount.findOne({ _id: id, store: storeId });
  if (!doc) throw new AppError('Inventarizatsiya topilmadi', 404);
  if (doc.status === 'posted') {
    throw new AppError('Bajarilgan aktni o‘chirib bo‘lmaydi');
  }
  await doc.deleteOne();
  return doc;
}

export async function postCount(storeId, id) {
  const doc = await InventoryCount.findOne({ _id: id, store: storeId });
  if (!doc) throw new AppError('Inventarizatsiya topilmadi', 404);
  if (doc.status === 'posted') throw new AppError('Allaqachon bajarilgan');

  for (const line of doc.lines) {
    await setStockQty({
      storeId,
      productId: line.product,
      warehouseId: line.warehouse,
      subWarehouseId: line.subWarehouse,
      qtyPieces: line.countedQty,
    });
  }

  doc.status = 'posted';
  doc.postedAt = new Date();
  await doc.save();
  return doc;
}
