import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { mensagemSchema } from "@/lib/validators/schemas"

// GET - Listar mensagens
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const freteId = searchParams.get("freteId")
    const userId = (session.user as any).id

    let where: any = {
      OR: [
        { remetenteId: userId },
        { destinatarioId: userId }
      ]
    }

    if (freteId) {
      where.freteId = freteId
    }

    const mensagens = await prisma.mensagem.findMany({
      where,
      include: {
        remetente: {
          select: {
            id: true,
            nome: true
          }
        },
        destinatario: {
          select: {
            id: true,
            nome: true
          }
        },
        frete: {
          select: {
            id: true,
            origemCidade: true,
            destinoCidade: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    })

    return NextResponse.json({ data: mensagens })
  } catch (error) {
    console.error("Erro ao listar mensagens:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Enviar mensagem
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const validacao = mensagemSchema.safeParse(body)
    
    if (!validacao.success) {
      return NextResponse.json({ 
        error: "Dados inválidos", 
        detalhes: validacao.error.flatten() 
      }, { status: 400 })
    }

    const { conteudo, destinatarioId, freteId } = validacao.data

    // Verificar se destinatário existe
    const destinatario = await prisma.usuario.findUnique({
      where: { id: destinatarioId }
    })

    if (!destinatario) {
      return NextResponse.json({ error: "Destinatário não encontrado" }, { status: 404 })
    }

    // Se tem freteId, verificar permissão
    if (freteId) {
      const frete = await prisma.frete.findUnique({
        where: { id: freteId }
      })

      if (!frete) {
        return NextResponse.json({ error: "Frete não encontrado" }, { status: 404 })
      }

      const userId = (session.user as any).id
      const isContratante = frete.contratanteId === userId
      const isMotorista = frete.motoristaId === userId

      if (!isContratante && !isMotorista) {
        return NextResponse.json({ error: "Sem permissão para este frete" }, { status: 403 })
      }
    }

    const mensagem = await prisma.mensagem.create({
      data: {
        conteudo,
        remetenteId: (session.user as any).id,
        destinatarioId,
        freteId
      },
      include: {
        remetente: {
          select: {
            id: true,
            nome: true
          }
        },
        destinatario: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    return NextResponse.json(mensagem, { status: 201 })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
