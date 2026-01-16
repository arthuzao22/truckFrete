import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { anuncioRetornoSchema } from "@/lib/validators/schemas"

// GET - Listar anúncios de retorno
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100)
    const userRole = session.user.role
    const userId = session.user.id

    const where: Record<string, unknown> = { ativo: true }

    // Motoristas veem apenas seus próprios anúncios
    if (userRole === "MOTORISTA") {
      where.motoristaId = userId
    }

    const [anuncios, total] = await Promise.all([
      prisma.anuncioRetorno.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
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
          },
          implemento: true,
          motorista: {
            select: {
              id: true,
              nome: true,
              telefone: true
            }
          },
          interesses: {
            include: {
              contratante: {
                select: {
                  id: true,
                  nome: true,
                  telefone: true
                }
              }
            }
          }
        },
        orderBy: { dataSaida: "asc" }
      }),
      prisma.anuncioRetorno.count({ where })
    ])

    return NextResponse.json({
      data: anuncios,
      pagination: { 
        page, 
        limit, 
        total, 
        pages: Math.ceil(total / limit) 
      }
    })
  } catch (error) {
    console.error("Erro ao listar anúncios:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Criar novo anúncio de retorno (apenas MOTORISTA)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userRole = session.user.role
    if (userRole !== "MOTORISTA") {
      return NextResponse.json(
        { error: "Apenas motoristas podem criar anúncios de retorno" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validacao = anuncioRetornoSchema.safeParse(body)
    
    if (!validacao.success) {
      return NextResponse.json({ 
        error: "Dados inválidos", 
        detalhes: validacao.error.flatten() 
      }, { status: 400 })
    }

    // Verificar se o veículo pertence ao usuário
    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id: validacao.data.veiculoId,
        usuarioId: session.user.id
      }
    })

    if (!veiculo) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 })
    }

    // Verificar se o implemento pertence ao veículo
    const implemento = await prisma.implemento.findFirst({
      where: {
        id: validacao.data.implementoId,
        veiculoId: validacao.data.veiculoId
      }
    })

    if (!implemento) {
      return NextResponse.json({ error: "Implemento não encontrado para este veículo" }, { status: 404 })
    }

    const anuncio = await prisma.anuncioRetorno.create({
      data: {
        ...validacao.data,
        motoristaId: session.user.id
      },
      include: {
        veiculo: {
          include: {
            implementos: true
          }
        },
        implemento: true,
        motorista: {
          select: {
            id: true,
            nome: true,
            telefone: true
          }
        }
      }
    })

    return NextResponse.json(anuncio, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
