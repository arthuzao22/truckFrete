import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Truck, Package, Clock, TrendingUp, Plus, Search, MessageCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/Button"

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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Motorista
          </h1>
          <p className="text-gray-400">
            Bem-vindo de volta, {session.user.nome}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Veículos Ativos"
            value={stats[0]}
            icon={Truck}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Anúncios de Retorno"
            value={stats[1]}
            icon={Package}
            color="green"
          />
          <StatsCard
            title="Fretes em Andamento"
            value={stats[2]}
            icon={Clock}
            color="purple"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <Card variant="glass">
          <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <Link href="/veiculos?novo=true">
              <Button variant="outline" fullWidth icon={<Plus className="h-4 w-4" />}>
                Cadastrar Veículo
              </Button>
            </Link>
            <Link href="/retorno?novo=true">
              <Button variant="outline" fullWidth icon={<Package className="h-4 w-4" />}>
                Anunciar Retorno
              </Button>
            </Link>
            <Link href="/fretes">
              <Button variant="outline" fullWidth icon={<Search className="h-4 w-4" />}>
                Buscar Fretes
              </Button>
            </Link>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="glass">
            <h3 className="text-xl font-bold text-white mb-4">
              📊 Suas Estatísticas
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Total de fretes realizados</span>
                <span className="font-semibold text-white">0</span>
              </div>
              <div className="flex justify-between">
                <span>Avaliação média</span>
                <span className="font-semibold text-yellow-400">⭐ 0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de conclusão</span>
                <span className="font-semibold text-green-400">0%</span>
              </div>
            </div>
          </Card>

          <Card variant="glass">
            <h3 className="text-xl font-bold text-white mb-4">
              💡 Dicas para Começar
            </h3>
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-blue-400">1.</span>
                Cadastre seus veículos (cavalo mecânico + implementos)
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">2.</span>
                Anuncie quando estiver com retorno disponível
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">3.</span>
                Receba notificações de fretes compatíveis
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">4.</span>
                Aumente sua receita eliminando viagens vazias!
              </li>
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard Contratante
        </h1>
        <p className="text-gray-400">
          Bem-vindo de volta, {session.user.nome}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Fretes Abertos"
          value={stats[0]}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Em Transporte"
          value={stats[1]}
          icon={Truck}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Matches Disponíveis"
          value={stats[2]}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <Card variant="glass">
        <h3 className="text-xl font-bold text-white mb-4">Ações Rápidas</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/fretes?novo=true">
            <Button variant="outline" fullWidth icon={<Plus className="h-4 w-4" />}>
              Publicar Frete
            </Button>
          </Link>
          <Link href="/matches">
            <Button variant="outline" fullWidth icon={<TrendingUp className="h-4 w-4" />}>
              Ver Matches
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="outline" fullWidth icon={<MessageCircle className="h-4 w-4" />}>
              Mensagens
            </Button>
          </Link>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="glass">
          <h3 className="text-xl font-bold text-white mb-4">
            📊 Suas Estatísticas
          </h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Total de fretes publicados</span>
              <span className="font-semibold text-white">0</span>
            </div>
            <div className="flex justify-between">
              <span>Economia estimada</span>
              <span className="font-semibold text-green-400">R$ 0,00</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de satisfação</span>
              <span className="font-semibold text-yellow-400">⭐ 0.0</span>
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <h3 className="text-xl font-bold text-white mb-4">
            💡 Dicas para Começar
          </h3>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-blue-400">1.</span>
              Publique suas necessidades de frete
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">2.</span>
              Nosso algoritmo encontra veículos compatíveis
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">3.</span>
              Prioriza veículos em rota de retorno (menor custo)
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">4.</span>
              Economize até 40% aproveitando retornos!
            </li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
