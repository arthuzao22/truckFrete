"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

interface InteressadosListProps {
  anuncioId: string
  onClose: () => void
}

interface Interesse {
  id: string
  status: string
  descricao: string
  pesoEstimado?: number
  valorProposto?: number
  motivoRecusa?: string
  createdAt: string
  respondidoEm?: string
  contratante: {
    id: string
    nome: string
    telefone: string
    email: string
  }
}

const STATUS_CONFIG = {
  PENDENTE: { color: "bg-yellow-100 text-yellow-800", icon: "⏳", label: "Pendente" },
  VISUALIZADO: { color: "bg-blue-100 text-blue-800", icon: "👁️", label: "Visualizado" },
  EM_NEGOCIACAO: { color: "bg-purple-100 text-purple-800", icon: "💬", label: "Em Negociação" },
  ACEITO: { color: "bg-green-100 text-green-800", icon: "✅", label: "Aceito" },
  RECUSADO: { color: "bg-red-100 text-red-800", icon: "❌", label: "Recusado" },
  CANCELADO: { color: "bg-gray-100 text-gray-800", icon: "🚫", label: "Cancelado" }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export function InteressadosList({ anuncioId, onClose }: InteressadosListProps) {
  const [interesses, setInteresses] = useState<Interesse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>("TODOS")
  const [motivoRecusa, setMotivoRecusa] = useState<Record<string, string>>({})
  const [processando, setProcessando] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadInteresses()
  }, [anuncioId])

  async function loadInteresses() {
    try {
      setLoading(true)
      setError(null)
      
      const url = filtroStatus === "TODOS" 
        ? `/api/anuncios/${anuncioId}/interesses`
        : `/api/anuncios/${anuncioId}/interesses?status=${filtroStatus}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Erro ao carregar interessados")
      }

      const data = await response.json()
      setInteresses(data.data || [])
    } catch (err) {
      console.error("Erro ao carregar interessados:", err)
      setError("Erro ao carregar interessados. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  async function handleAtualizarStatus(interesseId: string, novoStatus: string) {
    try {
      setProcessando({ ...processando, [interesseId]: true })
      
      const body: any = { status: novoStatus }
      
      if (novoStatus === "RECUSADO" && motivoRecusa[interesseId]) {
        body.motivoRecusa = motivoRecusa[interesseId]
      }

      const response = await fetch(`/api/interesses/${interesseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar status")
      }

      // Recarregar lista
      await loadInteresses()
      
      // Limpar motivo de recusa
      if (novoStatus === "RECUSADO") {
        setMotivoRecusa({ ...motivoRecusa, [interesseId]: "" })
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err)
      alert("Erro ao atualizar status. Tente novamente.")
    } finally {
      setProcessando({ ...processando, [interesseId]: false })
    }
  }

  const interessesFiltrados = filtroStatus === "TODOS"
    ? interesses
    : interesses.filter(i => i.status === filtroStatus)

  const contadores = {
    TODOS: interesses.length,
    PENDENTE: interesses.filter(i => i.status === "PENDENTE").length,
    VISUALIZADO: interesses.filter(i => i.status === "VISUALIZADO").length,
    EM_NEGOCIACAO: interesses.filter(i => i.status === "EM_NEGOCIACAO").length,
    ACEITO: interesses.filter(i => i.status === "ACEITO").length,
    RECUSADO: interesses.filter(i => i.status === "RECUSADO").length,
    CANCELADO: interesses.filter(i => i.status === "CANCELADO").length
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">👥 Interessados na Rota</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(contadores).map(([status, count]) => {
            const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
            const isActive = filtroStatus === status
            
            return (
              <button
                key={status}
                onClick={() => {
                  setFiltroStatus(status)
                  loadInteresses()
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {config ? config.icon : "📋"} {status === "TODOS" ? "Todos" : config?.label || status} ({count})
              </button>
            )
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando interessados...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && interessesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-2">
              {filtroStatus === "TODOS" 
                ? "Nenhum interessado ainda" 
                : `Nenhum interessado com status ${STATUS_CONFIG[filtroStatus as keyof typeof STATUS_CONFIG]?.label || filtroStatus}`
              }
            </p>
            <p className="text-gray-500 text-sm">
              Quando contratantes demonstrarem interesse, aparecerão aqui.
            </p>
          </div>
        )}

        {/* Lista de Interesses */}
        {!loading && !error && interessesFiltrados.length > 0 && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {interessesFiltrados.map(interesse => {
              const statusConfig = STATUS_CONFIG[interesse.status as keyof typeof STATUS_CONFIG]
              const isPendente = interesse.status === "PENDENTE"
              const isVisualizado = interesse.status === "VISUALIZADO"
              const isEmNegociacao = interesse.status === "EM_NEGOCIACAO"
              const isAceito = interesse.status === "ACEITO"
              const isRecusado = interesse.status === "RECUSADO"
              const podeResponder = isPendente || isVisualizado || isEmNegociacao

              return (
                <Card key={interesse.id} className="hover:shadow-lg transition-shadow">
                  {/* Header do Card */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {interesse.contratante.nome}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Enviado em: {formatDate(interesse.createdAt)}
                      </p>
                      {interesse.respondidoEm && (
                        <p className="text-sm text-gray-600">
                          Respondido em: {formatDate(interesse.respondidoEm)}
                        </p>
                      )}
                    </div>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">📧 E-mail:</p>
                        <p className="text-sm font-medium">{interesse.contratante.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">📱 Telefone:</p>
                        <p className="text-sm font-medium">{interesse.contratante.telefone}</p>
                      </div>
                    </div>

                    {interesse.pesoEstimado && (
                      <div>
                        <p className="text-sm text-gray-600">⚖️ Peso Estimado:</p>
                        <p className="text-sm font-medium">{(interesse.pesoEstimado / 1000).toFixed(2)}t</p>
                      </div>
                    )}

                    {interesse.valorProposto && (
                      <div>
                        <p className="text-sm text-gray-600">💰 Valor Proposto:</p>
                        <p className="text-sm font-medium text-green-600">
                          R$ {interesse.valorProposto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600 mb-1">💬 Mensagem:</p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">
                        {interesse.descricao || "Sem mensagem"}
                      </p>
                    </div>

                    {isRecusado && interesse.motivoRecusa && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">❌ Motivo da Recusa:</p>
                        <p className="text-sm text-red-700">{interesse.motivoRecusa}</p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  {podeResponder && (
                    <div className="pt-4 border-t space-y-3">
                      {/* Botões de Ação Rápida */}
                      <div className="flex gap-2">
                        {!isEmNegociacao && (
                          <Button
                            onClick={() => handleAtualizarStatus(interesse.id, "EM_NEGOCIACAO")}
                            disabled={processando[interesse.id]}
                            variant="secondary"
                            className="flex-1"
                          >
                            💬 Iniciar Negociação
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => handleAtualizarStatus(interesse.id, "ACEITO")}
                          disabled={processando[interesse.id]}
                          className="flex-1"
                        >
                          ✅ Aceitar
                        </Button>
                      </div>

                      {/* Recusar com Motivo */}
                      <div className="space-y-2">
                        <textarea
                          placeholder="Motivo da recusa (opcional)..."
                          className="input-field w-full"
                          rows={2}
                          value={motivoRecusa[interesse.id] || ""}
                          onChange={(e) => setMotivoRecusa({ ...motivoRecusa, [interesse.id]: e.target.value })}
                        />
                        <Button
                          onClick={() => handleAtualizarStatus(interesse.id, "RECUSADO")}
                          disabled={processando[interesse.id]}
                          variant="danger"
                          className="w-full"
                        >
                          ❌ Recusar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Info para status finais */}
                  {isAceito && (
                    <div className="pt-4 border-t">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">
                          ✅ Você aceitou este interesse. Entre em contato com o contratante para finalizar os detalhes.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
