import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Detalhes públicos de uma rota
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const anuncio = await prisma.anuncioRetorno.findUnique({
      where: { 
        id,
        ativo: true,
        status: "ATIVO"
      },
      include: { 
        veiculo: {
          select: {
            marca: true,
            modelo: true,
            anoFabricacao: true,
            tipo: true
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
            qtdeEixos: true,
            placa: true
          }
        },
        motorista: {
          select: {
            id: true,
            nome: true,
            // NÃO incluir: email, telefone, cpfCnpj, senha
          }
        }
      }
    })

    if (!anuncio) {
      return NextResponse.json({ error: "Rota não encontrada" }, { status: 404 })
    }

    // Incrementar visualizações
    await prisma.anuncioRetorno.update({
      where: { id },
      data: { visualizacoes: { increment: 1 } }
    })

    // Formatar resposta pública
    const primeiroNome = anuncio.motorista.nome.split(" ")[0]
    
    const rotaPublica = {
      id: anuncio.id,
      origemCidade: anuncio.origemCidade,
      origemUf: anuncio.origemUf,
      destinoCidade: anuncio.destinoCidade,
      destinoUf: anuncio.destinoUf,
      cidadesIntermediarias: anuncio.cidadesIntermediarias,
      dataSaida: anuncio.dataSaida,
      dataChegadaEstimada: anuncio.dataChegadaEstimada,
      flexibilidadeDias: anuncio.flexibilidadeDias,
      capacidadeDisponivel: anuncio.capacidadeDisponivel,
      pesoDisponivel: anuncio.pesoDisponivel,
      volumeDisponivel: anuncio.volumeDisponivel,
      tiposCargaAceita: anuncio.tiposCargaAceita,
      tiposCargaRecusada: anuncio.tiposCargaRecusada,
      precoSugerido: anuncio.precoSugerido,
      precoNegociavel: anuncio.precoNegociavel,
      observacoes: anuncio.observacoes,
      veiculo: {
        marca: anuncio.veiculo.marca,
        modelo: anuncio.veiculo.modelo,
        ano: anuncio.veiculo.anoFabricacao,
        tipo: anuncio.veiculo.tipo
      },
      implemento: {
        tipo: anuncio.implemento.tipoAplicacao,
        estrutura: anuncio.implemento.tipoEstrutura,
        capacidadePeso: anuncio.implemento.capacidadePeso,
        capacidadeVolume: anuncio.implemento.capacidadeVolume,
        comprimento: anuncio.implemento.comprimento,
        largura: anuncio.implemento.largura,
        altura: anuncio.implemento.altura,
        eixos: anuncio.implemento.qtdeEixos,
        placa: anuncio.implemento.placa
      },
      motorista: {
        id: anuncio.motorista.id, // Necessário para contato
        primeiroNome: primeiroNome,
        // Adicionar campos de avaliação quando implementados
        // avaliacao: 0,
        // fretesRealizados: 0,
        // verificado: false
      },
      permiteWhatsApp: anuncio.permiteWhatsApp,
      permiteTelefone: anuncio.permiteTelefone,
      permiteChat: anuncio.permiteChat,
      visualizacoes: anuncio.visualizacoes,
      createdAt: anuncio.createdAt
    }

    return NextResponse.json(rotaPublica)
  } catch (error) {
    console.error("Erro ao buscar rota:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
