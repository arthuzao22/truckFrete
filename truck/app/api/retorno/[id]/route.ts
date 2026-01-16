import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

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
      where: { id },
      include: { veiculo: true }
    })

    if (!anuncio) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 })
    }

    // Verificar se o veículo pertence ao usuário
    if (anuncio.veiculo.usuarioId !== (session.user as any).id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    await prisma.anuncioRetorno.update({
      where: { id },
      data: { ativo: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao desativar anúncio:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
