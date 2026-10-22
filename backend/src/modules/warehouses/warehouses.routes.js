import { Router } from 'express';
import * as controller from './warehouses.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const warehousesRouter = Router();

warehousesRouter.use(requireAuth);
warehousesRouter.get('/', controller.list);
warehousesRouter.post('/', controller.create);
warehousesRouter.get('/stock/overview', controller.stock);
warehousesRouter.get('/:id', controller.getById);
warehousesRouter.patch('/:id', controller.update);
warehousesRouter.delete('/:id', controller.remove);
warehousesRouter.post('/:id/sub-warehouses', controller.addSub);
warehousesRouter.patch('/:id/sub-warehouses/:subId', controller.updateSub);
warehousesRouter.delete('/:id/sub-warehouses/:subId', controller.removeSub);
