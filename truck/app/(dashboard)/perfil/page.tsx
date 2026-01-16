import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"

export default async function PerfilPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: {
      nome: true,
      email: true,
      cpfCnpj: true,
      telefone: true,
      role: true,
      createdAt: true
    }
  })

  if (!usuario) {
    redirect("/login")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="max-w-2xl">
        <Card>
          <h2 className="text-xl font-bold mb-6">Informações da Conta</h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">Nome Completo</label>
              <p className="text-gray-900 font-medium">{usuario.nome}</p>
            </div>

            <div>
              <label className="label">Email</label>
              <p className="text-gray-900 font-medium">{usuario.email}</p>
            </div>

            <div>
              <label className="label">CPF/CNPJ</label>
              <p className="text-gray-900 font-medium">{usuario.cpfCnpj}</p>
            </div>

            <div>
              <label className="label">Telefone</label>
              <p className="text-gray-900 font-medium">{usuario.telefone}</p>
            </div>

            <div>
              <label className="label">Tipo de Conta</label>
              <p className="text-gray-900 font-medium">
                {usuario.role === "MOTORISTA" ? "Motorista/Transportadora" : "Contratante de Frete"}
              </p>
            </div>

            <div>
              <label className="label">Membro desde</label>
              <p className="text-gray-900 font-medium">
                {new Date(usuario.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
