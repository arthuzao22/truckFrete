"use client"

import { useState, useEffect } from "react"
import { RotaCard } from "./RotaCard"
import { RotasFilters } from "./RotasFilters"

interface Rota {
  id: string
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  dataSaida: string
  dataChegadaEstimada?: string
  flexibilidadeDias: number
  capacidadeDisponivel: string
  pesoDisponivel?: number
  volumeDisponivel?: number
  tiposCargaAceita: string[]
  precoSugerido?: number
  precoNegociavel: boolean
  observacoes?: string
  veiculo: {
    marca: string
    modelo: string
  }
  implemento: {
    tipo: string
    estrutura: string
    capacidadePeso: number
    capacidadeVolume?: number
    comprimento?: number
    largura?: number
    altura?: number
    eixos: number
  }
  motorista: {
    primeiroNome: string
  }
  visualizacoes: number
  createdAt: string
}

interface Filters {
  origemUf?: string
  origemCidade?: string
  destinoUf?: string
  destinoCidade?: string
  tipoImplemento?: string
  dataSaidaMin?: string
  dataSaidaMax?: string
}

export function RotasPublicList() {
  const [rotas, setRotas] = useState<Rota[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchRotas()
  }, [filters, page])

  async function fetchRotas() {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12"
      })

      // Adicionar filtros aos params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/public/rotas?${params}`)
      
      if (!response.ok) {
        throw new Error("Erro ao buscar rotas")
      }

      const data = await response.json()
      setRotas(data.data)
      setTotalPages(data.pagination.pages)
      setTotal(data.pagination.total)
    } catch (err) {
      console.error("Erro ao buscar rotas:", err)
      setError("Erro ao carregar rotas. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(newFilters: Filters) {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchRotas}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <RotasFilters onFilterChange={handleFilterChange} />

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-700">
          📋 <strong>{total}</strong> rotas disponíveis
        </p>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          defaultValue="dataSaida"
        >
          <option value="dataSaida">Mais Recentes</option>
          <option value="preco">Menor Preço</option>
          <option value="visualizacoes">Mais Visualizadas</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando rotas...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && rotas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">🚛</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma rota encontrada
          </h3>
          <p className="text-gray-600 mb-6">
            Tente ajustar os filtros ou volte mais tarde
          </p>
        </div>
      )}

      {/* Routes Grid */}
      {!loading && rotas.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rotas.map((rota) => (
              <RotaCard key={rota.id} rota={rota} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ← Anterior
              </button>
              <span className="px-4 py-2">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
