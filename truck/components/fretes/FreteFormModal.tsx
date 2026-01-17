"use client"

import { useState, FormEvent } from "react"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface FreteFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function FreteFormModal({ isOpen, onClose, onSuccess }: FreteFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const dados = {
      origemCidade: formData.get("origemCidade"),
      origemUf: formData.get("origemUf"),
      destinoCidade: formData.get("destinoCidade"),
      destinoUf: formData.get("destinoUf"),
      tipoCarga: formData.get("tipoCarga"),
      descricaoCarga: formData.get("descricaoCarga"),
      peso: parseFloat(formData.get("peso") as string),
      volume: formData.get("volume") ? parseFloat(formData.get("volume") as string) : undefined,
      prazoColeta: formData.get("prazoColeta"),
      prazoEntrega: formData.get("prazoEntrega"),
      valorProposto: formData.get("valorProposto")
        ? parseFloat(formData.get("valorProposto") as string)
        : undefined,
      observacoes: formData.get("observacoes")
    }

    try {
      const res = await fetch("/api/fretes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Erro ao publicar frete")
      } else {
        onSuccess()
      }
    } catch {
      setError("Erro ao publicar frete")
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Publicar Novo Frete" size="lg">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            name="origemCidade"
            label="Cidade de Origem"
            placeholder="São Paulo"
            required
          />
          <Input
            name="origemUf"
            label="UF Origem"
            placeholder="SP"
            maxLength={2}
            required
          />
          <Input
            name="destinoCidade"
            label="Cidade de Destino"
            placeholder="Rio de Janeiro"
            required
          />
          <Input
            name="destinoUf"
            label="UF Destino"
            placeholder="RJ"
            maxLength={2}
            required
          />
        </div>

        <div className="mt-4">
          <label className="label">Tipo de Carga</label>
          <select name="tipoCarga" className="input-field" required>
            <option value="">Selecione...</option>
            <option value="Grãos">Grãos</option>
            <option value="Líquidos">Líquidos</option>
            <option value="Containers">Containers</option>
            <option value="Máquinas">Máquinas</option>
            <option value="Carga Geral">Carga Geral</option>
            <option value="Madeira">Madeira</option>
            <option value="Bobinas">Bobinas</option>
            <option value="Material de Construção">Material de Construção</option>
            <option value="Combustível">Combustível</option>
            <option value="Veículos">Veículos</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="label">Descrição da Carga</label>
          <textarea
            name="descricaoCarga"
            className="input-field"
            rows={3}
            placeholder="Detalhes sobre a carga..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Input
            name="peso"
            type="number"
            label="Peso (kg)"
            placeholder="25000"
            step="0.01"
            required
          />
          <Input
            name="volume"
            type="number"
            label="Volume (m³) - Opcional"
            placeholder="45"
            step="0.01"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Input
            name="prazoColeta"
            type="date"
            label="Data de Coleta"
            required
          />
          <Input
            name="prazoEntrega"
            type="date"
            label="Data de Entrega"
            required
          />
        </div>

        <div className="mt-4">
          <Input
            name="valorProposto"
            type="number"
            label="Valor Proposto (R$) - Opcional"
            placeholder="5000.00"
            step="0.01"
          />
        </div>

        <div className="mt-4">
          <label className="label">Observações</label>
          <textarea
            name="observacoes"
            className="input-field"
            rows={2}
            placeholder="Informações adicionais..."
          />
        </div>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Publicando..." : "Publicar Frete"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
