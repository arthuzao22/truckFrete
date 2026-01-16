/**
 * FreteConnect - Algoritmo de Matching Inteligente
 * 
 * Calcula score de compatibilidade (0-100) entre frete e veículo de retorno
 * 
 * Distribuição de Pontos:
 * - Compatibilidade de Rota: 40 pontos
 * - Tipo de Veículo: 25 pontos
 * - Capacidade: 15 pontos
 * - Janela de Tempo: 15 pontos
 * - Avaliação do Motorista: 5 pontos
 */

interface Frete {
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  peso: number
  volume?: number | null
  prazoColeta: Date
  prazoEntrega: Date
  tipoCarga: string
}

interface AnuncioRetorno {
  origemCidade: string
  origemUf: string
  destinoCidade: string
  destinoUf: string
  dataDisponivel: Date
  raioOperacao: number
  veiculo: {
    implementos: Array<{
      tipoAplicacao: string
      capacidadePeso: number
      capacidadeVolume?: number | null
    }>
  }
}

interface MatchResult {
  score: number
  detalhes: {
    rotaScore: number
    tipoVeiculoScore: number
    capacidadeScore: number
    tempoScore: number
    avaliacaoScore: number
    compativel: boolean
    motivo?: string
  }
}

/**
 * Calcula distância aproximada entre duas cidades (simplificado)
 * Em produção, usar API de geocodificação
 */
function calcularDistanciaAproximada(
  cidade1: string,
  uf1: string,
  cidade2: string,
  uf2: string
): number {
  // Cidades exatas = 0km
  if (cidade1.toLowerCase() === cidade2.toLowerCase() && uf1 === uf2) {
    return 0
  }
  
  // Mesmo estado = 200km médio
  if (uf1 === uf2) {
    return 200
  }
  
  // Estados diferentes = 800km médio
  return 800
}

/**
 * Calcula score de compatibilidade de rota (0-40 pontos)
 */
function calcularRotaScore(frete: Frete, anuncio: AnuncioRetorno): number {
  // Origem do frete deve estar próxima ao destino do retorno
  const distanciaOrigem = calcularDistanciaAproximada(
    frete.origemCidade,
    frete.origemUf,
    anuncio.destinoCidade,
    anuncio.destinoUf
  )
  
  // Destino do frete deve estar na direção da origem do retorno (ou próximo)
  const distanciaDestino = calcularDistanciaAproximada(
    frete.destinoCidade,
    frete.destinoUf,
    anuncio.origemCidade,
    anuncio.origemUf
  )
  
  // Raio de operação do anúncio
  const raio = anuncio.raioOperacao
  
  let score = 0
  
  // Pontuação pela proximidade da origem (0-20 pontos)
  if (distanciaOrigem === 0) {
    score += 20
  } else if (distanciaOrigem <= raio / 2) {
    score += 15
  } else if (distanciaOrigem <= raio) {
    score += 10
  } else if (distanciaOrigem <= raio * 1.5) {
    score += 5
  }
  
  // Pontuação pela proximidade do destino (0-20 pontos)
  if (distanciaDestino === 0) {
    score += 20
  } else if (distanciaDestino <= raio / 2) {
    score += 15
  } else if (distanciaDestino <= raio) {
    score += 10
  } else if (distanciaDestino <= raio * 1.5) {
    score += 5
  }
  
  return score
}

/**
 * Mapeia tipos de carga para tipos de aplicação compatíveis
 */
const compatibilidadeCarga: Record<string, string[]> = {
  "Grãos": ["GRANELEIRA", "BAU"],
  "Líquidos": ["TANQUE"],
  "Containers": ["PORTA_CONTAINER"],
  "Máquinas": ["PRANCHA", "EXTENSIVA"],
  "Carga Geral": ["BAU", "SIDER", "PRANCHA"],
  "Madeira": ["FLORESTAL", "PRANCHA"],
  "Bobinas": ["BOBINEIRA", "PRANCHA"],
  "Material de Construção": ["BASCULANTE", "PRANCHA", "BAU"],
  "Combustível": ["TANQUE"],
  "Veículos": ["PRANCHA", "EXTENSIVA"]
}

/**
 * Calcula score de tipo de veículo (0-25 pontos)
 */
