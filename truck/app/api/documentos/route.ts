// FreteConnect 2.0 - Documentos API
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

const documentoSchema = z.object({
  tipo: z.enum([
    "CNH",
    "CRLV",
    "ANTT",
    "COMPROVANTE_RESIDENCIA",
    "FOTO_VEICULO",
    "FOTO_PERFIL",
    "OUTROS",
  ]),
  numero: z.string().optional(),
  url: z.string().url("URL inválida"),
  validoAte: z.string().datetime().optional(),
})

// GET - Listar documentos do usuário
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get("tipo")
    const status = searchParams.get("status")

    const where: any = {
      usuarioId: session.user.id,
    }

    if (tipo) where.tipo = tipo
    if (status) where.status = status

    const documentos = await prisma.documento.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: documentos })
  } catch (error) {
    console.error("Erro ao listar documentos:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Upload de documento
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const validacao = documentoSchema.safeParse(body)

    if (!validacao.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: validacao.error.flatten() },
        { status: 400 }
      )
    }

    const documento = await prisma.documento.create({
      data: {
        ...validacao.data,
        usuarioId: session.user.id,
        validoAte: validacao.data.validoAte
          ? new Date(validacao.data.validoAte)
          : undefined,
      },
    })

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        tipo: "SISTEMA",
        titulo: "Documento enviado",
        mensagem: `Seu documento ${validacao.data.tipo} foi enviado e está em análise.`,
        usuarioId: session.user.id,
      },
    })

    return NextResponse.json(documento, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar documento:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// PATCH - Atualizar status do documento (Admin apenas)
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    const body = await request.json()
    const { id, status, motivoRejeicao } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID e status obrigatórios" },
        { status: 400 }
      )
    }

    const documento = await prisma.documento.update({
      where: { id },
      data: {
        status,
        motivoRejeicao: status === "REJEITADO" ? motivoRejeicao : null,
      },
      include: { usuario: true },
    })

    // Notificar usuário
    await prisma.notificacao.create({
      data: {
        tipo:
          status === "APROVADO"
            ? "DOCUMENTO_APROVADO"
            : "DOCUMENTO_REJEITADO",
        titulo:
          status === "APROVADO"
            ? "Documento aprovado"
            : "Documento rejeitado",
        mensagem:
          status === "APROVADO"
            ? `Seu documento ${documento.tipo} foi aprovado.`
            : `Seu documento ${documento.tipo} foi rejeitado. Motivo: ${motivoRejeicao}`,
        usuarioId: documento.usuarioId,
      },
    })

    return NextResponse.json(documento)
  } catch (error) {
    console.error("Erro ao atualizar documento:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
