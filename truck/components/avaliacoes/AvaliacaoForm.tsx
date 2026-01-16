"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RatingStars } from "./RatingStars"
import { Button } from "@/components/ui/Button"
import { Loader2 } from "lucide-react"

interface AvaliacaoFormProps {
  freteId: string
  avaliadoId: string
  avaliadoNome: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function AvaliacaoForm({
  freteId,
  avaliadoId,
  avaliadoNome,
  onSuccess,
  onCancel,
}: AvaliacaoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nota, setNota] = useState(0)
  const [pontualidade, setPontualidade] = useState(0)
  const [comunicacao, setComunicacao] = useState(0)
  const [qualidade, setQualidade] = useState(0)
  const [comentario, setComentario] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (nota === 0) {
      setError("Por favor, selecione uma nota")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freteId,
          avaliadoId,
          nota,
          pontualidade: pontualidade || undefined,
          comunicacao: comunicacao || undefined,
          qualidade: qualidade || undefined,
          comentario: comentario.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao enviar avaliação")
      }

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar avaliação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Avaliar {avaliadoNome}
        </h3>
        <p className="text-sm text-gray-600">
          Sua avaliação ajuda a comunidade a tomar melhores decisões
        </p>
      </div>

      {/* Nota Geral */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nota Geral *
        </label>
        <RatingStars value={nota} onChange={setNota} size="lg" />
      </div>

      {/* Critérios Específicos */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700">Critérios Específicos (Opcional)</p>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Pontualidade</label>
          <RatingStars value={pontualidade} onChange={setPontualidade} size="md" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Comunicação</label>
          <RatingStars value={comunicacao} onChange={setComunicacao} size="md" />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Qualidade do Serviço</label>
          <RatingStars value={qualidade} onChange={setQualidade} size="md" />
        </div>
      </div>

      {/* Comentário */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentário (Opcional)
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Conte sua experiência..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{comentario.length}/500 caracteres</p>
      </div>

      {/* Ações */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={loading || nota === 0}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            "Enviar Avaliação"
          )}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </motion.form>
  )
}
