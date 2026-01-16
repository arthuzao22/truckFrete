import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Plus, Package, Search, TrendingUp, MessageCircle } from "lucide-react"
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
        {/* Header */}
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
            iconName="truck"
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Anúncios de Retorno"
            value={stats[1]}
            iconName="package"
            color="green"
          />
          <StatsCard
            title="Fretes em Andamento"
            value={stats[2]}
            iconName="clock"
            color="purple"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Quick Actions */}
        <Card variant="glass">
          <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
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
            <h3 className="text-lg font-semibold text-white mb-4">
              📊 Suas Estatísticas
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-400">Total de fretes realizados</span>
                <span className="font-semibold text-white">0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-400">Avaliação média</span>
                <span className="font-semibold text-yellow-400">⭐ 0.0</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Taxa de conclusão</span>
                <span className="font-semibold text-green-400">0%</span>
              </div>
            </div>
          </Card>

          <Card variant="glass">
            <h3 className="text-lg font-semibold text-white mb-4">
              💡 Dicas para Começar
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">1</span>
                <span className="text-gray-300">Cadastre seus veículos (cavalo mecânico + implementos)</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">2</span>
                <span className="text-gray-300">Anuncie quando estiver com retorno disponível</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">3</span>
                <span className="text-gray-300">Receba notificações de fretes compatíveis</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold border border-green-500/30">4</span>
                <span className="text-gray-300">Aumente sua receita eliminando viagens vazias!</span>
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
      {/* Header */}
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
          iconName="package"
          color="blue"
        />
        <StatsCard
          title="Em Transporte"
          value={stats[1]}
          iconName="truck"
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Matches Disponíveis"
          value={stats[2]}
          iconName="trending-up"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
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
          <h3 className="text-lg font-semibold text-white mb-4">
            📊 Suas Estatísticas
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-400">Total de fretes publicados</span>
              <span className="font-semibold text-white">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-400">Economia estimada</span>
              <span className="font-semibold text-green-400">R$ 0,00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Taxa de satisfação</span>
              <span className="font-semibold text-yellow-400">⭐ 0.0</span>
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <h3 className="text-lg font-semibold text-white mb-4">
            💡 Dicas para Começar
          </h3>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">1</span>
              <span className="text-gray-300">Publique suas necessidades de frete</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">2</span>
              <span className="text-gray-300">Nosso algoritmo encontra veículos compatíveis</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">3</span>
              <span className="text-gray-300">Prioriza veículos em rota de retorno (menor custo)</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold border border-green-500/30">4</span>
              <span className="text-gray-300">Economize até 40% aproveitando retornos!</span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
