// FreteConnect 2.0 - Wallet API
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET - Obter saldo da wallet
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Buscar ou criar wallet
    let wallet = await prisma.wallet.findUnique({
      where: { usuarioId: session.user.id },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          usuarioId: session.user.id,
          saldo: 0,
          saldoBloqueado: 0,
        },
      })
    }

    // Buscar últimas transações
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json({
      wallet,
      transacoes,
    })
  } catch (error) {
    console.error("Erro ao obter wallet:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// POST - Criar transação (depósito/saque)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, valor, metodoPagamento, descricao } = body

    if (!tipo || !valor || valor <= 0) {
      return NextResponse.json(
        { error: "Tipo e valor são obrigatórios" },
        { status: 400 }
      )
    }

    // Validar tipos permitidos para usuário
    const tiposPermitidos = ["DEPOSITO", "SAQUE"]
    if (!tiposPermitidos.includes(tipo)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
    }

    // Buscar ou criar wallet
    let wallet = await prisma.wallet.findUnique({
      where: { usuarioId: session.user.id },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          usuarioId: session.user.id,
          saldo: 0,
          saldoBloqueado: 0,
        },
      })
    }

    // Validar saldo para saque
    if (tipo === "SAQUE" && wallet.saldo < valor) {
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 })
    }

    // Criar transação
    const transacao = await prisma.transacao.create({
      data: {
        tipo,
        valor,
        descricao: descricao || `${tipo} de R$ ${valor.toFixed(2)}`,
        status: "PENDENTE",
        metodoPagamento,
        usuarioId: session.user.id,
      },
    })

    // TODO: Integrar com gateway de pagamento real
    // Por enquanto, apenas criar transação pendente

    // Criar notificação
    await prisma.notificacao.create({
      data: {
        tipo: "SISTEMA",
        titulo: `${tipo === "DEPOSITO" ? "Depósito" : "Saque"} solicitado`,
        mensagem: `Sua solicitação de ${tipo.toLowerCase()} de R$ ${valor.toFixed(2)} está sendo processada.`,
        usuarioId: session.user.id,
      },
    })

    return NextResponse.json(transacao, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar transação:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
