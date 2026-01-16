// FreteConnect 2.0 - Loading Component
"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  text?: string
  fullScreen?: boolean
  size?: "sm" | "md" | "lg"
}

export function Loading({ text, fullScreen = false, size = "md" }: LoadingProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizes[size]} text-blue-500`} />
      </motion.div>
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  )
}

// Skeleton Loader
export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-800/50 ${className}`}
      {...props}
    />
  )
}
