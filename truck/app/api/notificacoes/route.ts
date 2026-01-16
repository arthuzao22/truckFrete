// FreteConnect 2.0 - Notificações API
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET - Listar notificações do usuário
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const apenasNaoLidas = searchParams.get("naoLidas") === "true"

    const where = {
      usuarioId: session.user.id,
      ...(apenasNaoLidas && { lida: false }),
    }

    const [notificacoes, total] = await Promise.all([
      prisma.notificacao.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notificacao.count({ where }),
    ])

    const naoLidas = await prisma.notificacao.count({
      where: { usuarioId: session.user.id, lida: false },
    })

    return NextResponse.json({
      data: notificacoes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      naoLidas,
    })
  } catch (error) {
    console.error("Erro ao listar notificações:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Criar notificação (uso interno ou admin)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, titulo, mensagem, usuarioId, link, data } = body

    // Apenas admin pode criar notificações para outros usuários
    if (usuarioId && usuarioId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const notificacao = await prisma.notificacao.create({
      data: {
        tipo,
        titulo,
        mensagem,
        usuarioId: usuarioId || session.user.id,
        link,
        data: data ? JSON.stringify(data) : null,
      },
    })

    return NextResponse.json(notificacao, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar notificação:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// PATCH - Marcar como lida
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { ids, marcarTodasComoLida } = body

    if (marcarTodasComoLida) {
      await prisma.notificacao.updateMany({
        where: {
          usuarioId: session.user.id,
          lida: false,
        },
        data: { lida: true },
      })
      return NextResponse.json({ success: true })
    }

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 })
    }

    await prisma.notificacao.updateMany({
      where: {
        id: { in: ids },
        usuarioId: session.user.id,
      },
      data: { lida: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao marcar notificações:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
