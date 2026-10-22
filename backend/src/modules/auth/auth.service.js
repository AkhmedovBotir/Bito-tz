import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Store } from './store.model.js';
import { AppError } from '../../shared/utils/AppError.js';
import { env } from '../../shared/config/env.js';

function signToken(store) {
  return jwt.sign({ storeId: store._id, username: store.username }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export async function registerStore({ name, phone, username, password }) {
  if (!name || !phone || !username || !password) {
    throw new AppError('name, phone, username va password majburiy');
  }

  const exists = await Store.findOne({ username: username.toLowerCase().trim() });
  if (exists) throw new AppError('Bu username band');

  const hashed = await bcrypt.hash(password, 10);
  const store = await Store.create({
    name: name.trim(),
    phone: phone.trim(),
    username: username.toLowerCase().trim(),
    password: hashed,
  });

  const token = signToken(store);
  return { token, store: store.toSafeJSON() };
}

export async function loginStore({ username, password }) {
  if (!username || !password) throw new AppError('username va password majburiy');

  const store = await Store.findOne({ username: username.toLowerCase().trim() });
  if (!store) throw new AppError('Login yoki parol noto‘g‘ri', 401);

  const ok = await bcrypt.compare(password, store.password);
  if (!ok) throw new AppError('Login yoki parol noto‘g‘ri', 401);

  const token = signToken(store);
  return { token, store: store.toSafeJSON() };
}

export async function createStoreCli(payload) {
  return registerStore(payload);
}
