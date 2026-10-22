import * as authService from './auth.service.js';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const data = await authService.registerStore(req.body);
  res.status(201).json({ success: true, data });
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.loginStore(req.body);
  res.json({ success: true, data });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.store.toSafeJSON() });
});
