"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"

// Função para formatar CPF/CNPJ
function formatCpfCnpj(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 11) {
    // CPF: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    // CNPJ: 00.000.000/0000-00
    return numbers
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }
}

// Função para formatar telefone
function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  
  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
  } else {
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  }
}

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [telefone, setTelefone] = useState("")

  function handleCpfCnpjChange(e: ChangeEvent<HTMLInputElement>) {
    setCpfCnpj(formatCpfCnpj(e.target.value))
  }

  function handleTelefoneChange(e: ChangeEvent<HTMLInputElement>) {
    setTelefone(formatPhone(e.target.value))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const dados = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      senha: formData.get("senha"),
      cpfCnpj: cpfCnpj.replace(/\D/g, ''), // Enviar apenas números
      telefone: telefone.replace(/\D/g, ''), // Enviar apenas números
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
        if (data.detalhes?.fieldErrors) {
          const errors = Object.entries(data.detalhes.fieldErrors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join('\n')
          setError(errors || data.error || "Erro ao criar conta")
        } else {
          setError(data.error || "Erro ao criar conta")
        }
      } else {
        router.push("/login?registered=true")
      }
    } catch {
      setError("Erro ao criar conta. Verifique sua conexão.")
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Criar Conta</h2>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded whitespace-pre-line">
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
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />

            <Input
              name="cpfCnpj"
              type="text"
              label="CPF ou CNPJ"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              value={cpfCnpj}
              onChange={handleCpfCnpjChange}
              maxLength={18}
              required
            />

            <Input
              name="telefone"
              type="tel"
              label="Telefone"
              placeholder="(11) 98888-8888"
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength={15}
              required
            />

            <Select
              name="role"
              label="Tipo de Conta"
              defaultValue=""
              required
              options={[
                { value: "", label: "Selecione o tipo de conta..." },
                { value: "MOTORISTA", label: "🚛 Motorista / Transportadora" },
                { value: "CONTRATANTE", label: "📦 Contratante de Frete" }
              ]}
            />

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
