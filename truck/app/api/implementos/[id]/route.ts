import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// DELETE - Excluir implemento (soft delete)
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

    // Verificar se o implemento existe e pertence a um veículo do usuário
    const implemento = await prisma.implemento.findFirst({
      where: {
        id,
        veiculo: {
          usuarioId: session.user.id
        }
      }
    })

    if (!implemento) {
      return NextResponse.json(
        { error: "Implemento não encontrado" },
        { status: 404 }
      )
    }

    // Soft delete - apenas marca como inativo
    await prisma.implemento.update({
      where: { id },
      data: { ativo: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir implemento:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// GET - Buscar implemento específico
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

    const implemento = await prisma.implemento.findFirst({
      where: {
        id,
        ativo: true,
        veiculo: {
          usuarioId: session.user.id
        }
      },
      include: {
        veiculo: {
          select: {
            marca: true,
            modelo: true,
            placa: true
          }
        }
      }
    })

    if (!implemento) {
      return NextResponse.json(
        { error: "Implemento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(implemento)
  } catch (error) {
    console.error("Erro ao buscar implemento:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
