import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { RotasPublicList } from "@/components/rotas/RotasPublicList"

export const metadata = {
  title: "Rotas Disponíveis - FreteConnect",
  description: "Encontre caminhoneiros disponíveis para sua carga"
}

export default function RotasPublicPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🚛 FreteConnect
          </Link>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/registro">
              <Button>Cadastre-se</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            🗺️ Rotas Disponíveis
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Encontre o caminhão ideal para sua carga
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <RotasPublicList />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 FreteConnect. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Marketplace de Caminhoneiros</p>
        </div>
      </footer>
    </div>
  )
}
