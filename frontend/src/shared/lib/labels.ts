export function holatMatni(status?: string) {
  if (status === 'draft') return 'Qoralama'
  if (status === 'posted') return 'Bajarilgan'
  if (status === 'open') return 'Ochiq'
  if (status === 'closed') return 'Yopilgan'
  return status || '—'
}

export function kassaTuri(type?: string) {
  if (type === 'in') return 'Kirim'
  if (type === 'out') return 'Chiqim'
  return type || '—'
}

export function kassaKategoriya(category?: string) {
  const map: Record<string, string> = {
    sale: 'Savdo',
    purchase: 'Xarid',
    debt_collect: 'Qarz undirish',
    debt_pay: 'Qarz to‘lash',
    transport: 'Yo‘l kira',
    expense: 'Xarajat',
    other: 'Boshqa',
  }
  return map[category || ''] || category || '—'
}

export function qarzTuri(kind?: string) {
  if (kind === 'receivable') return 'Mijoz qarzi'
  if (kind === 'payable') return 'Ta’minotchi qarzi'
  return kind || '—'
}
