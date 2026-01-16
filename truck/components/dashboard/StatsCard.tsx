// FreteConnect - StatsCard Component (Dark Mode)
"use client"

import {
  Truck,
  Package,
  Clock,
  TrendingUp,
  Plus,
  Search,
  MessageCircle,
  Users,
  DollarSign,
  MapPin,
  Star,
  Bell,
  FileText,
  Settings,
  type LucideIcon
} from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

// Mapeamento de nomes de ícones para componentes
const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  package: Package,
  clock: Clock,
  "trending-up": TrendingUp,
  plus: Plus,
  search: Search,
  "message-circle": MessageCircle,
  users: Users,
  "dollar-sign": DollarSign,
  "map-pin": MapPin,
  star: Star,
  bell: Bell,
  "file-text": FileText,
  settings: Settings,
}

interface StatsCardProps {
  title: string
  value: string | number
  iconName: string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "blue" | "green" | "purple" | "orange" | "red"
}

const colorVariants = {
  blue: {
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    icon: "text-blue-400",
  },
  green: {
    bg: "bg-green-500/15",
    border: "border-green-500/30",
    icon: "text-green-400",
  },
  purple: {
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
    icon: "text-purple-400",
  },
  orange: {
    bg: "bg-orange-500/15",
    border: "border-orange-500/30",
    icon: "text-orange-400",
  },
  red: {
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    icon: "text-red-400",
  },
}

export function StatsCard({
  title,
  value,
  iconName,
  trend,
  color = "blue",
}: StatsCardProps) {
  const Icon = iconMap[iconName] || Package
  const colors = colorVariants[color]

  return (
    <Card variant="glass" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs. mês anterior</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl border",
          colors.bg,
          colors.border
        )}>
          <Icon className={cn("h-6 w-6", colors.icon)} />
        </div>
      </div>
    </Card>
  )
}
