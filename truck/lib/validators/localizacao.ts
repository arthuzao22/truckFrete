// FreteConnect - Validadores de Localização
import { z } from "zod"

export const localizacaoSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  velocidade: z.number().min(0).optional(),
  direcao: z.number().min(0).max(360).optional(),
  precisao: z.number().min(0).optional(),
  freteId: z.string().cuid().optional(),
})

export const localizacaoQuerySchema = z.object({
  usuarioId: z.string().cuid().optional(),
  freteId: z.string().cuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type LocalizacaoInput = z.infer<typeof localizacaoSchema>
export type LocalizacaoQuery = z.infer<typeof localizacaoQuerySchema>
