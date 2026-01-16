import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Listar rotas públicas (sem autenticação)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 100)
    
    // Filtros
    const origemUf = searchParams.get("origemUf")
    const origemCidade = searchParams.get("origemCidade")
    const destinoUf = searchParams.get("destinoUf")
    const destinoCidade = searchParams.get("destinoCidade")
    const tipoImplemento = searchParams.get("tipoImplemento")
    const dataSaidaMin = searchParams.get("dataSaidaMin")
    const dataSaidaMax = searchParams.get("dataSaidaMax")

    const where: Record<string, any> = { 
      ativo: true,
      status: "ATIVO" // Apenas anúncios ativos
    }

    // Aplicar filtros
    if (origemUf) where.origemUf = origemUf
    if (origemCidade) where.origemCidade = { contains: origemCidade, mode: "insensitive" }
    if (destinoUf) where.destinoUf = destinoUf
    if (destinoCidade) where.destinoCidade = { contains: destinoCidade, mode: "insensitive" }
    
    if (dataSaidaMin || dataSaidaMax) {
      where.dataSaida = {}
      if (dataSaidaMin) where.dataSaida.gte = new Date(dataSaidaMin)
      if (dataSaidaMax) where.dataSaida.lte = new Date(dataSaidaMax)
    }

    // Filtro por tipo de implemento
    if (tipoImplemento) {
      where.implemento = {
        tipoAplicacao: tipoImplemento
      }
    }

    const [anuncios, total] = await Promise.all([
      prisma.anuncioRetorno.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { 
          veiculo: {
            select: {
              marca: true,
              modelo: true
            }
          },
          implemento: {
            select: {
              tipoAplicacao: true,
              tipoEstrutura: true,
              capacidadePeso: true,
              capacidadeVolume: true,
              comprimento: true,
              largura: true,
              altura: true,
              qtdeEixos: true
            }
          },
          motorista: {
            select: {
              id: true,
              nome: true,
              // NÃO incluir: email, telefone, cpfCnpj, senha
            }
          }
        },
        orderBy: { dataSaida: "asc" }
      }),
      prisma.anuncioRetorno.count({ where })
    ])

    // Formatar resposta para dados públicos
    const rotasPublicas = anuncios.map(anuncio => {
      const primeiroNome = anuncio.motorista.nome.split(" ")[0]
      
      return {
        id: anuncio.id,
        origemCidade: anuncio.origemCidade,
        origemUf: anuncio.origemUf,
        destinoCidade: anuncio.destinoCidade,
        destinoUf: anuncio.destinoUf,
        dataSaida: anuncio.dataSaida,
        dataChegadaEstimada: anuncio.dataChegadaEstimada,
        flexibilidadeDias: anuncio.flexibilidadeDias,
        capacidadeDisponivel: anuncio.capacidadeDisponivel,
        pesoDisponivel: anuncio.pesoDisponivel,
        volumeDisponivel: anuncio.volumeDisponivel,
        tiposCargaAceita: anuncio.tiposCargaAceita,
        precoSugerido: anuncio.precoSugerido,
        precoNegociavel: anuncio.precoNegociavel,
        observacoes: anuncio.observacoes,
        veiculo: {
          marca: anuncio.veiculo.marca,
          modelo: anuncio.veiculo.modelo
        },
        implemento: {
          tipo: anuncio.implemento.tipoAplicacao,
          estrutura: anuncio.implemento.tipoEstrutura,
          capacidadePeso: anuncio.implemento.capacidadePeso,
          capacidadeVolume: anuncio.implemento.capacidadeVolume,
          comprimento: anuncio.implemento.comprimento,
          largura: anuncio.implemento.largura,
          altura: anuncio.implemento.altura,
          eixos: anuncio.implemento.qtdeEixos
        },
        motorista: {
          primeiroNome: primeiroNome,
          // Adicionar campos de avaliação quando implementados
          // avaliacao: 0,
          // fretesRealizados: 0,
          // verificado: false
        },
        visualizacoes: anuncio.visualizacoes,
        createdAt: anuncio.createdAt
      }
    })

    return NextResponse.json({
      data: rotasPublicas,
      pagination: { 
        page, 
        limit, 
        total, 
        pages: Math.ceil(total / limit) 
      }
    })
  } catch (error) {
    console.error("Erro ao listar rotas públicas:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
