import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  wide = false,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Yopish"
            className="absolute inset-0 bg-slate-900/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.16 }}
            className={[
              'relative z-10 max-h-[90svh] w-full overflow-y-auto border border-[var(--border)] bg-[var(--surface)] shadow-xl',
              'rounded-[var(--radius)]',
              wide ? 'max-w-3xl' : 'max-w-lg',
            ].join(' ')}
          >
            <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-[var(--border)] bg-[#f8fafc] px-4 py-3">
              <div>
                <h3 className="text-[15px] font-semibold text-[var(--ink)]">{title}</h3>
                {description ? (
                  <p className="mt-0.5 text-[12px] text-[var(--muted)]">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-[var(--radius)] border border-[var(--border)] p-1.5 text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-4 py-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
