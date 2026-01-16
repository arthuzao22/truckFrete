// FreteConnect - Exemplo de Página de Perfil com Avaliações
// Este é um exemplo de como usar os novos componentes da Fase 2

import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { RatingStars } from "@/components/avaliacoes/RatingStars"
import { AvaliacaoCard } from "@/components/avaliacoes/AvaliacaoCard"
import { Breadcrumb } from "@/components/ui/Breadcrumb"
import { SkeletonProfile, SkeletonList } from "@/components/ui/Skeleton"

async function getPerfilData(userId: string) {
  const [usuario, avaliacoes, stats] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.avaliacao.findMany({
      where: { avaliadoId: userId },
      include: {
        avaliador: {
          select: { nome: true, role: true },
        },
        frete: {
          select: { origemCidade: true, destinoCidade: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.avaliacao.aggregate({
      where: { avaliadoId: userId },
      _avg: {
        nota: true,
        pontualidade: true,
        comunicacao: true,
        qualidade: true,
      },
      _count: { id: true },
    }),
  ])

  return { usuario, avaliacoes, stats }
}

export default async function PerfilPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const { usuario, avaliacoes, stats } = await getPerfilData(session.user.id)

  if (!usuario) {
    redirect("/dashboard")
  }

  const mediaGeral = stats._avg.nota || 0
  const totalAvaliacoes = stats._count.id

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Perfil" },
        ]}
        className="mb-6"
      />

      {/* Header do Perfil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {usuario.nome.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{usuario.nome}</h1>
            <p className="text-gray-600 mb-4 capitalize">
              {usuario.role.toLowerCase().replace("_", " ")}
            </p>

            {/* Avaliação Geral */}
            <div className="flex items-center gap-4 mb-4">
              <RatingStars value={mediaGeral} readonly size="lg" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{mediaGeral.toFixed(1)}</p>
                <p className="text-sm text-gray-500">{totalAvaliacoes} avaliações</p>
              </div>
            </div>

            {/* Estatísticas Detalhadas */}
            {totalAvaliacoes > 0 && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pontualidade</p>
                  <RatingStars value={stats._avg.pontualidade || 0} readonly size="sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Comunicação</p>
                  <RatingStars value={stats._avg.comunicacao || 0} readonly size="sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Qualidade</p>
                  <RatingStars value={stats._avg.qualidade || 0} readonly size="sm" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avaliações Recebidas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações Recebidas</h2>

        {avaliacoes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">Nenhuma avaliação ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map((avaliacao) => (
              <AvaliacaoCard key={avaliacao.id} avaliacao={avaliacao} showFrete />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Loading State
export function PerfilLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <SkeletonProfile />
      <div className="mt-6">
        <SkeletonList items={3} />
      </div>
    </div>
  )
}
