import * as reportsService from './reports.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const stock = asyncHandler(async (req, res) => {
  const data = await reportsService.stockReport(req.storeId);
  res.json({ success: true, data });
});

export const sales = asyncHandler(async (req, res) => {
  const data = await reportsService.salesReport(req.storeId);
  res.json({ success: true, data });
});

export const pnl = asyncHandler(async (req, res) => {
  const data = await reportsService.profitAndLoss(req.storeId);
  res.json({ success: true, data });
});
