"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface RotaDetailsModalProps {
  rotaId: string
  onClose: () => void
}

interface RotaDetalhes {
  id: string
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  cidadesIntermediarias?: any[]
  dataSaida: string
  dataChegadaEstimada?: string
  flexibilidadeDias: number
  capacidadeDisponivel: string
  pesoDisponivel?: number
  volumeDisponivel?: number
  tiposCargaAceita: string[]
  tiposCargaRecusada: string[]
  precoSugerido?: number
  precoNegociavel: boolean
  observacoes?: string
  veiculo: {
    marca: string
    modelo: string
    ano: number
    tipo: string
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
    placa: string
  }
  motorista: {
    id: string
    primeiroNome: string
  }
  permiteWhatsApp: boolean
  permiteTelefone: boolean
  permiteChat: boolean
  visualizacoes: number
  createdAt: string
}

export function RotaDetailsModal({ rotaId, onClose }: RotaDetailsModalProps) {
  const router = useRouter()
  const [rota, setRota] = useState<RotaDetalhes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    fetchRotaDetails()
  }, [rotaId])

  async function fetchRotaDetails() {
    try {
      setLoading(true)
      const response = await fetch(`/api/public/rotas/${rotaId}`)
      
      if (!response.ok) {
        throw new Error("Erro ao buscar detalhes")
      }

      const data = await response.json()
      setRota(data)
    } catch (err) {
      console.error("Erro ao buscar detalhes:", err)
      setError("Erro ao carregar detalhes. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function handleContact() {
    // Redirect to login if not authenticated with safe URL encoding
    const redirectUrl = `/rotas/${encodeURIComponent(rotaId)}`
    const loginUrl = `/login?${new URLSearchParams({ redirect: redirectUrl }).toString()}`
    router.push(loginUrl)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando detalhes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !rota) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Rota não encontrada"}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Detalhes da Rota</h2>
            <p className="text-blue-100">
              {rota.origemCidade}, {rota.origemUf} → {rota.destinoCidade}, {rota.destinoUf}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vehicle & Implemento Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">🚛 Veículo</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Marca:</span> {rota.veiculo.marca}</p>
                <p><span className="text-gray-600">Modelo:</span> {rota.veiculo.modelo}</p>
                <p><span className="text-gray-600">Ano:</span> {rota.veiculo.ano}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">📦 Implemento</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Tipo:</span> {rota.implemento.tipo}</p>
                <p><span className="text-gray-600">Capacidade:</span> {rota.implemento.capacidadePeso / 1000}t</p>
                {rota.implemento.comprimento && (
                  <p><span className="text-gray-600">Dimensões:</span> {rota.implemento.comprimento}m × {rota.implemento.largura}m × {rota.implemento.altura}m</p>
                )}
                <p><span className="text-gray-600">Eixos:</span> {rota.implemento.eixos}</p>
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-lg mb-4">📍 Detalhes da Rota</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Data de Saída</p>
                <p className="font-medium">{new Date(rota.dataSaida).toLocaleDateString("pt-BR")}</p>
              </div>
              {rota.dataChegadaEstimada && (
                <div>
                  <p className="text-gray-600">Chegada Estimada</p>
                  <p className="font-medium">{new Date(rota.dataChegadaEstimada).toLocaleDateString("pt-BR")}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Flexibilidade</p>
                <p className="font-medium">±{rota.flexibilidadeDias} dias</p>
              </div>
              <div>
                <p className="text-gray-600">Capacidade Disponível</p>
                <p className="font-medium">
                  {rota.capacidadeDisponivel === "TOTAL" ? "100%" : 
                   rota.pesoDisponivel ? `${(rota.pesoDisponivel / 1000).toFixed(1)}t` : "Parcial"}
                </p>
              </div>
            </div>
          </div>

          {/* Cargo Types */}
          {rota.tiposCargaAceita.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-3">✅ Tipos de Carga Aceitos</h3>
              <div className="flex flex-wrap gap-2">
                {rota.tiposCargaAceita.map((tipo, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {tipo}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          {rota.precoSugerido && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-3">💰 Preço Sugerido</h3>
              <p className="text-2xl font-bold text-green-600">
                R$ {rota.precoSugerido.toLocaleString("pt-BR")}
                {rota.precoNegociavel && (
                  <span className="text-sm text-gray-500 ml-2">(negociável)</span>
                )}
              </p>
            </div>
          )}

          {/* Observations */}
          {rota.observacoes && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-3">📝 Observações</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{rota.observacoes}</p>
            </div>
          )}

          {/* Driver Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-lg mb-3">👤 Motorista</h3>
            <p className="text-gray-700">
              {rota.motorista.primeiroNome}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Para ver mais informações e entrar em contato, faça login.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleContact}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            💬 Entrar em Contato
          </button>
        </div>
      </div>
    </div>
  )
}
