import { Stock } from './stock.model.js';
import { AppError } from '../../shared/utils/AppError.js';

export async function getStockQty(storeId, productId, warehouseId, subWarehouseId) {
  const row = await Stock.findOne({
    store: storeId,
    product: productId,
    warehouse: warehouseId,
    subWarehouse: subWarehouseId,
  });
  return row?.qtyPieces || 0;
}

export async function adjustStock({
  storeId,
  productId,
  warehouseId,
  subWarehouseId,
  deltaPieces,
  allowNegative = false,
}) {
  let row = await Stock.findOne({
    store: storeId,
    product: productId,
    warehouse: warehouseId,
    subWarehouse: subWarehouseId,
  });

  if (!row) {
    if (deltaPieces < 0 && !allowNegative) {
      throw new AppError('Omborda yetarli mahsulot yo‘q');
    }
    row = await Stock.create({
      store: storeId,
      product: productId,
      warehouse: warehouseId,
      subWarehouse: subWarehouseId,
      qtyPieces: Math.max(0, deltaPieces),
    });
    return row;
  }

  const next = row.qtyPieces + deltaPieces;
  if (next < 0 && !allowNegative) {
    throw new AppError('Omborda yetarli mahsulot yo‘q');
  }
  row.qtyPieces = Math.max(0, next);
  await row.save();
  return row;
}

export async function setStockQty({
  storeId,
  productId,
  warehouseId,
  subWarehouseId,
  qtyPieces,
}) {
  const row = await Stock.findOneAndUpdate(
    {
      store: storeId,
      product: productId,
      warehouse: warehouseId,
      subWarehouse: subWarehouseId,
    },
    { $set: { qtyPieces: Math.max(0, qtyPieces) } },
    { upsert: true, new: true }
  );
  return row;
}

export async function listStockByStore(storeId) {
  return Stock.find({ store: storeId })
    .populate('product')
    .populate('warehouse')
    .lean();
}
