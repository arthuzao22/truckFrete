"use client"

import { useState } from "react"

interface Filters {
  origemUf?: string
  origemCidade?: string
  destinoUf?: string
  destinoCidade?: string
  tipoImplemento?: string
  dataSaidaMin?: string
  dataSaidaMax?: string
}

interface RotasFiltersProps {
  onFilterChange: (filters: Filters) => void
}

const UFS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

const TIPOS_IMPLEMENTO = [
  { value: "", label: "Todos" },
  { value: "GRANELEIRA", label: "🌾 Graneleira" },
  { value: "BAU", label: "📦 Baú Seco" },
  { value: "SIDER", label: "❄️ Baú Refrigerado" },
  { value: "TANQUE", label: "🛢️ Tanque" },
  { value: "PRANCHA", label: "🪵 Prancha" },
  { value: "PORTA_CONTAINER", label: "🔩 Porta-Container" },
  { value: "FLORESTAL", label: "🪵 Florestal" },
  { value: "BASCULANTE", label: "🪨 Basculante" },
  { value: "BOBINEIRA", label: "📐 Bobineira" }
]

export function RotasFilters({ onFilterChange }: RotasFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<Filters>({})

  function handleChange(key: keyof Filters, value: string) {
    const newFilters = {
      ...filters,
      [key]: value || undefined
    }
    setFilters(newFilters)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onFilterChange(filters)
  }

  function handleClear() {
    setFilters({})
    onFilterChange({})
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Origem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origem UF
            </label>
            <select
              value={filters.origemUf || ""}
              onChange={(e) => handleChange("origemUf", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {UFS_BRASIL.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          {/* Destino */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destino UF
            </label>
            <select
              value={filters.destinoUf || ""}
              onChange={(e) => handleChange("destinoUf", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {UFS_BRASIL.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          {/* Tipo Implemento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Implemento
            </label>
            <select
              value={filters.tipoImplemento || ""}
              onChange={(e) => handleChange("tipoImplemento", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {TIPOS_IMPLEMENTO.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 Buscar
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAdvanced ? "− Menos filtros" : "+ Mais filtros"}
          </button>
          {Object.keys(filters).some(key => filters[key as keyof Filters]) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade de Origem
              </label>
              <input
                type="text"
                value={filters.origemCidade || ""}
                onChange={(e) => handleChange("origemCidade", e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade de Destino
              </label>
              <input
                type="text"
                value={filters.destinoCidade || ""}
                onChange={(e) => handleChange("destinoCidade", e.target.value)}
                placeholder="Ex: Rio de Janeiro"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Mínima
              </label>
              <input
                type="date"
                value={filters.dataSaidaMin || ""}
                onChange={(e) => handleChange("dataSaidaMin", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
