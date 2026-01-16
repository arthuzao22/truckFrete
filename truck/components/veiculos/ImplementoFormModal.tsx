"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface ImplementoFormModalProps {
  veiculoId: string
  onClose: () => void
  onSuccess: () => void
}

export function ImplementoFormModal({ veiculoId, onClose, onSuccess }: ImplementoFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    tipoEstrutura: "SEMIRREBOQUE_SIMPLES",
    tipoAplicacao: "BAU",
    qtdeEixos: 3,
    placa: "",
    renavam: "",
    capacidadePeso: 0,
    capacidadeVolume: 0,
    comprimento: 0,
    largura: 0,
    altura: 0
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const numericFields = ["qtdeEixos", "capacidadePeso", "capacidadeVolume", "comprimento", "largura", "altura"]
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        veiculoId,
        placa: formData.placa.toUpperCase().replace(/[^A-Z0-9]/g, ""),
        capacidadeVolume: formData.capacidadeVolume || undefined,
        comprimento: formData.comprimento || undefined,
        largura: formData.largura || undefined,
        altura: formData.altura || undefined
      }

      const res = await fetch("/api/implementos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar implemento")
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Cadastrar Implemento Rodoviário
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Tipo de Estrutura e Aplicação */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Tipo de Estrutura *</label>
                <select
                  name="tipoEstrutura"
                  value={formData.tipoEstrutura}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="SEMIRREBOQUE_SIMPLES">Semirreboque Simples</option>
                  <option value="BITREM">Bitrem</option>
                  <option value="RODOTREM">Rodotrem</option>
                  <option value="REBOQUE_SEMIRREBOQUE">Reboque + Semirreboque</option>
                  <option value="PRANCHA">Prancha</option>
                  <option value="EXTENSIVA">Extensiva</option>
                </select>
              </div>

              <div>
                <label className="label">Tipo de Aplicação *</label>
                <select
                  name="tipoAplicacao"
                  value={formData.tipoAplicacao}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="BAU">Baú</option>
                  <option value="SIDER">Sider</option>
                  <option value="GRANELEIRA">Graneleira</option>
                  <option value="BASCULANTE">Basculante</option>
                  <option value="TANQUE">Tanque</option>
                  <option value="PRANCHA">Prancha</option>
                  <option value="PORTA_CONTAINER">Porta Container</option>
                  <option value="FLORESTAL">Florestal</option>
                  <option value="CANAVIEIRA">Canavieira</option>
                  <option value="BOBINEIRA">Bobineira</option>
                  <option value="LINHA_EIXOS">Linha de Eixos</option>
                </select>
              </div>
            </div>

            {/* Documentação */}
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Placa (Mercosul) *"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="ABC1D23"
                maxLength={7}
                pattern="[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}"
                required
              />

              <Input
                label="RENAVAM *"
                name="renavam"
                value={formData.renavam}
                onChange={handleChange}
                placeholder="11 dígitos"
                maxLength={11}
                pattern="[0-9]{11}"
                required
              />

              <Input
                label="Quantidade de Eixos *"
                name="qtdeEixos"
                type="number"
                min="2"
                max="9"
                value={formData.qtdeEixos}
                onChange={handleChange}
                required
              />
            </div>

            {/* Capacidades */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Capacidades</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Capacidade de Peso (kg) *"
                  name="capacidadePeso"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.capacidadePeso}
                  onChange={handleChange}
                  placeholder="Ex: 30000"
                  required
                />

                <Input
                  label="Capacidade de Volume (m³)"
                  name="capacidadeVolume"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.capacidadeVolume || ""}
                  onChange={handleChange}
                  placeholder="Ex: 90"
                />
              </div>
            </div>

            {/* Dimensões */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Dimensões (metros)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Comprimento (m)"
                  name="comprimento"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.comprimento || ""}
                  onChange={handleChange}
                  placeholder="Ex: 14.60"
                />

                <Input
                  label="Largura (m)"
                  name="largura"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.largura || ""}
                  onChange={handleChange}
                  placeholder="Ex: 2.60"
                />

                <Input
                  label="Altura (m)"
                  name="altura"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.altura || ""}
                  onChange={handleChange}
                  placeholder="Ex: 3.00"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </>
              ) : (
                "Cadastrar Implemento"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
