"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { RetornoFormModal } from "./RetornoFormModal"

interface Implemento {
  id: string
  tipoEstrutura: string
  tipoAplicacao: string
}

interface Anuncio {
  id: string
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  dataDisponivel: string
  raioOperacao: number
  observacoes?: string
  ativo: boolean
  veiculo: {
    marca: string
    modelo: string
    placa: string
    implementos: Implemento[]
  }
}

export function RetornoList() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  async function loadAnuncios() {
    try {
      const res = await fetch("/api/retorno")
      const data = await res.json()
      setAnuncios(data.data || [])
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnuncios()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente desativar este anúncio?")) return

    try {
      const res = await fetch(`/api/retorno/${id}`, {
        method: "DELETE"
      })

      if (res.ok) {
        loadAnuncios()
      }
    } catch (error) {
      console.error("Erro ao deletar anúncio:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Carregando anúncios...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => setShowModal(true)}>
          📢 Anunciar Retorno Disponível
        </Button>
      </div>

      {anuncios.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Você ainda não tem anúncios de retorno
            </p>
            <Button onClick={() => setShowModal(true)}>
              Criar Primeiro Anúncio
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {anuncios.map(anuncio => (
            <Card key={anuncio.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {anuncio.origemCidade}/{anuncio.origemUf} → {anuncio.destinoCidade}/{anuncio.destinoUf}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                    anuncio.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {anuncio.ativo ? 'ATIVO' : 'INATIVO'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Veículo:</span>
                  <span className="font-medium">{anuncio.veiculo.marca} {anuncio.veiculo.modelo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Placa:</span>
                  <span className="font-medium">{anuncio.veiculo.placa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Implementos:</span>
                  <span className="font-medium">{anuncio.veiculo.implementos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponível em:</span>
                  <span className="font-medium">
                    {new Date(anuncio.dataDisponivel).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Raio de Operação:</span>
                  <span className="font-medium">{anuncio.raioOperacao} km</span>
                </div>
              </div>

              {anuncio.observacoes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">{anuncio.observacoes}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => handleDelete(anuncio.id)}
                >
                  🗑️ Desativar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <RetornoFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            loadAnuncios()
          }}
        />
      )}
    </div>
  )
}
