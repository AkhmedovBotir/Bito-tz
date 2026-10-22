import { holatMatni } from '@/shared/lib/labels'

export function StatusBadge({ status }: { status?: string }) {
  const label = holatMatni(status)
  const cls =
    status === 'draft'
      ? 'erp-badge erp-badge-draft'
      : status === 'posted' || status === 'closed'
        ? 'erp-badge erp-badge-posted'
        : status === 'open'
          ? 'erp-badge erp-badge-neutral'
          : 'erp-badge erp-badge-neutral'

  return <span className={cls}>{label}</span>
}
