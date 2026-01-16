// FreteConnect - Input Component (Dark Mode)
import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          "block w-full rounded-lg px-4 py-2.5",
          "bg-white/5 border border-white/10",
          "text-white placeholder-gray-500",
          "focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
          "focus:bg-white/10",
          "transition-all duration-200",
          error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
