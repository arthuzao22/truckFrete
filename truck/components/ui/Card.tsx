// FreteConnect - Card Component (Dark Mode)
"use client"

import { forwardRef, HTMLAttributes } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated" | "outlined"
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
        "bg-gray-800/50 border border-white/10 backdrop-blur-sm",
      glass:
        "bg-gray-900/60 border border-white/10 backdrop-blur-xl",
      elevated:
        "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/10 backdrop-blur-sm shadow-xl shadow-black/20",
      outlined:
        "bg-transparent border-2 border-white/20",
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
          "rounded-xl transition-all duration-200",
          variants[variant],
          paddings[padding],
          hover && "hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer",
          className
        )}
        {...(hover && {
          whileHover: { scale: 1.02, y: -2 },
          transition: { type: "spring", stiffness: 400, damping: 25 },
        })}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = "Card"

export { Card }