function calcularTipoVeiculoScore(frete: Frete, anuncio: AnuncioRetorno): number {
  const implementos = anuncio.veiculo.implementos
  
  if (!implementos || implementos.length === 0) {
    return 0
  }
  
  // Busca compatibilidade com tipo de carga
  const tiposCompativeis = compatibilidadeCarga[frete.tipoCarga] || []
  
  for (const implemento of implementos) {
    if (tiposCompativeis.includes(implemento.tipoAplicacao)) {
      return 25 // Match perfeito
    }
  }
  
  // Se tem implemento mas não é compatível
  if (tiposCompativeis.length === 0) {
    return 15 // Tipo de carga não mapeado, assume parcialmente compatível
  }
  
  return 5 // Implemento existe mas não é ideal
}

/**
 * Calcula score de capacidade (0-15 pontos)
 */
function calcularCapacidadeScore(frete: Frete, anuncio: AnuncioRetorno): number {
  const implementos = anuncio.veiculo.implementos
  
  if (!implementos || implementos.length === 0) {
    return 0
  }
  
  let melhorScore = 0
  
  for (const implemento of implementos) {
    let score = 0
    
    // Verifica capacidade de peso
    const percentualPeso = (frete.peso / implemento.capacidadePeso) * 100
    
    if (percentualPeso <= 100 && percentualPeso >= 70) {
      score += 10 // Uso otimizado (70-100%)
    } else if (percentualPeso <= 100 && percentualPeso >= 50) {
      score += 8 // Bom uso (50-70%)
    } else if (percentualPeso < 50) {
      score += 5 // Subutilizado
    } else {
      score += 0 // Excede capacidade
    }
    
    // Verifica volume se informado
    if (frete.volume && implemento.capacidadeVolume) {
      const percentualVolume = (frete.volume / implemento.capacidadeVolume) * 100
      
      if (percentualVolume <= 100 && percentualVolume >= 70) {
        score += 5
      } else if (percentualVolume <= 100 && percentualVolume >= 50) {
        score += 3
      } else if (percentualVolume < 50) {
        score += 2
      }
    }
    
    melhorScore = Math.max(melhorScore, score)
  }
  
  return melhorScore
}

/**
 * Calcula score de janela de tempo (0-15 pontos)
 */
function calcularTempoScore(frete: Frete, anuncio: AnuncioRetorno): number {
  const dataDisponivel = new Date(anuncio.dataDisponivel)
  const prazoColeta = new Date(frete.prazoColeta)
  const prazoEntrega = new Date(frete.prazoEntrega)
  
  // Diferença em dias
  const diferenciaColeta = Math.floor(
    (prazoColeta.getTime() - dataDisponivel.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Veículo disponível antes ou no dia da coleta
  if (diferenciaColeta >= 0 && diferenciaColeta <= 2) {
    return 15 // Timing perfeito
  } else if (diferenciaColeta >= -2 && diferenciaColeta < 0) {
    return 12 // Disponível um pouco antes
  } else if (diferenciaColeta > 2 && diferenciaColeta <= 5) {
    return 10 // Disponível com antecedência razoável
  } else if (diferenciaColeta > 5 && diferenciaColeta <= 10) {
    return 5 // Muita antecedência
  } else {
    return 0 // Timing incompatível
  }
}

/**
 * Função principal de matching
 */
export function calcularMatchScore(
  frete: Frete,
  anuncio: AnuncioRetorno
): MatchResult {
  const rotaScore = calcularRotaScore(frete, anuncio)
  const tipoVeiculoScore = calcularTipoVeiculoScore(frete, anuncio)
  const capacidadeScore = calcularCapacidadeScore(frete, anuncio)
  const tempoScore = calcularTempoScore(frete, anuncio)
  const avaliacaoScore = 5 // Placeholder - implementar sistema de avaliação
  
  const score = rotaScore + tipoVeiculoScore + capacidadeScore + tempoScore + avaliacaoScore
  
  // Critérios mínimos para compatibilidade
  const compativel = 
    score >= 30 && // Score mínimo
    rotaScore >= 10 && // Alguma proximidade de rota
    capacidadeScore >= 5 // Alguma capacidade adequada
  
  let motivo: string | undefined
  if (!compativel) {
    if (rotaScore < 10) {
      motivo = "Rota incompatível"
    } else if (capacidadeScore < 5) {
      motivo = "Capacidade inadequada"
    } else {
      motivo = "Score total insuficiente"
    }
  }
  
  return {
    score: Math.min(100, Math.round(score)),
    detalhes: {
      rotaScore,
      tipoVeiculoScore,
      capacidadeScore,
      tempoScore,
      avaliacaoScore,
      compativel,
      motivo
    }
  }
}
