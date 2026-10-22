import { Router } from 'express';
import * as controller from './cash.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const cashRouter = Router();

cashRouter.use(requireAuth);
cashRouter.get('/', controller.list);
cashRouter.post('/', controller.create);
cashRouter.patch('/:id', controller.update);
cashRouter.delete('/:id', controller.remove);
