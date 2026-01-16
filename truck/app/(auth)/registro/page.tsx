"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">FreteConnect</h1>
          <p className="text-gray-600">Marketplace Inteligente de Fretes</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="mb-4">
              <label className="label">Tipo de Conta</label>
              <select name="role" className="input-field" required>
                <option value="">Selecione...</option>
                <option value="MOTORISTA">Motorista/Transportadora</option>
                <option value="CONTRATANTE">Contratante de Frete</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
