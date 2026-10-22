import { Warehouse } from './warehouses.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { listStockByStore } from './stock.service.js';
import { fromPieces } from '../../shared/utils/units.js';

export async function listWarehouses(storeId) {
  return Warehouse.find({ store: storeId }).sort({ createdAt: -1 });
}

export async function createWarehouse(storeId, payload) {
  if (!payload.name) throw new AppError('Ombor nomi majburiy');
  const subs = Array.isArray(payload.subWarehouses) ? payload.subWarehouses : [];
  return Warehouse.create({
    store: storeId,
    name: payload.name.trim(),
    code: payload.code?.trim(),
    subWarehouses: subs.map((s) => ({
      name: s.name?.trim(),
      code: s.code?.trim(),
    })),
  });
}

export async function addSubWarehouse(storeId, warehouseId, sub) {
  if (!sub?.name) throw new AppError('Sub-ombor nomi majburiy');
  const warehouse = await Warehouse.findOne({ _id: warehouseId, store: storeId });
  if (!warehouse) throw new AppError('Ombor topilmadi', 404);
  warehouse.subWarehouses.push({
    name: sub.name.trim(),
    code: sub.code?.trim(),
  });
  await warehouse.save();
  return warehouse;
}

export async function getWarehouse(storeId, id) {
  const warehouse = await Warehouse.findOne({ _id: id, store: storeId });
  if (!warehouse) throw new AppError('Ombor topilmadi', 404);
  return warehouse;
}

export async function updateWarehouse(storeId, id, payload) {
  const warehouse = await getWarehouse(storeId, id);
  if (payload.name != null) warehouse.name = payload.name.trim();
  if (payload.code != null) warehouse.code = payload.code.trim();
  if (payload.isActive != null) warehouse.isActive = Boolean(payload.isActive);
  await warehouse.save();
  return warehouse;
}

export async function deleteWarehouse(storeId, id) {
  const warehouse = await Warehouse.findOneAndDelete({ _id: id, store: storeId });
  if (!warehouse) throw new AppError('Ombor topilmadi', 404);
  return warehouse;
}

export async function updateSubWarehouse(storeId, warehouseId, subId, payload) {
  const warehouse = await getWarehouse(storeId, warehouseId);
  const sub = warehouse.subWarehouses.id(subId);
  if (!sub) throw new AppError('Kichik ombor topilmadi', 404);
  if (payload.name != null) sub.name = payload.name.trim();
  if (payload.code != null) sub.code = payload.code?.trim();
  await warehouse.save();
  return warehouse;
}

export async function deleteSubWarehouse(storeId, warehouseId, subId) {
  const warehouse = await getWarehouse(storeId, warehouseId);
  const sub = warehouse.subWarehouses.id(subId);
  if (!sub) throw new AppError('Kichik ombor topilmadi', 404);
  sub.deleteOne();
  await warehouse.save();
  return warehouse;
}

export async function stockOverview(storeId) {
  const stocks = await listStockByStore(storeId);
  return stocks.map((row) => {
    const upb = row.product?.unitsPerBlock || 1;
    const conv = fromPieces(row.qtyPieces, upb);
    const sub = row.warehouse?.subWarehouses?.find(
      (s) => String(s._id) === String(row.subWarehouse)
    );
    return {
      productId: row.product?._id,
      productName: row.product?.name,
      warehouseId: row.warehouse?._id,
      warehouseName: row.warehouse?.name,
      subWarehouseId: row.subWarehouse,
      subWarehouseName: sub?.name || '—',
      ...conv,
      salePrice: row.product?.salePrice || 0,
      stockValue: (row.qtyPieces || 0) * (row.product?.salePrice || 0),
    };
  });
}
