import * as cashService from './cash.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await cashService.listEntries(req.storeId);
  const balance = await cashService.cashBalance(req.storeId);
  res.json({ success: true, data: { items, balance } });
});

export const create = asyncHandler(async (req, res) => {
  const item = await cashService.createEntry(req.storeId, req.body);
  res.status(201).json({ success: true, data: item });
});

export const update = asyncHandler(async (req, res) => {
  const item = await cashService.updateEntry(req.storeId, req.params.id, req.body);
  res.json({ success: true, data: item });
});

export const remove = asyncHandler(async (req, res) => {
  const item = await cashService.deleteEntry(req.storeId, req.params.id);
  res.json({ success: true, data: item });
});
