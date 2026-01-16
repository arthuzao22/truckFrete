"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { FreteFormModal } from "./FreteFormModal"

interface Frete {
  id: string
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  tipoCarga: string
  peso: number
  prazoColeta: string
  prazoEntrega: string
  valorProposto?: number
  status: string
  contratante: {
    nome: string
    telefone: string
  }
}

export function FretesList() {
  const { data: session } = useSession()
  const [fretes, setFretes] = useState<Frete[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const role = (session?.user as any)?.role

  async function loadFretes() {
    try {
      const res = await fetch("/api/fretes")
      const data = await res.json()
      setFretes(data.data || [])
    } catch (error) {
      console.error("Erro ao carregar fretes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFretes()
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ABERTO: "bg-green-100 text-green-800",
      NEGOCIANDO: "bg-yellow-100 text-yellow-800",
      ACEITO: "bg-blue-100 text-blue-800",
      EM_TRANSPORTE: "bg-purple-100 text-purple-800",
      ENTREGUE: "bg-gray-100 text-gray-800",
      CANCELADO: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return <div className="text-center py-12">Carregando fretes...</div>
  }

  return (
    <div>
      {role === "CONTRATANTE" && (
        <div className="mb-6">
          <Button onClick={() => setShowModal(true)}>
            ➕ Publicar Novo Frete
          </Button>
        </div>
      )}

      {fretes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {role === "CONTRATANTE" 
                ? "Você ainda não publicou nenhum frete"
                : "Nenhum frete disponível no momento"}
            </p>
            {role === "CONTRATANTE" && (
              <Button onClick={() => setShowModal(true)}>
                Publicar Primeiro Frete
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {fretes.map(frete => (
            <Card key={frete.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {frete.origemCidade}/{frete.origemUf} → {frete.destinoCidade}/{frete.destinoUf}
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${getStatusColor(frete.status)}`}>
                    {frete.status}
                  </span>
                </div>
                {frete.valorProposto && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-xl font-bold text-green-600">
                      R$ {frete.valorProposto.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de Carga:</span>
                  <span className="font-medium">{frete.tipoCarga}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso:</span>
                  <span className="font-medium">{frete.peso.toLocaleString('pt-BR')} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coleta:</span>
                  <span className="font-medium">
                    {new Date(frete.prazoColeta).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entrega:</span>
                  <span className="font-medium">
                    {new Date(frete.prazoEntrega).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Contratante:</span>
                  <span className="font-medium">{frete.contratante.nome}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {role === "MOTORISTA" && frete.status === "ABERTO" && (
                  <Button className="flex-1">
                    💬 Entrar em Contato
                  </Button>
                )}
                {role === "CONTRATANTE" && (
                  <Button variant="secondary" className="flex-1">
                    Ver Matches
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <FreteFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            loadFretes()
          }}
        />
      )}
    </div>
  )
}
