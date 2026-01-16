import { z } from "zod"

// ========================================
// USUARIO VALIDATORS
// ========================================

export const registroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  role: z.enum(["MOTORISTA", "CONTRATANTE"])
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres")
})

// ========================================
// VEICULO VALIDATORS
// ========================================

export const veiculoSchema = z.object({
  tipo: z.enum(["CAVALO_MECANICO", "UTILITARIO"]),
  marca: z.string().min(2, "Marca obrigatória"),
  modelo: z.string().min(2, "Modelo obrigatório"),
  anoFabricacao: z.number()
    .int()
    .min(1990, "Ano muito antigo")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
  cor: z.string().min(2, "Cor obrigatória"),
  placa: z.string()
    .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Placa inválida (formato Mercosul)")
    .transform(val => val.toUpperCase()),
  renavam: z.string()
    .length(11, "RENAVAM deve ter 11 dígitos")
    .regex(/^\d+$/, "RENAVAM deve conter apenas números"),
  configuracaoTracao: z.enum(["4x2", "6x2", "6x4"]).optional()
})

// ========================================
// IMPLEMENTO VALIDATORS
// ========================================

export const implementoSchema = z.object({
  tipoEstrutura: z.enum([
    "SEMIRREBOQUE_SIMPLES",
    "BITREM",
    "RODOTREM",
    "REBOQUE_SEMIRREBOQUE",
    "PRANCHA",
    "EXTENSIVA"
  ]),
  tipoAplicacao: z.enum([
    "BAU",
    "SIDER",
    "GRANELEIRA",
    "BASCULANTE",
    "TANQUE",
    "PRANCHA",
    "PORTA_CONTAINER",
    "FLORESTAL",
    "CANAVIEIRA",
    "BOBINEIRA",
    "LINHA_EIXOS"
  ]),
  qtdeEixos: z.number().int().min(2).max(9),
  placa: z.string()
    .regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Placa inválida")
    .transform(val => val.toUpperCase()),
  renavam: z.string()
    .length(11, "RENAVAM deve ter 11 dígitos")
    .regex(/^\d+$/, "RENAVAM deve conter apenas números"),
  capacidadePeso: z.number().positive("Capacidade deve ser positiva"),
  capacidadeVolume: z.number().positive().optional(),
  comprimento: z.number().positive().optional(),
  largura: z.number().positive().optional(),
  altura: z.number().positive().optional(),
  veiculoId: z.string().cuid()
})

// ========================================
// ANUNCIO RETORNO VALIDATORS
// ========================================

export const anuncioRetornoSchema = z.object({
  origemCidade: z.string().min(2, "Cidade de origem obrigatória"),
  origemUf: z.string().length(2, "UF deve ter 2 caracteres").transform(val => val.toUpperCase()),
  destinoCidade: z.string().min(2, "Cidade de destino obrigatória"),
  destinoUf: z.string().length(2, "UF deve ter 2 caracteres").transform(val => val.toUpperCase()),
  dataDisponivel: z.string().or(z.date()).transform(val => new Date(val)),
  raioOperacao: z.number().int().min(10, "Raio mínimo de 10km").max(1000, "Raio máximo de 1000km"),
  observacoes: z.string().optional(),
  veiculoId: z.string().cuid()
})

// ========================================
// FRETE VALIDATORS
// ========================================

export const freteSchema = z.object({
  origemCidade: z.string().min(2, "Cidade de origem obrigatória"),
  origemUf: z.string().length(2, "UF deve ter 2 caracteres").transform(val => val.toUpperCase()),
  destinoCidade: z.string().min(2, "Cidade de destino obrigatória"),
  destinoUf: z.string().length(2, "UF deve ter 2 caracteres").transform(val => val.toUpperCase()),
  tipoCarga: z.string().min(2, "Tipo de carga obrigatório"),
  descricaoCarga: z.string().optional(),
  peso: z.number().positive("Peso deve ser positivo"),
  volume: z.number().positive().optional(),
  prazoColeta: z.string().or(z.date()).transform(val => new Date(val)),
  prazoEntrega: z.string().or(z.date()).transform(val => new Date(val)),
  valorProposto: z.number().positive().optional(),
  observacoes: z.string().optional()
})

// ========================================
// MENSAGEM VALIDATORS
// ========================================

export const mensagemSchema = z.object({
  conteudo: z.string().min(1, "Mensagem não pode ser vazia").max(5000, "Mensagem muito longa"),
  destinatarioId: z.string().cuid(),
  freteId: z.string().cuid().optional()
})
