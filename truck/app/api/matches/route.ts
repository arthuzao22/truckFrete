import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { calcularMatchScore } from "@/lib/matching"

// GET - Buscar matches para um frete específico
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const freteId = searchParams.get("freteId")
    const minScore = parseInt(searchParams.get("minScore") || "30")

    if (!freteId) {
      return NextResponse.json({ error: "freteId obrigatório" }, { status: 400 })
    }

    // Buscar o frete
    const frete = await prisma.frete.findUnique({
      where: { id: freteId }
    })

    if (!frete) {
      return NextResponse.json({ error: "Frete não encontrado" }, { status: 404 })
    }

    // Verificar permissão
    const userId = (session.user as any).id
    if (frete.contratanteId !== userId) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    // Buscar anúncios de retorno ativos
    const anuncios = await prisma.anuncioRetorno.findMany({
      where: {
        ativo: true,
        dataDisponivel: {
          lte: frete.prazoColeta
        }
      },
      include: {
        veiculo: {
          include: {
            implementos: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                telefone: true
              }
            }
          }
        }
      }
    })

    // Calcular scores para cada anúncio
    const matchesCalculados = anuncios.map(anuncio => {
      const resultado = calcularMatchScore(frete, anuncio)
      return {
        anuncio,
        ...resultado
      }
    })

    // Filtrar por score mínimo e ordenar
    const matchesFiltrados = matchesCalculados
      .filter(m => m.score >= minScore && m.detalhes.compativel)
      .sort((a, b) => b.score - a.score)

    return NextResponse.json({
      data: matchesFiltrados,
      total: matchesFiltrados.length
    })
  } catch (error) {
    console.error("Erro ao buscar matches:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Salvar um match (quando contratante aceita)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { freteId, anuncioId, score, detalhes } = body

    if (!freteId || !anuncioId || score === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se frete pertence ao usuário
    const frete = await prisma.frete.findUnique({
      where: { id: freteId }
    })

    if (!frete || frete.contratanteId !== (session.user as any).id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    // Criar ou atualizar match
    const match = await prisma.match.upsert({
      where: {
        freteId_anuncioId: {
          freteId,
          anuncioId
        }
      },
      create: {
        freteId,
        anuncioId,
        score,
        detalhes: JSON.stringify(detalhes),
        status: "PENDENTE"
      },
      update: {
        score,
        detalhes: JSON.stringify(detalhes)
      },
      include: {
        frete: {
          include: {
            contratante: {
              select: { id: true, nome: true }
            }
          }
        },
        anuncio: {
          include: {
            veiculo: {
              include: {
                usuario: {
                  select: { id: true, nome: true }
                },
                implementos: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    console.error("Erro ao salvar match:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
