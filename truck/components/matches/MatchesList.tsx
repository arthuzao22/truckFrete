"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

interface Match {
  score: number
  detalhes: {
    rotaScore: number
    tipoVeiculoScore: number
    capacidadeScore: number
    tempoScore: number
    compativel: boolean
  }
  anuncio: {
    id: string
    origemCidade: string
    origemUf: string
    destinoCidade: string
    destinoUf: string
    dataDisponivel: string
    veiculo: {
      marca: string
      modelo: string
      placa: string
      usuario: {
        nome: string
        telefone: string
      }
      implementos: any[]
    }
  }
}

export function MatchesList() {
  const [fretes, setFretes] = useState<any[]>([])
  const [freteSelected, setFreteSelected] = useState<string>("")
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadFretes() {
      try {
        const res = await fetch("/api/fretes")
        const data = await res.json()
        const fretesAbertos = (data.data || []).filter((f: any) => f.status === "ABERTO")
        setFretes(fretesAbertos)
      } catch (error) {
        console.error("Erro ao carregar fretes:", error)
      }
    }
    loadFretes()
  }, [])

  async function buscarMatches(freteId: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/matches?freteId=${freteId}`)
      const data = await res.json()
      setMatches(data.data || [])
    } catch (error) {
      console.error("Erro ao buscar matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-800"
    if (score >= 50) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div>
      <Card className="mb-6">
        <label className="label">Selecione um Frete</label>
        <select
          className="input-field"
          value={freteSelected}
          onChange={(e) => {
            setFreteSelected(e.target.value)
            if (e.target.value) buscarMatches(e.target.value)
          }}
        >
          <option value="">Escolha um frete...</option>
          {fretes.map(frete => (
            <option key={frete.id} value={frete.id}>
              {frete.origemCidade}/{frete.origemUf} → {frete.destinoCidade}/{frete.destinoUf} - {frete.tipoCarga}
            </option>
          ))}
        </select>
      </Card>

      {loading && (
        <div className="text-center py-12">Buscando matches...</div>
      )}

      {!loading && freteSelected && matches.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum match encontrado para este frete no momento
            </p>
          </div>
        </Card>
      )}

      {matches.length > 0 && (
        <div className="space-y-6">
          {matches.map((match, idx) => (
            <Card key={idx}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {match.anuncio.veiculo.marca} {match.anuncio.veiculo.modelo}
                  </h3>
                  <p className="text-sm text-gray-600">{match.anuncio.veiculo.placa}</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(match.score)}`}>
                    {match.score}%
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${getScoreBadge(match.score)}`}>
                    {match.score >= 70 ? "Excelente" : match.score >= 50 ? "Bom" : "Regular"}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Rota do Retorno</h4>
                  <p className="text-sm">
                    {match.anuncio.origemCidade}/{match.anuncio.origemUf} → {match.anuncio.destinoCidade}/{match.anuncio.destinoUf}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Disponível: {new Date(match.anuncio.dataDisponivel).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Motorista</h4>
                  <p className="text-sm">{match.anuncio.veiculo.usuario.nome}</p>
                  <p className="text-xs text-gray-500">{match.anuncio.veiculo.usuario.telefone}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Análise de Compatibilidade</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rota:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(match.detalhes.rotaScore / 40) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-12 text-right">{match.detalhes.rotaScore}/40</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tipo de Veículo:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(match.detalhes.tipoVeiculoScore / 25) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-12 text-right">{match.detalhes.tipoVeiculoScore}/25</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Capacidade:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(match.detalhes.capacidadeScore / 15) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-12 text-right">{match.detalhes.capacidadeScore}/15</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Timing:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: `${(match.detalhes.tempoScore / 15) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium w-12 text-right">{match.detalhes.tempoScore}/15</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1">
                  💬 Entrar em Contato
                </Button>
                <Button variant="secondary" className="flex-1">
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
