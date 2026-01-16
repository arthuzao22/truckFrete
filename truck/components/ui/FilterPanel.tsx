"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, X, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterConfig {
  id: string
  label: string
  type: "select" | "checkbox" | "dateRange" | "range"
  options?: FilterOption[]
  min?: number
  max?: number
  defaultValue?: any
}

interface FilterPanelProps {
  filters: FilterConfig[]
  onApply: (filters: Record<string, any>) => void
  onClear: () => void
  className?: string
}

export function FilterPanel({ filters, onApply, onClear, className = "" }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }

  const handleApply = () => {
    onApply(activeFilters)
    setIsOpen(false)
  }

  const handleClear = () => {
    setActiveFilters({})
    onClear()
    setIsOpen(false)
  }

  const activeFiltersCount = Object.values(activeFilters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === "object" && v !== null) return Object.keys(v).length > 0
    return v !== undefined && v !== null && v !== ""
  }).length

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Button */}
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>

                  {/* Select */}
                  {filter.type === "select" && (
                    <select
                      value={activeFilters[filter.id] || ""}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Checkboxes */}
                  {filter.type === "checkbox" && (
                    <div className="space-y-2">
                      {filter.options?.map((option) => {
                        const checked =
                          activeFilters[filter.id]?.includes(option.value) || false
                        return (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const current = activeFilters[filter.id] || []
                                const updated = e.target.checked
                                  ? [...current, option.value]
                                  : current.filter((v: any) => v !== option.value)
                                handleFilterChange(filter.id, updated)
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {/* Date Range */}
                  {filter.type === "dateRange" && (
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={activeFilters[filter.id]?.start || ""}
                        onChange={(e) =>
                          handleFilterChange(filter.id, {
                            ...activeFilters[filter.id],
                            start: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Data inicial"
                      />
                      <input
                        type="date"
                        value={activeFilters[filter.id]?.end || ""}
                        onChange={(e) =>
                          handleFilterChange(filter.id, {
                            ...activeFilters[filter.id],
                            end: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Data final"
                      />
                    </div>
                  )}

                  {/* Range Slider */}
                  {filter.type === "range" && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={filter.min || 0}
                        max={filter.max || 100}
                        value={activeFilters[filter.id] || filter.min || 0}
                        onChange={(e) => handleFilterChange(filter.id, Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{filter.min || 0}</span>
                        <span className="font-medium text-gray-900">
                          {activeFilters[filter.id] || filter.min || 0}
                        </span>
                        <span>{filter.max || 100}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button variant="secondary" onClick={handleClear} className="flex-1">
                Limpar
              </Button>
              <Button variant="primary" onClick={handleApply} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
