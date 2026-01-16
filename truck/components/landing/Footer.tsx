// FreteConnect 2.0 - Footer Component
"use client"

import Link from "next/link"
import { Truck, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FreteConnect</span>
            </div>
            <p className="text-gray-400 text-sm">
              Marketplace inteligente conectando cargas e caminhões.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#recursos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Recursos
                </Link>
              </li>
              <li>
                <Link
                  href="#como-funciona"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="#precos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-white mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ajuda"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                contato@freteconnect.com.br
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FreteConnect. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
