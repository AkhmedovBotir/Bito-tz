import { Debt } from './debts.model.js';

export async function createDebt(storeId, payload) {
  return Debt.create({
    store: storeId,
    kind: payload.kind,
    partyName: payload.partyName,
    amount: payload.amount,
    remaining: payload.amount,
    relatedType: payload.relatedType,
    relatedId: payload.relatedId,
    note: payload.note,
    status: 'open',
  });
}

export async function listDebts(storeId, query = {}) {
  const filter = { store: storeId };
  if (query.kind) filter.kind = query.kind;
  if (query.status) filter.status = query.status;
  return Debt.find(filter).sort({ createdAt: -1 });
}
