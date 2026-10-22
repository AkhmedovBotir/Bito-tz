import * as warehousesService from './warehouses.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await warehousesService.listWarehouses(req.storeId);
  res.json({ success: true, data: items });
});

export const create = asyncHandler(async (req, res) => {
  const item = await warehousesService.createWarehouse(req.storeId, req.body);
  res.status(201).json({ success: true, data: item });
});

export const addSub = asyncHandler(async (req, res) => {
  const item = await warehousesService.addSubWarehouse(
    req.storeId,
    req.params.id,
    req.body
  );
  res.status(201).json({ success: true, data: item });
});

export const getById = asyncHandler(async (req, res) => {
  const item = await warehousesService.getWarehouse(req.storeId, req.params.id);
  res.json({ success: true, data: item });
});

export const stock = asyncHandler(async (req, res) => {
  const data = await warehousesService.stockOverview(req.storeId);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const item = await warehousesService.updateWarehouse(
    req.storeId,
    req.params.id,
    req.body
  );
  res.json({ success: true, data: item });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await warehousesService.deleteWarehouse(req.storeId, req.params.id);
  res.json({ success: true, data: item });
});

export const updateSub = asyncHandler(async (req, res) => {
  const item = await warehousesService.updateSubWarehouse(
    req.storeId,
    req.params.id,
    req.params.subId,
    req.body
  );
  res.json({ success: true, data: item });
});

export const removeSub = asyncHandler(async (req, res) => {
  const item = await warehousesService.deleteSubWarehouse(
    req.storeId,
    req.params.id,
    req.params.subId
  );
  res.json({ success: true, data: item });
});
