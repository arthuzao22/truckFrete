import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { veiculoSchema } from "@/lib/validators/schemas"

// GET - Listar veículos do usuário logado
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100)

    const [veiculos, total] = await Promise.all([
      prisma.veiculo.findMany({
        where: { 
          usuarioId: session.user.id,
          ativo: true 
        },
        skip: (page - 1) * limit,
        take: limit,
        include: { 
          implementos: {
            where: { ativo: true }
          } 
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.veiculo.count({ 
        where: { 
          usuarioId: session.user.id,
          ativo: true 
        } 
      })
    ])

    return NextResponse.json({
      data: veiculos,
      pagination: { 
        page, 
        limit, 
        total, 
        pages: Math.ceil(total / limit) 
      }
    })
  } catch (error) {
    console.error("Erro ao listar veículos:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Criar novo veículo
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const validacao = veiculoSchema.safeParse(body)
    
    if (!validacao.success) {
      return NextResponse.json({ 
        error: "Dados inválidos", 
        detalhes: validacao.error.flatten() 
      }, { status: 400 })
    }

    // Verificar se placa já existe
    const placaExiste = await prisma.veiculo.findUnique({
      where: { placa: validacao.data.placa }
    })

    if (placaExiste) {
      return NextResponse.json(
        { error: "Placa já cadastrada" },
        { status: 409 }
      )
    }

    const veiculo = await prisma.veiculo.create({
      data: { 
        ...validacao.data, 
        usuarioId: session.user.id 
      },
      include: { implementos: true }
    })

    return NextResponse.json(veiculo, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar veículo:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
