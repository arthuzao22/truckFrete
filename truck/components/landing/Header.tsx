// FreteConnect 2.0 - Header Component
"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-white">FreteConnect</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#recursos"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Recursos
            </Link>
            <Link
              href="#como-funciona"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Como Funciona
            </Link>
            <Link
              href="#precos"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Preços
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/registro">
              <Button>Cadastrar</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 py-4 border-t border-gray-800"
          >
            <div className="flex flex-col gap-4">
              <Link
                href="#recursos"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link
                href="#como-funciona"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Como Funciona
              </Link>
              <Link
                href="#precos"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
                <Link href="/login">
                  <Button variant="ghost" fullWidth>
                    Entrar
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button fullWidth>Cadastrar</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}
