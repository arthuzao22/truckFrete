"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface RatingStarsProps {
  value?: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
}

export function RatingStars({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
  className = "",
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState(0)

  const displayValue = hoverValue || value
  const isInteractive = !readonly && !!onChange

  const handleClick = (rating: number) => {
    if (isInteractive && onChange) {
      onChange(rating)
    }
  }

  const handleMouseEnter = (rating: number) => {
    if (isInteractive) {
      setHoverValue(rating)
    }
  }

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverValue(0)
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((rating) => {
        const isFilled = rating <= displayValue
        const isHalfFilled = rating - 0.5 <= displayValue && rating > displayValue

        return (
          <motion.button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={!isInteractive}
            whileHover={isInteractive ? { scale: 1.2 } : undefined}
            whileTap={isInteractive ? { scale: 0.9 } : undefined}
            className={`
              relative
              ${isInteractive ? "cursor-pointer" : "cursor-default"}
              ${!isInteractive && "pointer-events-none"}
              transition-colors
            `}
            aria-label={`${rating} estrela${rating > 1 ? "s" : ""}`}
          >
            {/* Background star */}
            <Star
              className={`
                ${sizeMap[size]}
                transition-colors
                ${isFilled || isHalfFilled ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
              `}
            />

            {/* Half star overlay */}
            {isHalfFilled && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className={`${sizeMap[size]} fill-yellow-400 text-yellow-400`} />
              </div>
            )}
          </motion.button>
        )
      })}

      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  )
}
