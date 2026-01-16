import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { freteSchema } from "@/lib/validators/schemas"

// GET - Listar fretes
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100)
    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    let where: any = {}

    // Contratantes veem apenas seus fretes
    if (userRole === "CONTRATANTE") {
      where.contratanteId = userId
    }
    // Motoristas veem fretes abertos ou seus próprios
    else if (userRole === "MOTORISTA") {
      where.OR = [
        { status: "ABERTO" },
        { motoristaId: userId }
      ]
    }

    const [fretes, total] = await Promise.all([
      prisma.frete.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { 
          contratante: {
            select: {
              id: true,
              nome: true,
              telefone: true
            }
          },
          motorista: {
            select: {
              id: true,
              nome: true,
              telefone: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.frete.count({ where })
    ])

    return NextResponse.json({
      data: fretes,
      pagination: { 
        page, 
        limit, 
        total, 
        pages: Math.ceil(total / limit) 
      }
    })
  } catch (error) {
    console.error("Erro ao listar fretes:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Criar novo frete (apenas CONTRATANTE)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "CONTRATANTE") {
      return NextResponse.json(
        { error: "Apenas contratantes podem criar fretes" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validacao = freteSchema.safeParse(body)
    
    if (!validacao.success) {
      return NextResponse.json({ 
        error: "Dados inválidos", 
        detalhes: validacao.error.flatten() 
      }, { status: 400 })
    }

    const frete = await prisma.frete.create({
      data: { 
        ...validacao.data, 
        contratanteId: (session.user as any).id 
      },
      include: {
        contratante: {
          select: {
            id: true,
            nome: true,
            telefone: true
          }
        }
      }
    })

    return NextResponse.json(frete, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar frete:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
