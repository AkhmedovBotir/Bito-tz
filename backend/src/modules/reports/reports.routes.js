import { Router } from 'express';
import * as controller from './reports.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);
reportsRouter.get('/stock', controller.stock);
reportsRouter.get('/sales', controller.sales);
reportsRouter.get('/pnl', controller.pnl);
