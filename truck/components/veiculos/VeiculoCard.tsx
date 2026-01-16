"use client"

import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Plus, Trash2, ChevronDown, ChevronUp, Truck } from "lucide-react"

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
    } catch {
      alert("Erro ao excluir implemento. Tente novamente.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card variant="glass" hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-medium text-blue-400 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">
              {TIPO_LABELS[veiculo.tipo] || veiculo.tipo}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {veiculo.marca} {veiculo.modelo}
          </h3>
          <p className="text-sm text-gray-400">Ano {veiculo.anoFabricacao}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-400 w-24">Placa:</span>
          <span className="text-white font-mono">{veiculo.placa}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-400 w-24">Cor:</span>
          <span className="text-white">{veiculo.cor}</span>
        </div>
        {veiculo.configuracaoTracao && (
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-400 w-24">Tração:</span>
            <span className="text-white">{veiculo.configuracaoTracao}</span>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">
              Implementos ({veiculo.implementos.length})
            </span>
          </div>
          <button
            onClick={() => setShowImplementos(!showImplementos)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            {showImplementos ? (
              <>Ocultar <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Ver <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        </div>

        {showImplementos && (
          <div className="space-y-3 mb-3">
            {veiculo.implementos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4 bg-white/5 rounded-lg border border-white/10">
                Nenhum implemento cadastrado
              </p>
            ) : (
              veiculo.implementos.map((implemento) => (
                <div
                  key={implemento.id}
                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {APLICACAO_LABELS[implemento.tipoAplicacao] || implemento.tipoAplicacao}
                      </p>
                      <p className="text-xs text-gray-400">
                        {ESTRUTURA_LABELS[implemento.tipoEstrutura] || implemento.tipoEstrutura}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteImplemento(implemento.id)}
                      disabled={deletingId === implemento.id}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                      title="Excluir implemento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Placa:</span>
                      <span className="ml-1 font-mono font-medium text-white">
                        {implemento.placa}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Eixos:</span>
                      <span className="ml-1 font-medium text-white">
                        {implemento.qtdeEixos}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Peso:</span>
                      <span className="ml-1 font-medium text-white">
                        {(implemento.capacidadePeso / 1000).toFixed(1)}t
                      </span>
                    </div>
                    {implemento.capacidadeVolume && (
                      <div>
                        <span className="text-gray-500">Volume:</span>
                        <span className="ml-1 font-medium text-white">
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
          fullWidth
          size="sm"
          icon={<Plus className="h-4 w-4" />}
        >
          Adicionar Implemento
        </Button>
      </div>
    </Card>
  )
}
