// FreteConnect 2.0 - Empty State Component
"use client"

import { LucideIcon } from "lucide-react"
import { Button } from "./Button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-800/50 border border-gray-700">
        <Icon className="h-10 w-10 text-gray-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-md text-gray-400">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
