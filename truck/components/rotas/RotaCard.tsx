"use client"

import { useState } from "react"
import { RotaDetailsModal } from "./RotaDetailsModal"

interface RotaCardProps {
  rota: {
    id: string
    origemCidade: string
    origemUf: string
    destinoCidade: string
    destinoUf: string
    dataSaida: string
    flexibilidadeDias: number
    capacidadeDisponivel: string
    pesoDisponivel?: number
    tiposCargaAceita: string[]
    precoSugerido?: number
    precoNegociavel: boolean
    veiculo: {
      marca: string
      modelo: string
    }
    implemento: {
      tipo: string
      capacidadePeso: number
      comprimento?: number
      eixos: number
    }
    motorista: {
      primeiroNome: string
    }
    visualizacoes: number
  }
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

export function RotaCard({ rota }: RotaCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const icone = IMPLEMENTO_ICONS[rota.implemento.tipo] || "🚛"
  const nomeImplemento = IMPLEMENTO_NAMES[rota.implemento.tipo] || rota.implemento.tipo

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{icone}</div>
              <div>
                <h3 className="font-bold text-lg">{nomeImplemento}</h3>
                <p className="text-blue-100 text-sm">
                  {rota.implemento.capacidadePeso / 1000}t
                  {rota.implemento.comprimento && ` • ${rota.implemento.comprimento}m`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-100">👁️ {rota.visualizacoes}</div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Route */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">📍</span>
            <span className="font-semibold">
              {rota.origemCidade}, {rota.origemUf}
            </span>
            <span className="text-gray-400">→</span>
            <span className="font-semibold">
              {rota.destinoCidade}, {rota.destinoUf}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>📅</span>
            <span>
              Saída: {formatDate(rota.dataSaida)}
              {rota.flexibilidadeDias > 0 && (
                <span className="text-gray-500 text-xs ml-1">
                  (±{rota.flexibilidadeDias}d)
                </span>
              )}
            </span>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>📦</span>
            <span>
              {rota.capacidadeDisponivel === "TOTAL"
                ? "Capacidade 100% disponível"
                : `${rota.pesoDisponivel ? (rota.pesoDisponivel / 1000).toFixed(1) + "t" : "Parcial"} disponível`
              }
            </span>
          </div>

          {/* Accepted Cargo Types */}
          {rota.tiposCargaAceita.length > 0 && (
            <div className="text-xs">
              <span className="text-gray-600">✅ Aceita: </span>
              <span className="text-gray-700">
                {rota.tiposCargaAceita.slice(0, 3).join(" • ")}
                {rota.tiposCargaAceita.length > 3 && ` +${rota.tiposCargaAceita.length - 3}`}
              </span>
            </div>
          )}

          {/* Price */}
          {rota.precoSugerido && (
            <div className="text-sm">
              <span className="text-gray-600">💰 </span>
              <span className="font-semibold text-green-600">
                R$ {rota.precoSugerido.toLocaleString("pt-BR")}
              </span>
              {rota.precoNegociavel && (
                <span className="text-xs text-gray-500 ml-1">(negociável)</span>
              )}
            </div>
          )}

          {/* Driver */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              👤 Motorista: <span className="font-medium">{rota.motorista.primeiroNome}</span>
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Ver Detalhes
          </button>
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            💬 Contato
          </button>
        </div>
      </div>

      {/* Details Modal */}
      <RotaDetailsModal
        isOpen={showDetails}
        rotaId={rota.id}
        onClose={() => setShowDetails(false)}
      />
    </>
  )
}
