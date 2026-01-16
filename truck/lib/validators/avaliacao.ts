// FreteConnect - Validadores de Avaliação
import { z } from "zod"

export const avaliacaoSchema = z.object({
  nota: z.number().int().min(1, "Nota mínima é 1").max(5, "Nota máxima é 5"),
  comentario: z.string().max(500, "Comentário muito longo").optional(),
  pontualidade: z.number().int().min(1).max(5).optional(),
  comunicacao: z.number().int().min(1).max(5).optional(),
  qualidade: z.number().int().min(1).max(5).optional(),
  freteId: z.string().cuid(),
  avaliadoId: z.string().cuid(),
})

export const avaliacaoQuerySchema = z.object({
  usuarioId: z.string().cuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(10),
})

export type AvaliacaoInput = z.infer<typeof avaliacaoSchema>
export type AvaliacaoQuery = z.infer<typeof avaliacaoQuerySchema>
