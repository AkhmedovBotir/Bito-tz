import { Router } from 'express';
import * as controller from './inventory.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const inventoryRouter = Router();

inventoryRouter.use(requireAuth);
inventoryRouter.get('/', controller.list);
inventoryRouter.post('/', controller.create);
inventoryRouter.post('/:id/post', controller.post);
inventoryRouter.patch('/:id', controller.update);
inventoryRouter.delete('/:id', controller.remove);
