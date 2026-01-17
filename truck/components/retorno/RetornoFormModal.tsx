"use client"

import { useState, FormEvent, useEffect } from "react"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface RetornoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface Veiculo {
  id: string
  marca: string
  modelo: string
  placa: string
  implementos: Implemento[]
}

interface Implemento {
  id: string
  tipoAplicacao: string
  tipoEstrutura: string
  placa: string
  capacidadePeso: number
}

const TIPOS_CARGA = [
  "Grãos e Cereais",
  "Alimentos Perecíveis",
  "Alimentos Secos",
  "Bebidas",
  "Móveis e Eletrodomésticos",
  "Equipamentos Industriais",
  "Materiais de Construção",
  "Combustíveis",
  "Produtos Químicos",
  "Veículos",
  "Madeira",
  "Papel e Celulose",
  "Açúcar e Álcool",
  "Produtos Siderúrgicos",
  "Containers",
  "Carga Geral"
]

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

export function RetornoFormModal({ isOpen, onClose, onSuccess }: RetornoFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [loadingVeiculos, setLoadingVeiculos] = useState(true)
  const [error, setError] = useState("")
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string>("")
  const [implementos, setImplementos] = useState<Implemento[]>([])
  const [capacidadeDisponivel, setCapacidadeDisponivel] = useState<"TOTAL" | "PARCIAL">("TOTAL")
  const [tiposCargaAceita, setTiposCargaAceita] = useState<string[]>([])
  const [tiposCargaRecusada, setTiposCargaRecusada] = useState<string[]>([])
  const [permiteWhatsApp, setPermiteWhatsApp] = useState(true)
  const [permiteTelefone, setPermiteTelefone] = useState(false)
  const [permiteChat, setPermiteChat] = useState(true)
  const [precoNegociavel, setPrecoNegociavel] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadVeiculos()
    }
  }, [isOpen])

  async function loadVeiculos() {
    setLoadingVeiculos(true)
    try {
      const res = await fetch("/api/veiculos")
      const data = await res.json()
      setVeiculos(data.data || [])
    } catch (error) {
      console.error("Erro ao carregar veículos:", error)
      setError("Erro ao carregar veículos")
    } finally {
      setLoadingVeiculos(false)
    }
  }

  useEffect(() => {
    if (veiculoSelecionado) {
      const veiculo = veiculos.find(v => v.id === veiculoSelecionado)
      setImplementos(veiculo?.implementos || [])
    } else {
      setImplementos([])
    }
  }, [veiculoSelecionado, veiculos])

  function toggleTipoCargaAceita(tipo: string) {
    if (tiposCargaAceita.includes(tipo)) {
      setTiposCargaAceita(tiposCargaAceita.filter(t => t !== tipo))
    } else {
      setTiposCargaAceita([...tiposCargaAceita, tipo])
    }
  }

  function toggleTipoCargaRecusada(tipo: string) {
    if (tiposCargaRecusada.includes(tipo)) {
      setTiposCargaRecusada(tiposCargaRecusada.filter(t => t !== tipo))
    } else {
      setTiposCargaRecusada([...tiposCargaRecusada, tipo])
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const dados = {
      veiculoId: formData.get("veiculoId"),
      implementoId: formData.get("implementoId"),
      origemCidade: formData.get("origemCidade"),
      origemUf: formData.get("origemUf")?.toString().toUpperCase(),
      destinoCidade: formData.get("destinoCidade"),
      destinoUf: formData.get("destinoUf")?.toString().toUpperCase(),
      dataSaida: formData.get("dataSaida"),
      dataChegadaEstimada: formData.get("dataChegadaEstimada") || undefined,
      flexibilidadeDias: parseInt(formData.get("flexibilidadeDias") as string) || 0,
      capacidadeDisponivel,
      pesoDisponivel: capacidadeDisponivel === "PARCIAL"
        ? parseFloat(formData.get("pesoDisponivel") as string)
        : undefined,
      volumeDisponivel: capacidadeDisponivel === "PARCIAL"
        ? parseFloat(formData.get("volumeDisponivel") as string) || undefined
        : undefined,
      tiposCargaAceita,
      tiposCargaRecusada,
      precoSugerido: formData.get("precoSugerido")
        ? parseFloat(formData.get("precoSugerido") as string)
        : undefined,
      precoNegociavel,
      permiteWhatsApp,
      permiteTelefone,
      permiteChat,
      observacoes: formData.get("observacoes") || undefined
    }

    try {
      const res = await fetch("/api/retorno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      })

      const responseData = await res.json()

      if (!res.ok) {
        setError(responseData.error || "Erro ao criar anúncio")
      } else {
        onSuccess()
      }
    } catch (err) {
      console.error("Erro ao criar anúncio:", err)
      setError("Erro ao criar anúncio")
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    if (!loading) {
      setError("")
      onClose()
    }
  }

  // Loading state
  if (loadingVeiculos && isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Carregando..." size="md">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700">Carregando veículos...</p>
        </div>
      </Modal>
    )
  }

  // No vehicles state
  if (veiculos.length === 0 && isOpen && !loadingVeiculos) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="⚠️ Atenção" size="md">
        <p className="text-gray-700 mb-6">
          Você precisa cadastrar um veículo e ao menos um implemento antes de anunciar uma rota de retorno.
        </p>
        <Button onClick={handleClose}>Entendi</Button>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="🚛 Anunciar Nova Rota de Retorno" size="full">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Veículo e Implemento */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">🚚 Veículo e Equipamento</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Veículo *</label>
              <select
                name="veiculoId"
                className="input-field"
                required
                value={veiculoSelecionado}
                onChange={(e) => setVeiculoSelecionado(e.target.value)}
              >
                <option value="">Selecione o veículo...</option>
                {veiculos.map(veiculo => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Implemento *</label>
              <select
                name="implementoId"
                className="input-field"
                required
                disabled={implementos.length === 0}
              >
                <option value="">
                  {implementos.length === 0 ? "Selecione um veículo primeiro" : "Selecione o implemento..."}
                </option>
                {implementos.map(impl => (
                  <option key={impl.id} value={impl.id}>
                    {IMPLEMENTO_NAMES[impl.tipoAplicacao] || impl.tipoAplicacao} - {impl.placa} ({(impl.capacidadePeso / 1000).toFixed(1)}t)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rota */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">📍 Rota</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="origemCidade"
              label="Cidade de Origem *"
              placeholder="São Paulo"
              required
            />
            <Input
              name="origemUf"
              label="UF Origem *"
              placeholder="SP"
              maxLength={2}
              required
            />
            <Input
              name="destinoCidade"
              label="Cidade de Destino *"
              placeholder="Rio de Janeiro"
              required
            />
            <Input
              name="destinoUf"
              label="UF Destino *"
              placeholder="RJ"
              maxLength={2}
              required
            />
          </div>
        </div>

        {/* Datas */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">📅 Datas</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              name="dataSaida"
              type="date"
              label="Data de Saída *"
              required
            />
            <Input
              name="dataChegadaEstimada"
              type="date"
              label="Chegada Estimada"
            />
            <Input
              name="flexibilidadeDias"
              type="number"
              label="Flexibilidade (dias)"
              placeholder="0"
              min="0"
              max="30"
              defaultValue="0"
            />
          </div>
        </div>

        {/* Capacidade */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">📦 Capacidade Disponível</h3>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="radio"
                checked={capacidadeDisponivel === "TOTAL"}
                onChange={() => setCapacidadeDisponivel("TOTAL")}
              />
              <span>Capacidade Total Disponível (100%)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={capacidadeDisponivel === "PARCIAL"}
                onChange={() => setCapacidadeDisponivel("PARCIAL")}
              />
              <span>Capacidade Parcial</span>
            </label>
          </div>

          {capacidadeDisponivel === "PARCIAL" && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input
                name="pesoDisponivel"
                type="number"
                label="Peso Disponível (kg)"
                placeholder="5000"
                min="1"
              />
              <Input
                name="volumeDisponivel"
                type="number"
                label="Volume Disponível (m³)"
                placeholder="30"
                min="0"
                step="0.1"
              />
            </div>
          )}
        </div>

        {/* Tipos de Carga */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">📋 Tipos de Carga</h3>

          <div className="mb-4">
            <label className="label mb-2">✅ Tipos de Carga Aceita</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TIPOS_CARGA.map(tipo => (
                <label key={tipo} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={tiposCargaAceita.includes(tipo)}
                    onChange={() => toggleTipoCargaAceita(tipo)}
                  />
                  <span>{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label mb-2">❌ Tipos de Carga Recusada</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TIPOS_CARGA.map(tipo => (
                <label key={tipo} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={tiposCargaRecusada.includes(tipo)}
                    onChange={() => toggleTipoCargaRecusada(tipo)}
                  />
                  <span>{tipo}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preço */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">💰 Preço</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="precoSugerido"
              type="number"
              label="Preço Sugerido (R$)"
              placeholder="3500.00"
              min="0"
              step="0.01"
            />
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="precoNegociavel"
                checked={precoNegociavel}
                onChange={(e) => setPrecoNegociavel(e.target.checked)}
              />
              <label htmlFor="precoNegociavel" className="cursor-pointer">
                Preço Negociável
              </label>
            </div>
          </div>
        </div>

        {/* Permissões de Contato */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">📞 Formas de Contato Permitidas</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={permiteWhatsApp}
                onChange={(e) => setPermiteWhatsApp(e.target.checked)}
              />
              <span>WhatsApp</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={permiteTelefone}
                onChange={(e) => setPermiteTelefone(e.target.checked)}
              />
              <span>Telefone</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={permiteChat}
                onChange={(e) => setPermiteChat(e.target.checked)}
              />
              <span>Chat Interno</span>
            </label>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="label">💬 Observações</label>
          <textarea
            name="observacoes"
            className="input-field"
            rows={4}
            placeholder="Informações adicionais sobre a rota, restrições, preferências, etc..."
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Criando Anúncio..." : "✅ Criar Anúncio"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
