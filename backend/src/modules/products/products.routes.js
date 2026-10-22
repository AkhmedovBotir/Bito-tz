import { Router } from 'express';
import * as controller from './products.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const productsRouter = Router();

productsRouter.use(requireAuth);
productsRouter.get('/', controller.list);
productsRouter.post('/', controller.create);
productsRouter.post('/convert', controller.convert);
productsRouter.get('/:id', controller.getById);
productsRouter.patch('/:id', controller.update);
productsRouter.delete('/:id', controller.remove);
