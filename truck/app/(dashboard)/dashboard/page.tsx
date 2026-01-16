import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const userId = session.user.id
  const role = session.user.role

  let stats
  
  if (role === "MOTORISTA") {
    stats = await prisma.$transaction([
      prisma.veiculo.count({ where: { usuarioId: userId, ativo: true } }),
      prisma.anuncioRetorno.count({ 
        where: { 
          veiculo: { usuarioId: userId },
          ativo: true 
        } 
      }),
      prisma.frete.count({ 
        where: { 
          motoristaId: userId,
          status: { in: ["ACEITO", "EM_TRANSPORTE"] }
        }
      })
    ])

    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard - Motorista</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Veículos</h3>
            <p className="text-4xl font-bold text-blue-600">{stats[0]}</p>
            <Link href="/veiculos" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Gerenciar veículos →
            </Link>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Anúncios Ativos</h3>
            <p className="text-4xl font-bold text-green-600">{stats[1]}</p>
            <Link href="/retorno" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Ver anúncios →
            </Link>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Fretes em Andamento</h3>
            <p className="text-4xl font-bold text-purple-600">{stats[2]}</p>
            <Link href="/fretes" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Ver fretes →
            </Link>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-xl font-bold mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link 
                href="/veiculos?novo=true" 
                className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
              >
                ➕ Cadastrar novo veículo
              </Link>
              <Link 
                href="/retorno?novo=true" 
                className="block px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
              >
                📢 Anunciar retorno disponível
              </Link>
              <Link 
                href="/fretes" 
                className="block px-4 py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
              >
                🔍 Buscar fretes disponíveis
              </Link>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Como funciona</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li>1. Cadastre seus veículos (cavalo mecânico + implementos)</li>
              <li>2. Anuncie quando estiver com retorno disponível</li>
              <li>3. Receba notificações de fretes compatíveis</li>
              <li>4. Negocie diretamente com o contratante pelo chat</li>
              <li>5. Aumente sua receita eliminando viagens vazias!</li>
            </ol>
          </Card>
        </div>
      </div>
    )
  }

  // CONTRATANTE
  stats = await prisma.$transaction([
    prisma.frete.count({ where: { contratanteId: userId, status: "ABERTO" } }),
    prisma.frete.count({ where: { contratanteId: userId, status: "EM_TRANSPORTE" } }),
    prisma.match.count({ 
      where: { 
        frete: { contratanteId: userId },
        status: "PENDENTE"
      }
    })
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard - Contratante</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Fretes Abertos</h3>
          <p className="text-4xl font-bold text-blue-600">{stats[0]}</p>
          <Link href="/fretes" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Ver fretes →
          </Link>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Em Transporte</h3>
          <p className="text-4xl font-bold text-green-600">{stats[1]}</p>
          <Link href="/fretes" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Acompanhar →
          </Link>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Matches Disponíveis</h3>
          <p className="text-4xl font-bold text-purple-600">{stats[2]}</p>
          <Link href="/matches" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Ver matches →
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="text-xl font-bold mb-4">Ações Rápidas</h3>
          <div className="space-y-2">
            <Link 
              href="/fretes?novo=true" 
              className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
            >
              ➕ Publicar novo frete
            </Link>
            <Link 
              href="/matches" 
              className="block px-4 py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
            >
              🎯 Ver matches inteligentes
            </Link>
            <Link 
              href="/chat" 
              className="block px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
            >
              💬 Negociar com motoristas
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4">Como funciona</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1. Publique suas necessidades de frete</li>
            <li>2. Nosso algoritmo encontra veículos compatíveis</li>
            <li>3. Prioriza veículos em rota de retorno (menor custo)</li>
            <li>4. Negocie valores diretamente pelo chat</li>
            <li>5. Economize até 40% aproveitando retornos!</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
