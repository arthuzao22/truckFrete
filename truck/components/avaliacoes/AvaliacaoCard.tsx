"use client"

import { motion } from "framer-motion"
import { User, MapPin, Calendar } from "lucide-react"
import { RatingStars } from "./RatingStars"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AvaliacaoCardProps {
  avaliacao: {
    id: string
    nota: number
    comentario?: string | null
    pontualidade?: number | null
    comunicacao?: number | null
    qualidade?: number | null
    createdAt: string | Date
    avaliador: {
      nome: string
      role: string
    }
    frete?: {
      origemCidade: string
      destinoCidade: string
    }
  }
  showFrete?: boolean
}

export function AvaliacaoCard({ avaliacao, showFrete = true }: AvaliacaoCardProps) {
  const dataFormatada = format(
    new Date(avaliacao.createdAt),
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  )

  const hasDetalhes =
    avaliacao.pontualidade || avaliacao.comunicacao || avaliacao.qualidade

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {avaliacao.avaliador.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{avaliacao.avaliador.nome}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {avaliacao.avaliador.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>

        <div className="text-right">
          <RatingStars value={avaliacao.nota} readonly size="sm" />
          <p className="text-xs text-gray-500 mt-1">{dataFormatada}</p>
        </div>
      </div>

      {/* Frete Info */}
      {showFrete && avaliacao.frete && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>
            {avaliacao.frete.origemCidade} → {avaliacao.frete.destinoCidade}
          </span>
        </div>
      )}

      {/* Comentário */}
      {avaliacao.comentario && (
        <p className="text-gray-700 mb-4 leading-relaxed">{avaliacao.comentario}</p>
      )}

      {/* Detalhes da Avaliação */}
      {hasDetalhes && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          {avaliacao.pontualidade && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Pontualidade</p>
              <RatingStars value={avaliacao.pontualidade} readonly size="sm" />
            </div>
          )}
          {avaliacao.comunicacao && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Comunicação</p>
              <RatingStars value={avaliacao.comunicacao} readonly size="sm" />
            </div>
          )}
          {avaliacao.qualidade && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Qualidade</p>
              <RatingStars value={avaliacao.qualidade} readonly size="sm" />
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
