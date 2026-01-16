"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const dados = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      senha: formData.get("senha"),
      cpfCnpj: formData.get("cpfCnpj"),
      telefone: formData.get("telefone"),
      role: formData.get("role")
    }

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erro ao criar conta")
      } else {
        router.push("/login?registered=true")
      }
    } catch {
      setError("Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">FreteConnect</h1>
          <p className="text-gray-400">Marketplace Inteligente de Fretes</p>
        </div>

        {/* Card de Registro */}
        <Card variant="glass">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Criar Conta</h2>

          {error && (
            <motion.div
              className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="nome"
              type="text"
              label="Nome Completo"
              placeholder="João da Silva"
              required
            />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              required
            />

            <Input
              name="senha"
              type="password"
              label="Senha"
              placeholder="••••••••"
              minLength={6}
              required
            />

            <Input
              name="cpfCnpj"
              type="text"
              label="CPF/CNPJ"
              placeholder="000.000.000-00"
              required
            />

            <Input
              name="telefone"
              type="tel"
              label="Telefone"
              placeholder="(11) 98888-8888"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tipo de Conta
              </label>
              <select
                name="role"
                className="block w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                required
              >
                <option value="" className="bg-gray-900">Selecione...</option>
                <option value="MOTORISTA" className="bg-gray-900">Motorista/Transportadora</option>
                <option value="CONTRATANTE" className="bg-gray-900">Contratante de Frete</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              className="mt-6"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Faça login
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
