import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema de validação para atualização de status
const statusUpdateSchema = z.object({
  status: z.enum(["ATIVO", "PAUSADO", "EXPIRADO", "FECHADO", "CANCELADO"])
})

// GET - Buscar anúncio específico
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

    const anuncio = await prisma.anuncioRetorno.findUnique({
      where: { id },
      include: {
        veiculo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            placa: true
          }
        },
        implemento: {
          select: {
            id: true,
            tipoAplicacao: true,
            tipoEstrutura: true,
            placa: true,
            capacidadePeso: true
          }
        },
        _count: {
          select: {
            interesses: true
          }
        }
      }
    })

    if (!anuncio) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    // Verificar se o anúncio pertence ao motorista
    if (anuncio.motoristaId !== session.user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    return NextResponse.json(anuncio)
  } catch (error) {
    console.error("Erro ao buscar anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// PATCH - Atualizar status do anúncio
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const validacao = statusUpdateSchema.safeParse(body)
    if (!validacao.success) {
      return NextResponse.json({ 
        error: "Dados inválidos", 
        detalhes: validacao.error.flatten() 
      }, { status: 400 })
    }

    const anuncio = await prisma.anuncioRetorno.findUnique({
      where: { id }
    })

    if (!anuncio) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    // Verificar se o anúncio pertence ao motorista
    if (anuncio.motoristaId !== session.user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const anuncioAtualizado = await prisma.anuncioRetorno.update({
      where: { id },
      data: { 
        status: validacao.data.status,
        // Se fechar ou cancelar, marcar como inativo
        ativo: !["FECHADO", "CANCELADO"].includes(validacao.data.status)
      },
      include: {
        veiculo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            placa: true
          }
        },
        implemento: {
          select: {
            id: true,
            tipoAplicacao: true,
            tipoEstrutura: true,
            placa: true,
            capacidadePeso: true
          }
        },
        _count: {
          select: {
            interesses: true
          }
        }
      }
    })

    return NextResponse.json(anuncioAtualizado)
  } catch (error) {
    console.error("Erro ao atualizar anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// DELETE - Desativar anúncio de retorno
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { id } = await params

    const anuncio = await prisma.anuncioRetorno.findUnique({
      where: { id }
    })

    if (!anuncio) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    // Verificar se o anúncio pertence ao motorista
    if (anuncio.motoristaId !== session.user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    await prisma.anuncioRetorno.update({
      where: { id },
      data: { 
        ativo: false,
        status: "CANCELADO"
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao desativar anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
