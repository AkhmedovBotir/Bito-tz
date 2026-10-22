import { Router } from 'express';
import * as controller from './purchases.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const purchasesRouter = Router();

purchasesRouter.use(requireAuth);
purchasesRouter.get('/', controller.list);
purchasesRouter.post('/', controller.create);
purchasesRouter.post('/:id/post', controller.post);
purchasesRouter.patch('/:id', controller.update);
purchasesRouter.delete('/:id', controller.remove);
