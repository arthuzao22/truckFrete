"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { RetornoFormModal } from "./RetornoFormModal"
import { RetornoCard } from "./RetornoCard"
import { InteressadosList } from "./InteressadosList"

interface Implemento {
  id: string
  tipoEstrutura: string
  tipoAplicacao: string
  placa: string
  capacidadePeso: number
}

interface Anuncio {
  id: string
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  dataSaida: string
  flexibilidadeDias: number
  capacidadeDisponivel: string
  pesoDisponivel?: number
  status: string
  visualizacoes: number
  observacoes?: string
  _count?: {
    interesses: number
  }
  veiculo: {
    marca: string
    modelo: string
    placa: string
  }
  implemento: Implemento
}

export function RetornoList() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [anuncioSelecionado, setAnuncioSelecionado] = useState<string | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS")

  async function loadAnuncios() {
    try {
      const res = await fetch("/api/retorno")
      const data = await res.json()
      setAnuncios(data.data || [])
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnuncios()
  }, [])

  async function handleAtualizarStatus(id: string, novoStatus: string) {
    try {
      const res = await fetch(`/api/retorno/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus })
      })

      if (res.ok) {
        loadAnuncios()
      } else {
        const data = await res.json()
        alert(data.error || "Erro ao atualizar status")
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Erro ao atualizar status")
    }
  }

  function handlePausar(id: string) {
    if (confirm("Deseja pausar este anúncio? Ele não aparecerá nas buscas.")) {
      handleAtualizarStatus(id, "PAUSADO")
    }
  }

  function handleReativar(id: string) {
    if (confirm("Deseja reativar este anúncio?")) {
      handleAtualizarStatus(id, "ATIVO")
    }
  }

  function handleFechar(id: string) {
    if (confirm("Deseja fechar este anúncio? Esta ação não pode ser desfeita.")) {
      handleAtualizarStatus(id, "FECHADO")
    }
  }

  function handleVerInteressados(id: string) {
    setAnuncioSelecionado(id)
  }

  const anunciosFiltrados = filtroStatus === "TODOS"
    ? anuncios
    : anuncios.filter(a => a.status === filtroStatus)

  const contadores = {
    TODOS: anuncios.length,
    ATIVO: anuncios.filter(a => a.status === "ATIVO").length,
    PAUSADO: anuncios.filter(a => a.status === "PAUSADO").length,
    FECHADO: anuncios.filter(a => a.status === "FECHADO").length,
    EXPIRADO: anuncios.filter(a => a.status === "EXPIRADO").length,
    CANCELADO: anuncios.filter(a => a.status === "CANCELADO").length
  }

  const totalInteressesPendentes = anuncios.reduce((total, anuncio) => {
    return total + (anuncio._count?.interesses || 0)
  }, 0)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Carregando seus anúncios...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header com Botão de Criar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Minhas Rotas de Retorno</h2>
          {totalInteressesPendentes > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              🔔 Você tem <span className="font-bold text-red-600">{totalInteressesPendentes}</span> {totalInteressesPendentes === 1 ? 'interessado' : 'interessados'} em suas rotas
            </p>
          )}
        </div>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          ➕ Anunciar Nova Rota
        </Button>
      </div>

      {/* Filtros por Status */}
      {anuncios.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(contadores).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === "TODOS" ? "Todos" : status} ({count})
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {anuncios.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚛</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma rota anunciada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece anunciando suas rotas de retorno para conectar-se com contratantes
            </p>
            <Button onClick={() => setShowModal(true)}>
              ➕ Criar Primeiro Anúncio
            </Button>
          </div>
        </Card>
      ) : anunciosFiltrados.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum anúncio com status <strong>{filtroStatus}</strong>
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {anunciosFiltrados.map(anuncio => (
            <RetornoCard
              key={anuncio.id}
              anuncio={anuncio}
              onVerInteressados={handleVerInteressados}
              onPausar={handlePausar}
              onReativar={handleReativar}
              onFechar={handleFechar}
            />
          ))}
        </div>
      )}

      {/* Modal de Criar Anúncio */}
      {showModal && (
        <RetornoFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            loadAnuncios()
          }}
        />
      )}

      {/* Modal de Interessados */}
      {anuncioSelecionado && (
        <InteressadosList
          anuncioId={anuncioSelecionado}
          onClose={() => {
            setAnuncioSelecionado(null)
            loadAnuncios() // Recarregar para atualizar contadores
          }}
        />
      )}
    </div>
  )
}
