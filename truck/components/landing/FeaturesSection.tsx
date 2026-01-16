// FreteConnect 2.0 - Features Section
"use client"

import { motion } from "framer-motion"
import {
  MapPin,
  Truck,
  Clock,
  Shield,
  Zap,
  DollarSign,
  BarChart3,
  MessageCircle,
} from "lucide-react"
import { Card } from "@/components/ui/Card"

const features = [
  {
    icon: MapPin,
    title: "Matching Inteligente",
    description: "IA que conecta cargas com veículos em rota de retorno, economizando tempo e combustível.",
  },
  {
    icon: Truck,
    title: "Gestão Completa",
    description: "Gerencie cavalo mecânico, implementos e anúncios de retorno em um só lugar.",
  },
  {
    icon: Clock,
    title: "Tempo Real",
    description: "Rastreamento GPS e atualizações instantâneas via WebSocket.",
  },
  {
    icon: Shield,
    title: "Pagamento Seguro",
    description: "Sistema de custódia garante segurança para motorista e contratante.",
  },
  {
    icon: Zap,
    title: "Processos Rápidos",
    description: "Negociação ágil com chat integrado e notificações push.",
  },
  {
    icon: DollarSign,
    title: "Precificação Justa",
    description: "IA sugere preços baseados em histórico e condições de mercado.",
  },
  {
    icon: BarChart3,
    title: "Analytics Avançado",
    description: "Dashboard com métricas completas de performance e faturamento.",
  },
  {
    icon: MessageCircle,
    title: "Suporte 24/7",
    description: "Chat em tempo real e central de ajuda sempre disponível.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tudo que você precisa para{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              transportar melhor
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Recursos avançados que tornam o FreteConnect a melhor plataforma de
            fretes do Brasil
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" hover className="h-full">
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
