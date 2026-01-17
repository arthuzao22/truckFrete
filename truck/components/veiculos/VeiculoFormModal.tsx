"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

interface VeiculoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function VeiculoFormModal({ isOpen, onClose, onSuccess }: VeiculoFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    tipo: "CAVALO_MECANICO",
    marca: "",
    modelo: "",
    anoFabricacao: new Date().getFullYear(),
    cor: "",
    placa: "",
    renavam: "",
    configuracaoTracao: "4x2"
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "anoFabricacao" ? parseInt(value) : value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          placa: formData.placa.toUpperCase().replace(/[^A-Z0-9]/g, "")
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar veículo")
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    if (!loading) {
      setError(null)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cadastrar Novo Veículo"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Tipo de Veículo *</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="CAVALO_MECANICO">Cavalo Mecânico</option>
              <option value="UTILITARIO">Utilitário</option>
            </select>
          </div>

          <div>
            <label className="label">Configuração de Tração *</label>
            <select
              name="configuracaoTracao"
              value={formData.configuracaoTracao}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="4x2">4x2</option>
              <option value="6x2">6x2</option>
              <option value="6x4">6x4</option>
            </select>
          </div>

          <Input
            label="Marca *"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            placeholder="Ex: Scania, Volvo, Mercedes"
            required
          />

          <Input
            label="Modelo *"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Ex: R450, FH540, Actros"
            required
          />

          <Input
            label="Ano de Fabricação *"
            name="anoFabricacao"
            type="number"
            min="1990"
            max={new Date().getFullYear() + 1}
            value={formData.anoFabricacao}
            onChange={handleChange}
            required
          />

          <Input
            label="Cor *"
            name="cor"
            value={formData.cor}
            onChange={handleChange}
            placeholder="Ex: Branco, Azul"
            required
          />

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
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
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
              "Cadastrar Veículo"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
