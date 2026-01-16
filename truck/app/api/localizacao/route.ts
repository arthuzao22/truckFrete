// FreteConnect - API de Localização (GPS Tracking)
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { localizacaoSchema, localizacaoQuerySchema } from "@/lib/validators/localizacao"

// POST - Salvar localização do veículo
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const validation = localizacaoSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { freteId, ...localizacaoData } = validation.data

    // Se freteId fornecido, verificar se o usuário é o motorista
    if (freteId) {
      const frete = await prisma.frete.findUnique({
        where: { id: freteId },
        select: { motoristaId: true },
      })

      if (!frete) {
        return NextResponse.json({ error: "Frete não encontrado" }, { status: 404 })
      }

      if (frete.motoristaId !== session.user.id) {
        return NextResponse.json(
          { error: "Apenas o motorista do frete pode enviar localização" },
          { status: 403 }
        )
      }
    }

    // Salvar localização
    const localizacao = await prisma.localizacao.create({
      data: {
        ...localizacaoData,
        usuarioId: session.user.id,
        freteId: freteId || null,
      },
    })

    return NextResponse.json(localizacao, { status: 201 })
  } catch (error) {
    console.error("Erro ao salvar localização:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// GET - Obter localização(ões)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const validation = localizacaoQuerySchema.safeParse({
      usuarioId: searchParams.get("usuarioId"),
      freteId: searchParams.get("freteId"),
      limit: searchParams.get("limit"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", detalhes: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { usuarioId, freteId, limit, startDate, endDate } = validation.data

    // Construir where clause
    const where: any = {}

    if (freteId) {
      // Verificar permissão para acessar localização do frete
      const frete = await prisma.frete.findUnique({
        where: { id: freteId },
        select: { motoristaId: true, contratanteId: true },
      })

      if (!frete) {
        return NextResponse.json({ error: "Frete não encontrado" }, { status: 404 })
      }

      const hasAccess =
        frete.motoristaId === session.user.id || frete.contratanteId === session.user.id

      if (!hasAccess) {
        return NextResponse.json(
          { error: "Sem permissão para acessar localização deste frete" },
          { status: 403 }
        )
      }

      where.freteId = freteId
    } else if (usuarioId) {
      // Verificar se é o próprio usuário
      if (usuarioId !== session.user.id) {
        return NextResponse.json(
          { error: "Você só pode acessar suas próprias localizações" },
          { status: 403 }
        )
      }
      where.usuarioId = usuarioId
    } else {
      // Default: localizações do usuário logado
      where.usuarioId = session.user.id
    }

    // Filtro de data
    if (startDate || endDate) {
      where.timestamp = {} as Record<string, Date>
      if (startDate) where.timestamp.gte = startDate
      if (endDate) where.timestamp.lte = endDate
    }

    // Buscar localizações
    const localizacoes = await prisma.localizacao.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        velocidade: true,
        direcao: true,
        precisao: true,
        timestamp: true,
        freteId: true,
      },
    })

    // Retornar última localização ou histórico
    if (searchParams.get("latest") === "true" && localizacoes.length > 0) {
      return NextResponse.json({ data: localizacoes[0] })
    }

    return NextResponse.json({ data: localizacoes, total: localizacoes.length })
  } catch (error) {
    console.error("Erro ao buscar localização:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
