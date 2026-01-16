import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Listar interesses de um anúncio (apenas o motorista dono)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o anúncio pertence ao motorista
    const anuncio = await prisma.anuncioRetorno.findUnique({
      where: { id }
    })

    if (!anuncio) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    if (anuncio.motoristaId !== session.user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100)
    const status = searchParams.get("status")

    const where: Record<string, any> = {
      anuncioId: id
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
          contratante: {
            select: {
              id: true,
              nome: true,
              telefone: true,
              email: true
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
    console.error("Erro ao listar interesses do anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
