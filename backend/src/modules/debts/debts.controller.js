import * as debtsService from './debts.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await debtsService.listDebts(req.storeId, req.query);
  res.json({ success: true, data: items });
});
