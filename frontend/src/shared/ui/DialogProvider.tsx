import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Input } from './Field'

type AlertOptions = {
  title?: string
  confirmText?: string
}

type ConfirmOptions = {
  title?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

type PromptOptions = {
  title?: string
  confirmText?: string
  cancelText?: string
  defaultValue?: string
  placeholder?: string
}

type DialogApi = {
  alert: (message: string, options?: AlertOptions) => Promise<void>
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>
  prompt: (message: string, options?: PromptOptions) => Promise<string | null>
}

type DialogState =
  | {
      kind: 'alert'
      message: string
      title: string
      confirmText: string
      resolve: (value: void) => void
    }
  | {
      kind: 'confirm'
      message: string
      title: string
      confirmText: string
      cancelText: string
      danger: boolean
      resolve: (value: boolean) => void
    }
  | {
      kind: 'prompt'
      message: string
      title: string
      confirmText: string
      cancelText: string
      defaultValue: string
      placeholder: string
      resolve: (value: string | null) => void
    }

const DialogContext = createContext<DialogApi | null>(null)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [promptValue, setPromptValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => setDialog(null), [])

  const alert = useCallback((message: string, options?: AlertOptions) => {
    return new Promise<void>((resolve) => {
      setDialog({
        kind: 'alert',
        message,
        title: options?.title || 'Xabar',
        confirmText: options?.confirmText || 'Tushundim',
        resolve,
      })
    })
  }, [])

  const confirm = useCallback((message: string, options?: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        kind: 'confirm',
        message,
        title: options?.title || 'Tasdiqlash',
        confirmText: options?.confirmText || 'Ha',
        cancelText: options?.cancelText || 'Bekor qilish',
        danger: options?.danger ?? true,
        resolve,
      })
    })
  }, [])

  const prompt = useCallback((message: string, options?: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      setPromptValue(options?.defaultValue || '')
      setDialog({
        kind: 'prompt',
        message,
        title: options?.title || 'Kiritish',
        confirmText: options?.confirmText || 'Saqlash',
        cancelText: options?.cancelText || 'Bekor qilish',
        defaultValue: options?.defaultValue || '',
        placeholder: options?.placeholder || '',
        resolve,
      })
      queueMicrotask(() => inputRef.current?.focus())
    })
  }, [])

  const api = useMemo(() => ({ alert, confirm, prompt }), [alert, confirm, prompt])

  function finishAlert() {
    if (dialog?.kind !== 'alert') return
    dialog.resolve()
    close()
  }

  function finishConfirm(value: boolean) {
    if (dialog?.kind !== 'confirm') return
    dialog.resolve(value)
    close()
  }

  function finishPrompt(value: string | null) {
    if (dialog?.kind !== 'prompt') return
    dialog.resolve(value)
    close()
  }

  return (
    <DialogContext.Provider value={api}>
      {children}
      {createPortal(
        <AnimatePresence>
          {dialog ? (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
              <motion.button
                type="button"
                aria-label="Yopish"
                className="absolute inset-0 bg-[#0f1a14]/50 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (dialog.kind === 'alert') finishAlert()
                  else if (dialog.kind === 'confirm') finishConfirm(false)
                  else finishPrompt(null)
                }}
              />
              <motion.div
                role="alertdialog"
                aria-modal="true"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl"
              >
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  {dialog.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{dialog.message}</p>

                {dialog.kind === 'prompt' ? (
                  <div className="mt-4">
                    <Input
                      ref={inputRef}
                      value={promptValue}
                      placeholder={dialog.placeholder}
                      onChange={(e) => setPromptValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') finishPrompt(promptValue)
                      }}
                    />
                  </div>
                ) : null}

                <div className="mt-5 flex justify-end gap-2">
                  {dialog.kind !== 'alert' ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        dialog.kind === 'confirm'
                          ? finishConfirm(false)
                          : finishPrompt(null)
                      }
                    >
                      {dialog.cancelText}
                    </Button>
                  ) : null}

                  {dialog.kind === 'alert' ? (
                    <Button type="button" onClick={finishAlert}>
                      {dialog.confirmText}
                    </Button>
                  ) : null}

                  {dialog.kind === 'confirm' ? (
                    <Button
                      type="button"
                      variant={dialog.danger ? 'danger' : 'primary'}
                      onClick={() => finishConfirm(true)}
                    >
                      {dialog.confirmText}
                    </Button>
                  ) : null}

                  {dialog.kind === 'prompt' ? (
                    <Button type="button" onClick={() => finishPrompt(promptValue)}>
                      {dialog.confirmText}
                    </Button>
                  ) : null}
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog DialogProvider ichida ishlatiladi')
  return ctx
}
