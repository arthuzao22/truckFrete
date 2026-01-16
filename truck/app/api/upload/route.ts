// FreteConnect - API de Upload de Arquivos
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const uploadSchema = z.object({
  file: z.string(), // base64
  filename: z.string(),
  mimetype: z.string().refine((type) => ACCEPTED_IMAGE_TYPES.includes(type), {
    message: "Apenas imagens JPEG, PNG e WebP são aceitas",
  }),
  size: z.number().max(MAX_FILE_SIZE, `Arquivo deve ter no máximo ${MAX_FILE_SIZE / 1024 / 1024}MB`),
})

// POST - Upload de imagem (base64 temporário)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const validation = uploadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", detalhes: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { file, filename, mimetype, size } = validation.data

    // Verificar se é base64 válido
    if (!file.startsWith("data:")) {
      return NextResponse.json({ error: "Formato de arquivo inválido" }, { status: 400 })
    }

    // Em produção, aqui você integraria com Cloudinary, S3, etc.
    // Por ora, retornamos o próprio base64 como "URL"
    // TODO: Integrar com serviço de armazenamento em nuvem

    const url = file // Temporário: retorna o próprio base64

    return NextResponse.json(
      {
        url,
        filename,
        mimetype,
        size,
        uploadedAt: new Date().toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao fazer upload:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// DELETE - Remover arquivo (placeholder)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get("url")

    if (!fileUrl) {
      return NextResponse.json({ error: "URL do arquivo não fornecida" }, { status: 400 })
    }

    // TODO: Implementar deleção no serviço de armazenamento

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
