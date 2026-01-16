import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// DELETE - Excluir veículo (soft delete)
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

    // Verificar se o veículo pertence ao usuário
    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id,
        usuarioId: (session.user as any).id
      }
    })

    if (!veiculo) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      )
    }

    // Soft delete - marca como inativo o veículo e seus implementos
    await prisma.$transaction([
      prisma.implemento.updateMany({
        where: { veiculoId: id },
        data: { ativo: false }
      }),
      prisma.veiculo.update({
        where: { id },
        data: { ativo: false }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir veículo:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// GET - Buscar veículo específico
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

    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id,
        ativo: true,
        usuarioId: (session.user as any).id
      },
      include: {
        implementos: {
          where: { ativo: true }
        }
      }
    })

    if (!veiculo) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(veiculo)
  } catch (error) {
    console.error("Erro ao buscar veículo:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
