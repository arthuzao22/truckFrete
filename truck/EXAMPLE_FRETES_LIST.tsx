// FreteConnect - Exemplo de Listagem de Fretes com Filtros e DataTable
// Este exemplo mostra como integrar FilterPanel + DataTable + Paginação

"use client"

import { useState, useEffect } from "react"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { FilterPanel, type FilterConfig } from "@/components/ui/FilterPanel"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface Frete {
  id: string
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  tipoCarga: string
  peso: number
  valorProposto: number
  status: string
  prazoColeta: string
}

export default function FretesListPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fretes, setFretes] = useState<Frete[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Configuração dos filtros
  const filterConfigs: FilterConfig[] = [
    {
      id: "status",
      label: "Status",
      type: "checkbox",
      options: [
        { label: "Aberto", value: "ABERTO" },
        { label: "Negociando", value: "NEGOCIANDO" },
        { label: "Aceito", value: "ACEITO" },
        { label: "Em Transporte", value: "EM_TRANSPORTE" },
        { label: "Entregue", value: "ENTREGUE" },
      ],
    },
    {
      id: "tipoCarga",
      label: "Tipo de Carga",
      type: "select",
      options: [
        { label: "Geral", value: "geral" },
        { label: "Granel", value: "granel" },
        { label: "Refrigerada", value: "refrigerada" },
        { label: "Perigosa", value: "perigosa" },
      ],
    },
    {
      id: "prazoColeta",
      label: "Prazo de Coleta",
      type: "dateRange",
    },
    {
      id: "valorMinimo",
      label: "Valor Mínimo (R$)",
      type: "range",
      min: 0,
      max: 50000,
    },
  ]

  // Configuração das colunas
  const columns: Column<Frete>[] = [
    {
      key: "origem",
      label: "Origem",
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.origemCidade}</p>
          <p className="text-sm text-gray-500">{row.origemUf}</p>
        </div>
      ),
    },
    {
      key: "destino",
      label: "Destino",
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.destinoCidade}</p>
          <p className="text-sm text-gray-500">{row.destinoUf}</p>
        </div>
      ),
    },
    {
      key: "tipoCarga",
      label: "Carga",
      sortable: true,
    },
    {
      key: "peso",
      label: "Peso",
      sortable: true,
      render: (value) => `${(value / 1000).toFixed(1)}t`,
    },
    {
      key: "valorProposto",
      label: "Valor",
      sortable: true,
      render: (value) =>
        value ? `R$ ${value.toLocaleString("pt-BR")}` : "A combinar",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value) => {
        const variants: Record<string, "success" | "warning" | "info" | "danger"> = {
          ABERTO: "info",
          NEGOCIANDO: "warning",
          ACEITO: "success",
          EM_TRANSPORTE: "info",
          ENTREGUE: "success",
        }
        return <Badge variant={variants[value]}>{value.replace("_", " ")}</Badge>
      },
    },
    {
      key: "acoes",
      label: "Ações",
      width: "120px",
      render: (_, row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push(`/fretes/${row.id}`)}
        >
          Ver Detalhes
        </Button>
      ),
    },
  ]

  // Buscar fretes
  const fetchFretes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: "10",
        ...filters,
      })

      const res = await fetch(`/api/fretes?${params}`)
      const data = await res.json()

      setFretes(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Erro ao buscar fretes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFretes()
  }, [page, filters])

  // Aplicar filtros
  const handleApplyFilters = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
    setPage(1) // Reset para primeira página
  }

  // Limpar filtros
  const handleClearFilters = () => {
    setFilters({})
    setPage(1)
  }

  // Sorting
  const handleSort = (key: string, direction: "asc" | "desc") => {
    console.log("Sorting:", key, direction)
    // Implementar lógica de sorting na API
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Fretes" },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fretes Disponíveis</h1>
          <p className="text-gray-600">
            {fretes.length} fretes encontrados
          </p>
        </div>

        <div className="flex gap-3">
          <FilterPanel
            filters={filterConfigs}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />

          <Button variant="primary" onClick={() => router.push("/fretes/novo")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Frete
          </Button>
        </div>
      </div>

      {/* Filtros Ativos */}
      {Object.keys(filters).length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>{Object.keys(filters).length}</strong> filtro(s) ativo(s)
          </p>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={fretes}
        loading={loading}
        emptyMessage="Nenhum frete encontrado com os filtros aplicados"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onSort={handleSort}
      />
    </div>
  )
}
