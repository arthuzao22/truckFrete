"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  position?: "left" | "right" | "top" | "bottom"
  size?: "sm" | "md" | "lg" | "full"
  children: ReactNode
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-full",
}

const positionAnimations = {
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  top: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
}

const positionStyles = {
  left: "left-0 top-0 h-full",
  right: "right-0 top-0 h-full",
  top: "top-0 left-0 w-full",
  bottom: "bottom-0 left-0 w-full",
}

export function Drawer({
  isOpen,
  onClose,
  title,
  position = "right",
  size = "md",
  children,
}: DrawerProps) {
  const isHorizontal = position === "left" || position === "right"

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={positionAnimations[position].initial}
            animate={positionAnimations[position].animate}
            exit={positionAnimations[position].exit}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`
              fixed ${positionStyles[position]} 
              ${isHorizontal ? sizeMap[size] : ""}
              ${isHorizontal ? "w-full" : "h-auto"}
              bg-white shadow-2xl z-50
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto h-full pb-20">
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
