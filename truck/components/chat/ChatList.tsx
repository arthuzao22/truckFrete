"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useSession } from "next-auth/react"

interface Mensagem {
  id: string
  conteudo: string
  createdAt: string
  lida: boolean
  remetente: {
    id: string
    nome: string
  }
  destinatario: {
    id: string
    nome: string
  }
  frete?: {
    id: string
    origemCidade: string
    destinoCidade: string
  }
}

export function ChatList() {
  const { data: session } = useSession()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(true)
  const [novaMensagem, setNovaMensagem] = useState("")
  const [destinatarioId, setDestinatarioId] = useState("")

  async function loadMensagens() {
    try {
      const res = await fetch("/api/mensagens")
      const data = await res.json()
      setMensagens(data.data || [])
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMensagens()
    // Refresh a cada 10 segundos
    const interval = setInterval(loadMensagens, 10000)
    return () => clearInterval(interval)
  }, [])

  async function enviarMensagem() {
    if (!novaMensagem.trim() || !destinatarioId) return

    try {
      const res = await fetch("/api/mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conteudo: novaMensagem,
          destinatarioId
        })
      })

      if (res.ok) {
        setNovaMensagem("")
        loadMensagens()
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
    }
  }

  const userId = session?.user?.id

  // Agrupar conversas por pessoa
  const conversas = new Map<string, Mensagem[]>()
  mensagens.forEach(msg => {
    const outraPessoa = msg.remetente.id === userId ? msg.destinatario.id : msg.remetente.id
    if (!conversas.has(outraPessoa)) {
      conversas.set(outraPessoa, [])
    }
    conversas.get(outraPessoa)!.push(msg)
  })

  if (loading) {
    return <div className="text-center py-12">Carregando mensagens...</div>
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <h3 className="text-lg font-bold mb-4">Conversas</h3>
        {conversas.size === 0 ? (
          <p className="text-gray-600 text-sm">Nenhuma conversa ainda</p>
        ) : (
          <div className="space-y-2">
            {Array.from(conversas.entries()).map(([pessoaId, msgs]) => {
              const ultimaMsg = msgs[0]
              const outraPessoa = ultimaMsg.remetente.id === userId 
                ? ultimaMsg.destinatario 
                : ultimaMsg.remetente
              
              return (
                <button
                  key={pessoaId}
                  onClick={() => setDestinatarioId(pessoaId)}
                  className={`w-full text-left p-3 rounded hover:bg-gray-50 transition-colors ${
                    destinatarioId === pessoaId ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="font-semibold text-sm">{outraPessoa.nome}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {ultimaMsg.conteudo}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(ultimaMsg.createdAt).toLocaleString('pt-BR')}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </Card>

      <Card className="md:col-span-2">
        <h3 className="text-lg font-bold mb-4">Mensagens</h3>
        
        {!destinatarioId ? (
          <div className="text-center py-12 text-gray-600">
            Selecione uma conversa ao lado
          </div>
        ) : (
          <>
            <div className="h-96 overflow-y-auto mb-4 space-y-3 border rounded p-4">
              {conversas.get(destinatarioId)?.reverse().map(msg => {
                const ehRemetente = msg.remetente.id === userId
                return (
                  <div
                    key={msg.id}
                    className={`flex ${ehRemetente ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        ehRemetente 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.conteudo}</p>
                      <p className={`text-xs mt-1 ${
                        ehRemetente ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                placeholder="Digite sua mensagem..."
                className="input-field flex-1"
              />
              <Button onClick={enviarMensagem}>
                Enviar
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
