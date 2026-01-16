// FreteConnect - Hook para Confirm Dialog
"use client"

import { useState, useCallback } from "react"

interface UseConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "warning" | "danger"
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<UseConfirmOptions>({
    title: "",
    message: "",
  })
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: UseConfirmOptions): Promise<boolean> => {
    setOptions(opts)
    setIsOpen(true)

    return new Promise((resolve) => {
      setResolvePromise(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true)
    }
    setIsOpen(false)
    setResolvePromise(null)
  }, [resolvePromise])

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false)
    }
    setIsOpen(false)
    setResolvePromise(null)
  }, [resolvePromise])

  return {
    confirm,
    isOpen,
    options,
    handleConfirm,
    handleCancel,
  }
}
