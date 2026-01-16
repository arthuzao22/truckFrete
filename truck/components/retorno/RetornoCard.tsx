"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

interface RetornoCardProps {
  anuncio: {
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
    implemento: {
      tipoAplicacao: string
      placa: string
      capacidadePeso: number
    }
  }
  onVerInteressados: (id: string) => void
  onPausar: (id: string) => void
  onReativar: (id: string) => void
  onFechar: (id: string) => void
  onEditar?: (id: string) => void
}

const IMPLEMENTO_ICONS: Record<string, string> = {
  GRANELEIRA: "🌾",
  BAU: "📦",
  SIDER: "❄️",
  TANQUE: "🛢️",
  PRANCHA: "🪵",
  PORTA_CONTAINER: "🔩",
  FLORESTAL: "🪵",
  BASCULANTE: "🪨",
  BOBINEIRA: "📐",
  CANAVIEIRA: "🌿",
  LINHA_EIXOS: "🔗"
}

const IMPLEMENTO_NAMES: Record<string, string> = {
  GRANELEIRA: "Graneleira",
  BAU: "Baú Seco",
  SIDER: "Baú Refrigerado",
  TANQUE: "Tanque",
  PRANCHA: "Prancha",
  PORTA_CONTAINER: "Porta-Container",
  FLORESTAL: "Florestal",
  BASCULANTE: "Basculante",
  BOBINEIRA: "Bobineira",
  CANAVIEIRA: "Canavieira",
  LINHA_EIXOS: "Linha de Eixos"
}

const STATUS_CONFIG = {
  ATIVO: { color: "bg-green-100 text-green-800", icon: "✅" },
  PAUSADO: { color: "bg-yellow-100 text-yellow-800", icon: "⏸️" },
  EXPIRADO: { color: "bg-gray-100 text-gray-800", icon: "⏰" },
  FECHADO: { color: "bg-blue-100 text-blue-800", icon: "🔒" },
  CANCELADO: { color: "bg-red-100 text-red-800", icon: "❌" }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

export function RetornoCard({ anuncio, onVerInteressados, onPausar, onReativar, onFechar }: RetornoCardProps) {
  const [loading, setLoading] = useState(false)

  const icone = IMPLEMENTO_ICONS[anuncio.implemento.tipoAplicacao] || "🚛"
  const nomeImplemento = IMPLEMENTO_NAMES[anuncio.implemento.tipoAplicacao] || anuncio.implemento.tipoAplicacao
  const statusConfig = STATUS_CONFIG[anuncio.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ATIVO
  const interessesCount = anuncio._count?.interesses || 0
  const temInteressesPendentes = interessesCount > 0

  async function handleAction(action: () => void) {
    setLoading(true)
    try {
      await action()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* Header com Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{icone}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {anuncio.origemCidade}/{anuncio.origemUf} → {anuncio.destinoCidade}/{anuncio.destinoUf}
            </h3>
            <p className="text-sm text-gray-600">{nomeImplemento}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
            {statusConfig.icon} {anuncio.status}
          </span>
          {temInteressesPendentes && (
            <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
              🔔 {interessesCount} {interessesCount === 1 ? 'interessado' : 'interessados'}
            </span>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">📅 Data de Saída:</span>
          <span className="font-medium">
            {formatDate(anuncio.dataSaida)}
            {anuncio.flexibilidadeDias > 0 && (
              <span className="text-gray-500 text-xs ml-1">
                (±{anuncio.flexibilidadeDias}d)
              </span>
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">🚛 Veículo:</span>
          <span className="font-medium">{anuncio.veiculo.marca} {anuncio.veiculo.modelo}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">📦 Implemento:</span>
          <span className="font-medium">{anuncio.implemento.placa}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">⚖️ Capacidade:</span>
          <span className="font-medium">
            {anuncio.capacidadeDisponivel === "TOTAL" 
              ? `${(anuncio.implemento.capacidadePeso / 1000).toFixed(1)}t (Total)`
              : `${anuncio.pesoDisponivel ? (anuncio.pesoDisponivel / 1000).toFixed(1) : '?'}t (Parcial)`
            }
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">👁️ Visualizações:</span>
          <span className="font-medium">{anuncio.visualizacoes}</span>
        </div>
      </div>

      {/* Observações */}
      {anuncio.observacoes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 line-clamp-2">{anuncio.observacoes}</p>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        {anuncio.status === "ATIVO" && (
          <>
            <Button
              onClick={() => handleAction(() => onVerInteressados(anuncio.id))}
              disabled={loading}
              className="flex-1 min-w-[120px] relative"
            >
              👥 Interessados
              {temInteressesPendentes && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {interessesCount}
                </span>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleAction(() => onPausar(anuncio.id))}
              disabled={loading}
              className="flex-1 min-w-[120px]"
            >
              ⏸️ Pausar
            </Button>
          </>
        )}

        {anuncio.status === "PAUSADO" && (
          <>
            <Button
              onClick={() => handleAction(() => onVerInteressados(anuncio.id))}
              disabled={loading}
              className="flex-1 min-w-[120px]"
            >
              👥 Interessados ({interessesCount})
            </Button>
            <Button
              onClick={() => handleAction(() => onReativar(anuncio.id))}
              disabled={loading}
              className="flex-1 min-w-[120px]"
            >
              ▶️ Reativar
            </Button>
          </>
        )}

        {(anuncio.status === "ATIVO" || anuncio.status === "PAUSADO") && (
          <Button
            variant="danger"
            onClick={() => handleAction(() => onFechar(anuncio.id))}
            disabled={loading}
            className="flex-1 min-w-[120px]"
          >
            🔒 Fechar
          </Button>
        )}

        {(anuncio.status === "FECHADO" || anuncio.status === "EXPIRADO" || anuncio.status === "CANCELADO") && (
          <Button
            variant="secondary"
            onClick={() => handleAction(() => onVerInteressados(anuncio.id))}
            disabled={loading}
            className="flex-1"
          >
            👥 Ver Interessados ({interessesCount})
          </Button>
        )}
      </div>
    </Card>
  )
}
