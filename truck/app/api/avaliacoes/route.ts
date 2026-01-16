// FreteConnect - API de Avaliações
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { avaliacaoSchema, avaliacaoQuerySchema } from "@/lib/validators/avaliacao"

// GET - Listar avaliações de um usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const validation = avaliacaoQuerySchema.safeParse({
      usuarioId: searchParams.get("usuarioId"),
      page: searchParams.get("page"),
      perPage: searchParams.get("perPage"),
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", detalhes: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { usuarioId, page, perPage } = validation.data
    const targetUserId = usuarioId || session.user.id

    // Buscar avaliações recebidas
    const [avaliacoes, total, stats] = await Promise.all([
      prisma.avaliacao.findMany({
        where: { avaliadoId: targetUserId },
        include: {
          avaliador: {
            select: { id: true, nome: true, role: true },
          },
          frete: {
            select: { id: true, origemCidade: true, destinoCidade: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.avaliacao.count({ where: { avaliadoId: targetUserId } }),
      prisma.avaliacao.aggregate({
        where: { avaliadoId: targetUserId },
        _avg: {
          nota: true,
          pontualidade: true,
          comunicacao: true,
          qualidade: true,
        },
        _count: { id: true },
      }),
    ])

    // Calcular distribuição de estrelas
    const distribuicao = await prisma.avaliacao.groupBy({
      by: ["nota"],
      where: { avaliadoId: targetUserId },
      _count: { nota: true },
    })

    const distribuicaoMap = distribuicao.reduce(
      (acc, item) => {
        acc[item.nota] = item._count.nota
        return acc
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
    )

    return NextResponse.json({
      data: avaliacoes,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
      stats: {
        media: stats._avg.nota || 0,
        mediaPontualidade: stats._avg.pontualidade || 0,
        mediaComunicacao: stats._avg.comunicacao || 0,
        mediaQualidade: stats._avg.qualidade || 0,
        totalAvaliacoes: stats._count.id,
        distribuicao: distribuicaoMap,
      },
    })
  } catch (error) {
    console.error("Erro ao listar avaliações:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Criar avaliação (após frete concluído)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const validation = avaliacaoSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { freteId, avaliadoId, ...avaliacaoData } = validation.data

    // Verificar se o frete existe e está concluído
    const frete = await prisma.frete.findUnique({
      where: { id: freteId },
      include: { motorista: true, contratante: true },
    })

    if (!frete) {
      return NextResponse.json({ error: "Frete não encontrado" }, { status: 404 })
    }

    if (frete.status !== "ENTREGUE") {
      return NextResponse.json(
        { error: "Só é possível avaliar fretes concluídos" },
        { status: 400 }
      )
    }

    // Verificar se o usuário logado está relacionado ao frete
    const isMotorista = frete.motoristaId === session.user.id
    const isContratante = frete.contratanteId === session.user.id

    if (!isMotorista && !isContratante) {
      return NextResponse.json(
        { error: "Você não tem permissão para avaliar este frete" },
        { status: 403 }
      )
    }

    // Verificar se está avaliando a pessoa correta
    const shouldEvaluateMotorista = isContratante
    const shouldEvaluateContratante = isMotorista

    if (shouldEvaluateMotorista && avaliadoId !== frete.motoristaId) {
      return NextResponse.json(
        { error: "Contratante deve avaliar o motorista" },
        { status: 400 }
      )
    }

    if (shouldEvaluateContratante && avaliadoId !== frete.contratanteId) {
      return NextResponse.json(
        { error: "Motorista deve avaliar o contratante" },
        { status: 400 }
      )
    }

    // Verificar se já existe avaliação
    const avaliacaoExistente = await prisma.avaliacao.findUnique({
      where: {
        freteId_avaliadorId: {
          freteId,
          avaliadorId: session.user.id,
        },
      },
    })

    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: "Você já avaliou este frete" },
        { status: 409 }
      )
    }

    // Criar avaliação
    const avaliacao = await prisma.avaliacao.create({
      data: {
        ...avaliacaoData,
        freteId,
        avaliadoId,
        avaliadorId: session.user.id,
      },
      include: {
        avaliador: {
          select: { id: true, nome: true, role: true },
        },
        avaliado: {
          select: { id: true, nome: true, role: true },
        },
        frete: {
          select: { id: true, origemCidade: true, destinoCidade: true },
        },
      },
    })

    // Criar notificação para o avaliado
    await prisma.notificacao.create({
      data: {
        tipo: "SISTEMA",
        titulo: "Nova avaliação recebida",
        mensagem: `${session.user.nome || "Um usuário"} avaliou você com ${avaliacao.nota} estrelas`,
        link: `/perfil`,
        usuarioId: avaliadoId,
      },
    })

    return NextResponse.json(avaliacao, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar avaliação:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
