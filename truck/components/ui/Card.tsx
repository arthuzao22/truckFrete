// FreteConnect 2.0 - Card Component
"use client"

import { forwardRef, HTMLAttributes } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "premium" | "flat"
  hover?: boolean
  padding?: "none" | "sm" | "md" | "lg"
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hover = false,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        "bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm",
      glass:
        "bg-white/5 border border-white/10 backdrop-blur-xl",
      premium:
        "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 backdrop-blur-sm shadow-xl shadow-black/20",
      flat:
        "bg-gray-800 border border-gray-700",
    }

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4 md:p-6",
      lg: "p-6 md:p-8",
    }

    const Component = motion.div

    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300",
          variants[variant],
          paddings[padding],
          hover && "hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30",
          className
        )}
        {...(hover && {
          whileHover: { scale: 1.02, y: -4 },
          transition: { type: "spring", stiffness: 300, damping: 20 },
        })}
        {...(props as any)}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = "Card"

export { Card }

