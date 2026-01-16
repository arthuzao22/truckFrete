"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  const isActive = (path: string) => pathname.startsWith(path)

  const motoristaLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/veiculos", label: "Veículos" },
    { href: "/retorno", label: "Anúncios de Retorno" },
    { href: "/fretes", label: "Fretes Disponíveis" },
    { href: "/chat", label: "Mensagens" },
    { href: "/perfil", label: "Perfil" }
  ]

  const contratanteLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/fretes", label: "Meus Fretes" },
    { href: "/matches", label: "Matches" },
    { href: "/chat", label: "Mensagens" },
    { href: "/perfil", label: "Perfil" }
  ]

  const links = role === "MOTORISTA" ? motoristaLinks : contratanteLinks

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              FreteConnect
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
