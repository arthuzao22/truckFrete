import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { registroSchema } from "@/lib/validators/schemas"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar dados
    const validacao = registroSchema.safeParse(body)
    
    if (!validacao.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: validacao.error.flatten() },
        { status: 400 }
      )
    }
    
    const { email, senha, nome, cpfCnpj, telefone, role } = validacao.data
    
    // Verificar se usuário já existe
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          { cpfCnpj }
        ]
      }
    })
    
    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Email ou CPF/CNPJ já cadastrado" },
        { status: 409 }
      )
    }
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10)
    
    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        email,
        senha: senhaHash,
        nome,
        cpfCnpj,
        telefone,
        role
      },
      select: {
        id: true,
        email: true,
        nome: true,
        role: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(usuario, { status: 201 })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
