import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">FreteConnect</h1>
        <div className="flex gap-4">
          <Link href="/rotas">
            <Button variant="secondary">Ver Rotas</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Entrar</Button>
          </Link>
          <Link href="/registro">
            <Button>Cadastrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Marketplace de Caminhoneiros
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Motoristas anunciam suas rotas disponíveis. Contratantes encontram o caminhão ideal para sua carga.
          Conectamos quem precisa com quem pode transportar.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/rotas">
            <Button className="text-lg px-8 py-3">
              🔍 Ver Rotas Disponíveis
            </Button>
          </Link>
          <Link href="/registro">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Cadastrar-se
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Para Motoristas */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <h4 className="text-2xl font-bold text-blue-600 mb-4">
                🚛 Para Motoristas
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li>✅ Cadastre seus veículos e implementos</li>
                <li>✅ Anuncie suas rotas disponíveis</li>
                <li>✅ Receba propostas de contratantes interessados</li>
                <li>✅ Negocie diretamente com contratantes</li>
                <li>✅ Aumente sua receita com rotas planejadas</li>
              </ul>
              <Link href="/registro" className="mt-6 inline-block">
                <Button>Sou Motorista</Button>
              </Link>
            </div>

            {/* Para Contratantes */}
            <div className="bg-green-50 p-8 rounded-lg">
              <h4 className="text-2xl font-bold text-green-600 mb-4">
                📦 Para Contratantes
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li>✅ Veja rotas disponíveis em tempo real</li>
                <li>✅ Filtre por origem, destino e tipo de carga</li>
                <li>✅ Entre em contato direto com motoristas</li>
                <li>✅ Compare implementos e capacidades</li>
                <li>✅ Encontre o caminhão ideal para sua carga</li>
              </ul>
              <div className="flex gap-3 mt-6">
                <Link href="/rotas">
                  <Button variant="secondary">Ver Rotas</Button>
                </Link>
                <Link href="/registro">
                  <Button>Cadastrar</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Por Que FreteConnect?</h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-2">Matching Inteligente</h4>
              <p className="text-gray-700">
                Algoritmo avançado que considera rota, capacidade, tipo de carga e timing
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h4 className="text-xl font-bold mb-2">Economia Real</h4>
              <p className="text-gray-700">
                Reduza custos aproveitando fretes de retorno e elimine viagens vazias
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h4 className="text-xl font-bold mb-2">Seguro e Confiável</h4>
              <p className="text-gray-700">
                Sistema completo de autenticação, validação e negociação direta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de motoristas e contratantes que já estão economizando
            com o FreteConnect
          </p>
          <Link href="/registro">
            <Button className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-gray-100">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 FreteConnect. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Marketplace Inteligente de Fretes de Retorno</p>
        </div>
      </footer>
    </div>
  )
}

