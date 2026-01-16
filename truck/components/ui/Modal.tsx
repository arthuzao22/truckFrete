// FreteConnect 2.0 - Modal Component
"use client"

import { ReactNode, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[95vh]",
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="fixed inset-0 z-[1300] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative w-full rounded-2xl border border-gray-700 bg-gray-800/95 backdrop-blur-xl shadow-2xl",
                "flex flex-col max-h-[90vh]",
                sizes[size]
              )}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between border-b border-gray-700 p-6">
                  <div className="flex-1">
                    {title && (
                      <h2 className="text-2xl font-bold text-white">{title}</h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-gray-400">{description}</p>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="ml-4 flex-shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Modal Footer Component
export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-gray-700 p-6",
        className
      )}
    >
      {children}
    </div>
  )
}

// Confirm Modal Component
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "primary"
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-gray-300">{message}</p>
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            fullWidth
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            fullWidth
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
