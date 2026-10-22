import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { Store } from '../../modules/auth/store.model.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new AppError('Avtorizatsiya talab qilinadi', 401);

    const payload = jwt.verify(token, env.jwtSecret);
    const store = await Store.findById(payload.storeId).select('-password');
    if (!store) throw new AppError('Do‘kon topilmadi', 401);

    req.store = store;
    req.storeId = store._id;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Token yaroqsiz yoki muddati o‘tgan', 401));
  }
}
