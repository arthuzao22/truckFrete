import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema de validação para atualização de status
const statusSchema = z.object({
  status: z.enum(["VISUALIZADO", "EM_NEGOCIACAO", "ACEITO", "RECUSADO", "CANCELADO"]),
  motivoRecusa: z.string().optional()
})

// PATCH - Atualizar status do interesse (motorista aceita/recusa)
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
    const validacao = statusSchema.safeParse(body)
    
    if (!validacao.success) {
      return NextResponse.json({ 
        error: "Dados inválidos", 
        detalhes: validacao.error.flatten() 
      }, { status: 400 })
    }

    // Buscar o interesse
    const interesse = await prisma.interesse.findUnique({
      where: { id },
      include: {
        anuncio: {
          include: {
            motorista: true
          }
        }
      }
    })

    if (!interesse) {
      return NextResponse.json({ error: "Interesse não encontrado" }, { status: 404 })
    }

    // Verificar permissão: motorista pode atualizar se for dono do anúncio
    // Contratante pode cancelar seu próprio interesse
    const isMotorista = interesse.anuncio.motoristaId === session.user.id
    const isContratante = interesse.contratanteId === session.user.id

    if (!isMotorista && !isContratante) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    // Contratante só pode cancelar
    if (isContratante && validacao.data.status !== "CANCELADO") {
      return NextResponse.json({ 
        error: "Contratante só pode cancelar o interesse" 
      }, { status: 403 })
    }

    // Atualizar interesse
    const interesseAtualizado = await prisma.interesse.update({
      where: { id },
      data: {
        status: validacao.data.status,
        motivoRecusa: validacao.data.motivoRecusa,
        respondidoEm: new Date()
      },
      include: {
        anuncio: {
          include: {
            veiculo: true,
            implemento: true,
            motorista: {
              select: {
                id: true,
                nome: true,
                telefone: true
              }
            }
          }
        },
        contratante: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(interesseAtualizado)
  } catch (error) {
    console.error("Erro ao atualizar interesse:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
