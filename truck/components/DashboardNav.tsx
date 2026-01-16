"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

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
    <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-400">
              FreteConnect
            </Link>

            <div className="hidden md:flex space-x-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.href)
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
