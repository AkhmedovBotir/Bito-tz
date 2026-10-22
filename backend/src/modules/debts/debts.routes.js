import { Router } from 'express';
import * as controller from './debts.controller.js';
import { requireAuth } from '../../shared/middleware/auth.js';

export const debtsRouter = Router();

debtsRouter.use(requireAuth);
debtsRouter.get('/', controller.list);
