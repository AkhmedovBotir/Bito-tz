import * as inventoryService from './inventory.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await inventoryService.listCounts(req.storeId);
  res.json({ success: true, data: items });
});

export const create = asyncHandler(async (req, res) => {
  const item = await inventoryService.createCount(req.storeId, req.body);
  res.status(201).json({ success: true, data: item });
});

export const post = asyncHandler(async (req, res) => {
  const item = await inventoryService.postCount(req.storeId, req.params.id);
  res.json({ success: true, data: item });
});

export const update = asyncHandler(async (req, res) => {
  const item = await inventoryService.updateCount(
    req.storeId,
    req.params.id,
    req.body
  );
  res.json({ success: true, data: item });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await inventoryService.deleteCount(req.storeId, req.params.id);
  res.json({ success: true, data: item });
});
