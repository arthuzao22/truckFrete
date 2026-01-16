"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

interface Implemento {
  id: string
  tipoEstrutura: string
  tipoAplicacao: string
  qtdeEixos: number
  placa: string
  capacidadePeso: number
  capacidadeVolume?: number
}

interface Veiculo {
  id: string
  tipo: string
  marca: string
  modelo: string
  anoFabricacao: number
  cor: string
  placa: string
  configuracaoTracao?: string
  implementos: Implemento[]
}

interface VeiculoCardProps {
  veiculo: Veiculo
  onAddImplemento: () => void
  onRefresh: () => void
}

const TIPO_LABELS: Record<string, string> = {
  CAVALO_MECANICO: "Cavalo Mecânico",
  UTILITARIO: "Utilitário"
}

const APLICACAO_LABELS: Record<string, string> = {
  BAU: "Baú",
  SIDER: "Sider",
  GRANELEIRA: "Graneleira",
  BASCULANTE: "Basculante",
  TANQUE: "Tanque",
  PRANCHA: "Prancha",
  PORTA_CONTAINER: "Porta Container",
  FLORESTAL: "Florestal",
  CANAVIEIRA: "Canavieira",
  BOBINEIRA: "Bobineira",
  LINHA_EIXOS: "Linha de Eixos"
}

const ESTRUTURA_LABELS: Record<string, string> = {
  SEMIRREBOQUE_SIMPLES: "Semirreboque Simples",
  BITREM: "Bitrem",
  RODOTREM: "Rodotrem",
  REBOQUE_SEMIRREBOQUE: "Reboque + Semirreboque",
  PRANCHA: "Prancha",
  EXTENSIVA: "Extensiva"
}

export function VeiculoCard({ veiculo, onAddImplemento, onRefresh }: VeiculoCardProps) {
  const [showImplementos, setShowImplementos] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDeleteImplemento(implementoId: string) {
    if (!confirm("Tem certeza que deseja excluir este implemento?")) {
      return
    }

    try {
      setDeletingId(implementoId)
      const res = await fetch(`/api/implementos/${implementoId}`, {
        method: "DELETE"
      })

      if (!res.ok) {
        throw new Error("Erro ao excluir implemento")
      }

      onRefresh()
    } catch (err) {
      alert("Erro ao excluir implemento. Tente novamente.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6 0a1 1 0 001 1h2a1 1 0 001-1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {TIPO_LABELS[veiculo.tipo] || veiculo.tipo}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <p className="text-sm text-gray-500">Ano {veiculo.anoFabricacao}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-700 w-24">Placa:</span>
          <span className="text-gray-900 font-mono">{veiculo.placa}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-700 w-24">Cor:</span>
          <span className="text-gray-900">{veiculo.cor}</span>
        </div>
        {veiculo.configuracaoTracao && (
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-700 w-24">Tração:</span>
            <span className="text-gray-900">{veiculo.configuracaoTracao}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Implementos ({veiculo.implementos.length})
            </span>
          </div>
          <button
            onClick={() => setShowImplementos(!showImplementos)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showImplementos ? "Ocultar" : "Ver"}
          </button>
        </div>

        {showImplementos && (
          <div className="space-y-3 mb-3">
            {veiculo.implementos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded">
                Nenhum implemento cadastrado
              </p>
            ) : (
              veiculo.implementos.map((implemento) => (
                <div 
                  key={implemento.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {APLICACAO_LABELS[implemento.tipoAplicacao] || implemento.tipoAplicacao}
                      </p>
                      <p className="text-xs text-gray-600">
                        {ESTRUTURA_LABELS[implemento.tipoEstrutura] || implemento.tipoEstrutura}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteImplemento(implemento.id)}
                      disabled={deletingId === implemento.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      title="Excluir implemento"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Placa:</span>
                      <span className="ml-1 font-mono font-medium text-gray-900">
                        {implemento.placa}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Eixos:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {implemento.qtdeEixos}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Peso:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {(implemento.capacidadePeso / 1000).toFixed(1)}t
                      </span>
                    </div>
                    {implemento.capacidadeVolume && (
                      <div>
                        <span className="text-gray-600">Volume:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {implemento.capacidadeVolume.toFixed(1)}m³
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <Button
          onClick={onAddImplemento}
          variant="secondary"
          className="w-full text-sm"
        >
          <svg className="w-4 h-4 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Implemento
        </Button>
      </div>
    </Card>
  )
}
