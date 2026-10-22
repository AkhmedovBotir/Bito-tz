import { Router } from 'express';
import * as controller from './sales.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const salesRouter = Router();

salesRouter.use(requireAuth);
salesRouter.get('/', controller.list);
salesRouter.post('/', controller.create);
salesRouter.post('/:id/post', controller.post);
salesRouter.patch('/:id', controller.update);
salesRouter.delete('/:id', controller.remove);
