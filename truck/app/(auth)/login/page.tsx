"use client"

import { useState, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Email ou senha inválidos")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Erro ao fazer login")
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

        {/* Card de Login */}
        <Card variant="glass">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>

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
              name="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              required
            />

            <Input
              name="password"
              type="password"
              label="Senha"
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              className="mt-6"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta?{" "}
              <Link
                href="/registro"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </Card>

        {/* Credenciais de Demo */}
        <motion.div
          className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-400 text-center mb-2">
            <span className="text-blue-400 font-medium">Demo:</span> Use para testar
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><span className="text-gray-400">Motorista:</span> joao.silva@email.com</p>
            <p><span className="text-gray-400">Contratante:</span> transportes.rapido@empresa.com</p>
            <p><span className="text-gray-400">Senha:</span> 123456</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
