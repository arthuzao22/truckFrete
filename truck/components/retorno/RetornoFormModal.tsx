"use client"

import { useState, FormEvent, useEffect } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface RetornoFormModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function RetornoFormModal({ onClose, onSuccess }: RetornoFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [veiculos, setVeiculos] = useState<any[]>([])

  useEffect(() => {
    async function loadVeiculos() {
      try {
        const res = await fetch("/api/veiculos")
        const data = await res.json()
        setVeiculos(data.data || [])
      } catch (error) {
        console.error("Erro ao carregar veículos:", error)
      }
    }
    loadVeiculos()
  }, [])

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
      dataDisponivel: formData.get("dataDisponivel"),
      raioOperacao: parseInt(formData.get("raioOperacao") as string),
      observacoes: formData.get("observacoes"),
      veiculoId: formData.get("veiculoId")
    }

    try {
      const res = await fetch("/api/retorno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Erro ao criar anúncio")
      } else {
        onSuccess()
      }
    } catch (err) {
      setError("Erro ao criar anúncio")
    } finally {
      setLoading(false)
    }
  }

  if (veiculos.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Atenção</h2>
          <p className="text-gray-700 mb-6">
            Você precisa cadastrar um veículo antes de anunciar um retorno.
          </p>
          <Button onClick={onClose}>Entendi</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Anunciar Retorno Disponível</h2>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">Selecione o Veículo</label>
            <select name="veiculoId" className="input-field" required>
              <option value="">Escolha um veículo...</option>
              {veiculos.map(veiculo => (
                <option key={veiculo.id} value={veiculo.id}>
                  {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="origemCidade"
              label="Cidade de Origem (retorno)"
              placeholder="Rio de Janeiro"
              required
            />
            <Input
              name="origemUf"
              label="UF Origem"
              placeholder="RJ"
              maxLength={2}
              required
            />
            <Input
              name="destinoCidade"
              label="Cidade de Destino"
              placeholder="São Paulo"
              required
            />
            <Input
              name="destinoUf"
              label="UF Destino"
              placeholder="SP"
              maxLength={2}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Input
              name="dataDisponivel"
              type="date"
              label="Data Disponível"
              required
            />
            <Input
              name="raioOperacao"
              type="number"
              label="Raio de Operação (km)"
              placeholder="200"
              min="10"
              max="1000"
              required
            />
          </div>

          <div className="mt-4">
            <label className="label">Observações</label>
            <textarea
              name="observacoes"
              className="input-field"
              rows={3}
              placeholder="Informações adicionais sobre o retorno..."
            />
          </div>

          <div className="mt-6 flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Criando..." : "Criar Anúncio"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
