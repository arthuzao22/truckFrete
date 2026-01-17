"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { VeiculoCard } from "./VeiculoCard"
import { VeiculoFormModal } from "./VeiculoFormModal"
import { ImplementoFormModal } from "./ImplementoFormModal"

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

export function VeiculosList() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVeiculoModal, setShowVeiculoModal] = useState(false)
  const [showImplementoModal, setShowImplementoModal] = useState(false)
  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string | null>(null)

  async function fetchVeiculos() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/veiculos")

      if (!res.ok) {
        throw new Error("Erro ao carregar veículos")
      }

      const data = await res.json()
      setVeiculos(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVeiculos()
  }, [])

  function handleAddImplemento(veiculoId: string) {
    setSelectedVeiculoId(veiculoId)
    setShowImplementoModal(true)
  }

  function handleVeiculoSuccess() {
    setShowVeiculoModal(false)
    fetchVeiculos()
  }

  function handleImplementoSuccess() {
    setShowImplementoModal(false)
    setSelectedVeiculoId(null)
    fetchVeiculos()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar veículos</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchVeiculos} variant="secondary">
            Tentar novamente
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="mb-6">
        <Button onClick={() => setShowVeiculoModal(true)}>
          <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Cadastrar Novo Veículo
        </Button>
      </div>

      {veiculos.length === 0 ? (
        <Card className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6 0a1 1 0 001 1h2a1 1 0 001-1m-6 0h6" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum veículo cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Cadastre seu primeiro cavalo mecânico para começar a receber ofertas de frete.
          </p>
          <Button onClick={() => setShowVeiculoModal(true)}>
            Cadastrar Veículo
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {veiculos.map((veiculo) => (
            <VeiculoCard
              key={veiculo.id}
              veiculo={veiculo}
              onAddImplemento={() => handleAddImplemento(veiculo.id)}
              onRefresh={fetchVeiculos}
            />
          ))}
        </div>
      )}

      <VeiculoFormModal
        isOpen={showVeiculoModal}
        onClose={() => setShowVeiculoModal(false)}
        onSuccess={handleVeiculoSuccess}
      />

      <ImplementoFormModal
        isOpen={showImplementoModal && !!selectedVeiculoId}
        veiculoId={selectedVeiculoId || ""}
        onClose={() => {
          setShowImplementoModal(false)
          setSelectedVeiculoId(null)
        }}
        onSuccess={handleImplementoSuccess}
      />
    </>
  )
}
