import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema de validação para interesse
const interesseSchema = z.object({
  anuncioId: z.string().cuid(),
  descricaoCarga: z.string().optional(),
  tipoCarga: z.string().optional(),
  pesoCarga: z.number().positive().optional(),
  volumeCarga: z.number().positive().optional(),
  valorProposto: z.number().positive().optional(),
  observacoes: z.string().optional(),
  urgente: z.boolean().default(false)
})

// POST - Contratante manifesta interesse em uma rota
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userRole = session.user.role
    if (userRole !== "CONTRATANTE") {
      return NextResponse.json(
        { error: "Apenas contratantes podem manifestar interesse" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validacao = interesseSchema.safeParse(body)
    
    if (!validacao.success) {
      return NextResponse.json({ 
        error: "Dados inválidos", 
        detalhes: validacao.error.flatten() 
      }, { status: 400 })
    }

    // Verificar se o anúncio existe e está ativo
    const anuncio = await prisma.anuncioRetorno.findUnique({
      where: { id: validacao.data.anuncioId }
    })

    if (!anuncio || !anuncio.ativo || anuncio.status !== "ATIVO") {
      return NextResponse.json({ error: "Anúncio não encontrado ou inativo" }, { status: 404 })
    }

    // Verificar se já não manifestou interesse
    const interesseExistente = await prisma.interesse.findFirst({
      where: {
        anuncioId: validacao.data.anuncioId,
        contratanteId: session.user.id
      }
    })

    if (interesseExistente) {
      return NextResponse.json({ 
        error: "Você já manifestou interesse nesta rota" 
      }, { status: 400 })
    }

    // Criar interesse
    const interesse = await prisma.interesse.create({
      data: {
        ...validacao.data,
        contratanteId: session.user.id
      },
      include: {
        anuncio: {
          include: {
            veiculo: true,
            implemento: true,
            motorista: {
              select: {
                id: true,
                nome: true,
                telefone: true
              }
            }
          }
        },
        contratante: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(interesse, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar interesse:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// GET - Listar interesses do contratante
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100)
    const status = searchParams.get("status")

    const where: Record<string, any> = {
      contratanteId: session.user.id
    }

    if (status) {
      where.status = status
    }

    const [interesses, total] = await Promise.all([
      prisma.interesse.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { 
          anuncio: {
            include: {
              veiculo: true,
              implemento: true,
              motorista: {
                select: {
                  id: true,
                  nome: true,
                  telefone: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.interesse.count({ where })
    ])

    return NextResponse.json({
      data: interesses,
      pagination: { 
        page, 
        limit, 
        total, 
        pages: Math.ceil(total / limit) 
      }
    })
  } catch (error) {
    console.error("Erro ao listar interesses:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
