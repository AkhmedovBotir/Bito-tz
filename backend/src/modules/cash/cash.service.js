import { CashEntry } from './cash.model.js';
import { AppError } from '../../shared/utils/AppError.js';

export async function listEntries(storeId) {
  return CashEntry.find({ store: storeId }).sort({ date: -1 });
}

export async function createEntry(storeId, payload) {
  if (!payload.type || payload.amount == null) {
    throw new AppError('type va amount majburiy');
  }
  if (!['in', 'out'].includes(payload.type)) {
    throw new AppError('type faqat in yoki out bo‘lishi mumkin');
  }
  return CashEntry.create({
    store: storeId,
    type: payload.type,
    category: payload.category || 'other',
    amount: Number(payload.amount),
    description: payload.description,
    relatedType: payload.relatedType,
    relatedId: payload.relatedId,
    date: payload.date || new Date(),
  });
}

export async function cashBalance(storeId) {
  const entries = await CashEntry.find({ store: storeId });
  return entries.reduce((sum, e) => sum + (e.type === 'in' ? e.amount : -e.amount), 0);
}

export async function updateEntry(storeId, id, payload) {
  const entry = await CashEntry.findOne({ _id: id, store: storeId });
  if (!entry) throw new AppError('Kassa yozuvi topilmadi', 404);

  if (payload.type != null) {
    if (!['in', 'out'].includes(payload.type)) {
      throw new AppError('type faqat in yoki out bo‘lishi mumkin');
    }
    entry.type = payload.type;
  }
  if (payload.category != null) entry.category = payload.category;
  if (payload.amount != null) entry.amount = Number(payload.amount);
  if (payload.description != null) entry.description = payload.description;
  if (payload.date != null) entry.date = payload.date;
  await entry.save();
  return entry;
}

export async function deleteEntry(storeId, id) {
  const entry = await CashEntry.findOneAndDelete({ _id: id, store: storeId });
  if (!entry) throw new AppError('Kassa yozuvi topilmadi', 404);
  return entry;
}
