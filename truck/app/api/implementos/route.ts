import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { implementoSchema } from "@/lib/validators/schemas"

// GET - Listar implementos de um veículo
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const veiculoId = searchParams.get("veiculoId")

    if (!veiculoId) {
      return NextResponse.json({ error: "veiculoId obrigatório" }, { status: 400 })
    }

    // Verificar se o veículo pertence ao usuário
    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id: veiculoId,
        usuarioId: session.user.id
      }
    })

    if (!veiculo) {
      return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 })
    }

    const implementos = await prisma.implemento.findMany({
      where: { 
        veiculoId,
        ativo: true 
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ data: implementos })
  } catch (error) {
    console.error("Erro ao listar implementos:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Criar novo implemento
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const validacao = implementoSchema.safeParse(body)
    
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

    // Verificar se placa já existe
    const placaExiste = await prisma.implemento.findUnique({
      where: { placa: validacao.data.placa }
    })

    if (placaExiste) {
      return NextResponse.json(
        { error: "Placa já cadastrada" },
        { status: 409 }
      )
    }

    const implemento = await prisma.implemento.create({
      data: validacao.data
    })

    return NextResponse.json(implemento, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar implemento:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
